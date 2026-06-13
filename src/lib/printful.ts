/**
 * Printful v2 API integration for merch fulfilment.
 *
 * Used by the merch redemption flow: admin approves a receipt →
 * this module creates a Printful order → Printful prints & ships
 * under FT branding (white-label).
 *
 * Lead product: Can Cooler (product 764, ~$7.78 landed)
 */

const PRINTFUL_BASE = "https://api.printful.com/v2";
const PRINTFUL_TOKEN = process.env.PRINTFUL_API_TOKEN || "";
const STORE_ID = "4438695"; // Flying Tumbler Printful store

/* ── types ── */

export interface PrintfulOrderItem {
  catalog_variant_id: number;
  quantity: number;
  files: {
    type: "default" | "back" | "label_inside" | "label_outside";
    url: string;
  }[];
}

export interface PrintfulRecipient {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  zip: string;
  country_code: string;
  phone?: string;
  email?: string;
}

export interface PrintfulOrder {
  id: number;
  status: string;
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
  created: string;
  shipping: string;
  estimated_fulfillment: string;
}

/* ── Can Cooler product config ── */

export const MERCH_PRODUCTS = {
  canCooler: {
    name: "Flying Tumbler Can Cooler",
    catalogProductId: 764,
    // Regular 12oz = 19461, Slim 12oz = 19462
    defaultVariantId: 19461,
    productCostEUR: 2.95,
    shippingCostEUR: 4.25,
    totalLandedEUR: 7.20,
    description: "Branded can cooler — keeps your drink cold and your style warm.",
    imageUrl: "/assets/merch-can-cooler.png", // placeholder until mockup generated
  },
} as const;

/* ── helpers ── */

async function printfulFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<unknown> {
  const url = `${PRINTFUL_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${PRINTFUL_TOKEN}`,
    "Content-Type": "application/json",
    "X-PF-Store-Id": STORE_ID,
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Printful API ${res.status}: ${body}`);
  }

  return res.json();
}

/* ── API functions ── */

/**
 * Create a draft order in Printful.
 * Draft orders need to be confirmed before they enter production.
 */
export async function createDraftOrder(
  recipient: PrintfulRecipient,
  items: PrintfulOrderItem[],
  externalId?: string
): Promise<{ id: number; status: string }> {
  const body = {
    recipient,
    items: items.map((item) => ({
      source: "catalog",
      catalog_variant_id: item.catalog_variant_id,
      quantity: item.quantity,
      files: item.files,
    })),
    ...(externalId ? { external_id: externalId } : {}),
  };

  const result = (await printfulFetch("/orders", {
    method: "POST",
    body: JSON.stringify(body),
  })) as { data: { id: number; status: string } };

  return result.data;
}

/**
 * Confirm a draft order — this submits it to production.
 * Once confirmed, Printful prints and ships it.
 */
export async function confirmOrder(
  orderId: number
): Promise<{ id: number; status: string }> {
  const result = (await printfulFetch(`/orders/${orderId}/confirmation`, {
    method: "POST",
  })) as { data: { id: number; status: string } };

  return result.data;
}

/**
 * Get order details (status, tracking, etc.)
 */
export async function getOrder(
  orderId: number
): Promise<{ id: number; status: string; shipping: string }> {
  const result = (await printfulFetch(`/orders/${orderId}`, {
    method: "GET",
  })) as { data: { id: number; status: string; shipping: string } };

  return result.data;
}

/**
 * Create a Can Cooler order — the primary merch item.
 * Takes a recipient and the URL of the design file.
 */
export async function createCanCoolerOrder(
  recipient: PrintfulRecipient,
  designFileUrl: string,
  externalId?: string
): Promise<{ id: number; status: string }> {
  const items: PrintfulOrderItem[] = [
    {
      catalog_variant_id: MERCH_PRODUCTS.canCooler.defaultVariantId,
      quantity: 1,
      files: [
        {
          type: "default",
          url: designFileUrl,
        },
      ],
    },
  ];

  return createDraftOrder(recipient, items, externalId);
}

/**
 * Get estimated shipping rates for a recipient.
 */
export async function getShippingRates(
  recipient: PrintfulRecipient,
  items: { catalog_variant_id: number; quantity: number }[]
): Promise<unknown> {
  const body = {
    recipient: {
      country_code: recipient.country_code,
      state_code: recipient.state_code,
      zip: recipient.zip,
    },
    items: items.map((item) => ({
      source: "catalog",
      catalog_variant_id: item.catalog_variant_id,
      quantity: item.quantity,
    })),
  };

  return printfulFetch("/shipping-rates", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

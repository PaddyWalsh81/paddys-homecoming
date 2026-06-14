/**
 * Printful v2 API integration for merch fulfilment.
 *
 * Used by the merch redemption flow: admin approves a receipt →
 * this module creates a Printful order → Printful prints & ships
 * under FT branding (white-label).
 *
 * 6-product menu confirmed 14 Jun 2026 — all under $11 landed.
 */

const PRINTFUL_BASE = "https://api.printful.com/v2";
const PRINTFUL_TOKEN = process.env.PRINTFUL_API_TOKEN || "";
const STORE_ID = "4438695"; // Flying Tumbler Printful store

/* ── types ── */

/** V2 placement layer — references an image URL for a print area */
export interface PrintfulPlacementLayer {
  type: "file";
  url: string;
}

/** V2 placement — defines where and how art is printed */
export interface PrintfulPlacement {
  placement: string;
  technique: string;
  layers: PrintfulPlacementLayer[];
}

/** V2 order item — uses placements instead of files */
export interface PrintfulOrderItem {
  catalog_variant_id: number;
  quantity: number;
  placements: PrintfulPlacement[];
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

/* ── Product key type (used throughout the app) ── */

export type MerchProductKey =
  | "sticker4x4"
  | "canCooler"
  | "corkCoaster"
  | "holoSticker"
  | "stickerSheet"
  | "notepad";

/* ── Full 6-product merch menu ── */

export const MERCH_PRODUCTS: Record<
  MerchProductKey,
  {
    name: string;
    shortName: string;
    catalogProductId: number;
    defaultVariantId: number;
    productCostUSD: number;
    shippingCostUSD: number;
    landedCostUSD: number;
    description: string;
    imageUrl: string;
    designUrl: string;
    /** Can cooler has front + back designs; others use "default" only */
    backDesignUrl?: string;
    /** V2 API: placement name (e.g. "default", "front") */
    placement: string;
    /** V2 API: back placement name (can cooler only) */
    backPlacement?: string;
    /** V2 API: printing technique (e.g. "digital", "sublimation") */
    technique: string;
  }
> = {
  sticker4x4: {
    name: "Kiss-Cut Sticker 4×4",
    shortName: "Sticker",
    catalogProductId: 358,
    defaultVariantId: 10164,
    productCostUSD: 3.25,
    shippingCostUSD: 4.29,
    landedCostUSD: 7.54,
    description: "A premium kiss-cut sticker with the Flying Tumbler bolt.",
    imageUrl: "/assets/merch/ft-sticker-4x4.png",
    designUrl: "https://paddys-homecoming.vercel.app/assets/merch/ft-sticker-4x4.png",
    placement: "default",
    technique: "digital",
  },
  canCooler: {
    name: "Can Cooler (12oz)",
    shortName: "Can Cooler",
    catalogProductId: 764,
    defaultVariantId: 19461,
    productCostUSD: 3.42,
    shippingCostUSD: 4.50,
    landedCostUSD: 7.92,
    description: "Branded can cooler — keeps your drink cold and your style warm.",
    imageUrl: "/assets/merch/ft-can-cooler-front.png",
    designUrl: "https://paddys-homecoming.vercel.app/assets/merch/ft-can-cooler-front.png",
    backDesignUrl: "https://paddys-homecoming.vercel.app/assets/merch/ft-can-cooler-back.png",
    placement: "front",
    backPlacement: "back",
    technique: "sublimation",
  },
  corkCoaster: {
    name: "Cork Back Coaster",
    shortName: "Coaster",
    catalogProductId: 611,
    defaultVariantId: 15662,
    productCostUSD: 5.50,
    shippingCostUSD: 3.99,
    landedCostUSD: 9.49,
    description: "Cork-backed coaster with the Flying Tumbler design.",
    imageUrl: "/assets/merch/ft-cork-coaster.png",
    designUrl: "https://paddys-homecoming.vercel.app/assets/merch/ft-cork-coaster.png",
    placement: "default",
    technique: "sublimation",
  },
  holoSticker: {
    name: "Holographic Sticker 4×4",
    shortName: "Holo Sticker",
    catalogProductId: 673,
    defaultVariantId: 16706,
    productCostUSD: 5.25,
    shippingCostUSD: 4.29,
    landedCostUSD: 9.54,
    description: "Holographic sticker that catches the light — Paddy approved.",
    imageUrl: "/assets/merch/ft-holographic-sticker-4x4.png",
    designUrl: "https://paddys-homecoming.vercel.app/assets/merch/ft-holographic-sticker-4x4.png",
    placement: "default",
    technique: "digital",
  },
  stickerSheet: {
    name: "Sticker Sheet A5",
    shortName: "Sticker Sheet",
    catalogProductId: 505,
    defaultVariantId: 12917,
    productCostUSD: 6.25,
    shippingCostUSD: 4.29,
    landedCostUSD: 10.54,
    description: "A5 sheet packed with Flying Tumbler stickers.",
    imageUrl: "/assets/merch/ft-sticker-sheet-a5.png",
    designUrl: "https://paddys-homecoming.vercel.app/assets/merch/ft-sticker-sheet-a5.png",
    placement: "default",
    technique: "digital",
  },
  notepad: {
    name: "Notepad 5.5×6",
    shortName: "Notepad",
    catalogProductId: 786,
    defaultVariantId: 19901,
    productCostUSD: 6.63,
    shippingCostUSD: 4.50,
    landedCostUSD: 11.13,
    description: "Handy notepad with the Flying Tumbler wordmark.",
    imageUrl: "/assets/merch/ft-notepad-5p5x6.png",
    designUrl: "https://paddys-homecoming.vercel.app/assets/merch/ft-notepad-5p5x6.png",
    placement: "default",
    technique: "digital",
  },
};

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
 * Create a draft order in Printful (v2 API — uses placements).
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
      placements: item.placements,
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
 * Create an order for any merch product by key.
 * Looks up the variant ID, placements, and design URLs from MERCH_PRODUCTS.
 * Uses v2 API placements format with correct technique per product.
 */
export async function createMerchOrder(
  productKey: MerchProductKey,
  recipient: PrintfulRecipient,
  externalId?: string
): Promise<{ id: number; status: string }> {
  const product = MERCH_PRODUCTS[productKey];
  if (!product) {
    throw new Error(`Unknown product key: ${productKey}`);
  }

  const placements: PrintfulPlacement[] = [
    {
      placement: product.placement,
      technique: product.technique,
      layers: [{ type: "file", url: product.designUrl }],
    },
  ];

  // Can cooler has a back design on a separate placement
  if (product.backDesignUrl && product.backPlacement) {
    placements.push({
      placement: product.backPlacement,
      technique: product.technique,
      layers: [{ type: "file", url: product.backDesignUrl }],
    });
  }

  const items: PrintfulOrderItem[] = [
    {
      catalog_variant_id: product.defaultVariantId,
      quantity: 1,
      placements,
    },
  ];

  return createDraftOrder(recipient, items, externalId);
}

/** @deprecated Use createMerchOrder("canCooler", ...) instead */
export async function createCanCoolerOrder(
  recipient: PrintfulRecipient,
  designFileUrl: string,
  externalId?: string
): Promise<{ id: number; status: string }> {
  return createMerchOrder("canCooler", recipient, externalId);
}

/**
 * Get estimated shipping rates for a recipient (v2 API).
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
    order_items: items.map((item) => ({
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

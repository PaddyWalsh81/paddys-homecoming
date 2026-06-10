import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paddy's Homecoming | Win 2 Flights to Ireland",
  description: "Follow Paddy Home. Enter for a chance to win 2 return flights to Ireland, courtesy of Flying Tumbler Irish Whiskey. No purchase necessary.",
  openGraph: {
    title: "Paddy's Homecoming | Win 2 Flights to Ireland",
    description: "Follow Paddy Home. Enter for a chance to win 2 return flights to Ireland.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

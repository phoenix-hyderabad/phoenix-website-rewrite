import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Providers from "~/components/Providers";
import Navbar from "~/components/nav/Navbar";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "PHoEnix",
  description:
    "The official website of the PHoEnix assoc, Bits Pilani Hyderabad Campus",
  keywords: ["phoenix", "bphc", "electronics", "bits"],
  icons: [{ rel: "icon", url: "/phoenix-logo.svg", type: "image/svg+xml" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="dark">
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

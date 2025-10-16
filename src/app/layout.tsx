import type { Metadata } from "next";
import { TRPCProvider } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blogging Platform",
  description: "A modern multi-user blogging platform built with Next.js 15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}

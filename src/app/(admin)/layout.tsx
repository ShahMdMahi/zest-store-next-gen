import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Zest Store",
  description: "Manage your store settings and products",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

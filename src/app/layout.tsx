import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "鹿呐烘焙 | Deer Bakery",
  description: "手工烘焙，自然之味。Handcrafted bakery with natural ingredients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

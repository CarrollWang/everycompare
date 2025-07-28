import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EverCompare - Professional Text Comparison Tool",
  description: "EverCompare is a professional text comparison and diff analysis tool. Compare documents, code files, and text content with advanced side-by-side visualization and powerful editing features.",
  keywords: "text comparison, diff tool, code comparison, document diff, text analysis, EverCompare",
  authors: [{ name: "EverCompare Team" }],
  openGraph: {
    title: "EverCompare - Professional Text Comparison Tool",
    description: "Professional text comparison and diff analysis tool",
    siteName: "EverCompare",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
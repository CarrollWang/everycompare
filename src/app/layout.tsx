import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EveryCompare - Professional Text Comparison Tool",
  description: "EveryCompare is a professional text comparison and diff analysis tool. Compare documents, code files, and text content with advanced side-by-side visualization and powerful editing features.",
  keywords: "text comparison, diff tool, code comparison, document diff, text analysis, EveryCompare",
  authors: [{ name: "EveryCompare Team" }],
  openGraph: {
    title: "EveryCompare - Professional Text Comparison Tool",
    description: "Professional text comparison and diff analysis tool",
    siteName: "EveryCompare",
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
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4ZHH6QJQKN"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4ZHH6QJQKN');
              gtag('config', 'G-CMY30VFYXC');
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
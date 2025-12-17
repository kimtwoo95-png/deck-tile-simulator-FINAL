import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALIVES 타일 계산기",
  description: "Deck tile calculator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}

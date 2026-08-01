import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safety and Health Management System",
  description: "안전보건 통합 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" />
      </head>
      <body className="min-h-full flex flex-col font-['Pretendard','Noto_Sans_KR',sans-serif] bg-[#f4f6f9] text-[#1e293b]">
        {children}
      </body>
    </html>
  );
}


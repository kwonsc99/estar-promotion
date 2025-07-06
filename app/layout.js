import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "이스타항공 - 어깨 P자 청년 힐링 여행",
  description: "힐링 즉흥 여행 지원 캠페인",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-[#DBF2FC] via-white to-[#F0F8FF]">
          {children}
        </div>
      </body>
    </html>
  );
}

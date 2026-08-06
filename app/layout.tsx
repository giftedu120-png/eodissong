import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "모먼트립 | 여행 발견의 시작",
  description: "사진, 이름, 현재 위치로 가까운 여행지를 발견하세요.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "어디쏭 | 부산을 담다, 길을 찾다",
  description: "사진, 이름, 현재 위치로 부산 여행지를 발견하는 어디쏭입니다.",
  icons: { icon: "/eodissong-logo.png", shortcut: "/eodissong-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}

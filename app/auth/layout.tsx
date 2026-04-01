import type { Metadata } from "next";
import { Jost, Unbounded } from "next/font/google";
import Header from "../components/layout/header";
import "../globals.css";

const jost = Jost({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jost",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Вход в систему | ИУБиП Хаб",
  description: "Авторизация в системе Студенческого Цифрового Хаба ИУБиП",
  keywords: ["вход", "авторизация", "ИУБиП", "хаб"],
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${jost.variable} ${unbounded.variable}`}>
      <body className="h-full overflow-hidden">
        <Header showAuthButton={false} />
        {children}
      </body>
    </html>
  );
}

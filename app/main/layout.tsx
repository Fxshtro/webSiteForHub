import type { Metadata } from "next";
import { Jost, Unbounded } from "next/font/google";
import Header from "../components/header";
import Footer from "../components/footer";
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
  title: "Студенческий Цифровой Хаб | ИУБиП",
  description:
    "Открытая площадка для студенческих лабораторий Южного Университета (ИУБиП) в Ростове-на-Дону. Исследуй, создавай, достигай вместе с нами!",
  keywords: [
    "ИУБиП",
    "студенческий хаб",
    "цифровой хаб",
    "лаборатории",
    "студенты",
    "Ростов-на-Дону",
    "Южный Университет",
    "IT",
    "разработка",
    "дизайн",
  ],
  authors: [{ name: "ИУБиП" }],
  openGraph: {
    title: "Студенческий Цифровой Хаб | ИУБиП",
    description: "Открытая площадка для студенческих лабораторий Южного Университета (ИУБиП)",
    type: "website",
    locale: "ru_RU",
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${jost.variable} ${unbounded.variable}`}>
      <body className="font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { fontVariables } from "../fonts";
import "../globals.css";

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
}>): React.JSX.Element {
  return (
    <html lang="ru" className={fontVariables}>
      <body className="font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

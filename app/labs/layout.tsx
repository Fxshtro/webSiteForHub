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
  title: "Лаборатории | Студенческий Цифровой Хаб",
  description:
    "Студенческие лаборатории Южного Университета (ИУБиП). Выберите направление и присоединяйтесь к команде профессионалов.",
  keywords: [
    "ИУБиП",
    "лаборатории",
    "студенческие проекты",
    "IT лаборатория",
    "Legal Tech",
    "Inno Travel",
    "Finprocess Tech",
    "Psy Tech",
    "Ростов-на-Дону",
  ],
  authors: [{ name: "ИУБиП" }],
  openGraph: {
    title: "Лаборатории | Студенческий Цифровой Хаб",
    description: "Студенческие лаборатории Южного Университета (ИУБиП)",
    type: "website",
    locale: "ru_RU",
  },
};

export default function LabsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${jost.variable} ${unbounded.variable}`}>
      <body className="font-sans name">
        <Header showAuthButton={true} />
        {children}
        <Footer />
      </body>
    </html>
  );
}

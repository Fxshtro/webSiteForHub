import type { Metadata } from "next";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { fontVariables } from "../fonts";
import "../globals.css";

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
}>): React.JSX.Element {
  return (
    <html lang="ru" className={fontVariables}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="font-sans">
        <Header showAuthButton={true} />
        {children}
        <Footer />
      </body>
    </html>
  );
}

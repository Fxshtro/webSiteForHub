import type { Metadata } from "next";
import Header from "../components/layout/header";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Вход в систему | ИУБиП Хаб",
  description: "Авторизация в системе Студенческого Цифрового Хаба ИУБиП",
  keywords: ["вход", "авторизация", "ИУБиП", "хаб"],
};

export default function AuthLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="ru" className={fontVariables}>
      <body className="h-full overflow-hidden">
        <Header showAuthButton={false} />
        {children}
      </body>
    </html>
  );
}

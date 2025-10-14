/* eslint-disable */
import Navbar from "./components/Navbar";
import "./globals.css";
/* eslint-enable */
import { ReactNode } from "react";

export const metadata = {
  title: "Todo App",
  description: "Full-stack Todo App using Laravel + Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}

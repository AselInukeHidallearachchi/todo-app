import Navbar from "./components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { ReactNode } from "react";
import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: "Todo App",
  description: "Full-stack Todo App using Laravel + Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <Navbar />
            <main className="flex-1 container mx-auto p-4">{children}</main>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

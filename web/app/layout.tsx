import Navbar from "./components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/context/ToastContext";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export const metadata = {
  title: "TaskToDo - Manage Your Tasks Efficiently",
  description:
    "A modern task management application built with Next.js and Laravel",
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
          <ToastProvider>
            <Navbar />
            <main className="flex-1 container mx-auto p-4">{children}</main>
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              expand={false}
            />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

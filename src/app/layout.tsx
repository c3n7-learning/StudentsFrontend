import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { BaseLayout } from "./base-layout";
import { Provider } from "react-redux";
import { store } from "@/store/store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Students",
  description: "A Student Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          <BaseLayout>{children}</BaseLayout>
        </TooltipProvider>
      </body>
    </html>
  );
}

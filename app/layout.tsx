import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { APP_NAME } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} — Wedding speeches, written for you`,
  description:
    "Answer a few questions about the couple and get a polished, personal wedding speech in minutes, ready to deliver.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900">
        {children}
      </body>
    </html>
  );
}

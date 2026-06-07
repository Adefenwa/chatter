import type { Metadata } from "next";
import { inter } from "./ui/font";
import Navbar from "@/components/shared/Navbar";
import MobileNav from "@/components/shared/MobileNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chatter — Read and Write What Matters",
  description: "A publishing platform for writers and readers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-[#0f172a]">
        <Navbar />
        <main className="pb-20 lg:pb-0">{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}

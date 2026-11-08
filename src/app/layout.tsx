import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus — Interactive Preview Studio",
  description: "Describe a digital product and turn the idea into an interactive frontend preview."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<Toaster theme="dark" richColors position="top-right" /></body></html>;
}

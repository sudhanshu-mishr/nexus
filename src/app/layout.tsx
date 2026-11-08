import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
export const metadata: Metadata = { title: "Nexus — Interactive Preview Studio", description: "Describe a digital product and turn the idea into an interactive frontend preview." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}<Toaster /></body></html>; }

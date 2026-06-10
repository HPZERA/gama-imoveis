import type { Metadata, Viewport } from "next";
import AdminGuard from "@/components/AdminGuard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Gama Imóveis",
  robots: "noindex,nofollow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.15,
  maximumScale: 3,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LayoutDashboard, Home, Users, UserCog, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/imoveis", label: "Imóveis", icon: Home },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/usuarios", label: "Usuários", icon: UserCog },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 bg-charcoal flex-col fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center">
              <Building2 size={18} className="text-charcoal" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-base font-bold text-white font-display">Gama</span>
              <span className="text-base font-bold text-brand font-display"> Imóveis</span>
              <p className="text-[9px] tracking-widest uppercase text-white/30">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active ? "bg-brand text-charcoal" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-colors w-full"
          >
            <LogOut size={18} strokeWidth={2} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-charcoal z-30 px-4 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <Building2 size={16} className="text-charcoal" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold font-display text-sm">Gama <span className="text-brand">Imóveis</span></span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white/60">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-charcoal z-20 pt-16 px-4">
          <nav className="space-y-1 py-4">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname.startsWith(href) ? "bg-brand text-charcoal" : "text-white/60"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 w-full"
            >
              <LogOut size={18} />
              Sair
            </button>
          </nav>
        </div>
      )}

      {/* Conteúdo */}
      <main className="flex-1 md:ml-60 pt-[58px] md:pt-0">
        {children}
      </main>
    </div>
  );
}

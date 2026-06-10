"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ToggleActiveButton({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();

  async function toggle() {
    await fetch("/api/admin/properties", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      title={active ? "Desativar" : "Ativar"}
      className={`p-1.5 rounded-lg transition-colors ${active ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
    >
      {active ? <Eye size={14} /> : <EyeOff size={14} />}
    </button>
  );
}

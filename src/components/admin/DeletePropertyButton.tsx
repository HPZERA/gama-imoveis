"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeletePropertyButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Excluir "${title}"? Esta ação não pode ser desfeita.`)) return;
    await fetch("/api/admin/properties", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    >
      <Trash2 size={14} />
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { UserCog, Trash2, Plus, Eye, EyeOff, Loader2 } from "lucide-react";

type User = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
};

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { loadUsers(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erro ao criar usuário");
    } else {
      setSuccess(`Usuário ${data.email} criado com sucesso!`);
      setEmail("");
      setPassword("");
      loadUsers();
    }
    setCreating(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Erro ao excluir usuário");
      return;
    }
    loadUsers();
  }

  return (
    <AdminShell>
      <div className="p-6 max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-display">Usuários</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie quem tem acesso ao painel administrativo</p>
        </div>

        {/* Formulário de criação */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-charcoal mb-5 flex items-center gap-2">
            <Plus size={18} className="text-brand" />
            Novo usuário
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="usuario@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="mínimo 6 caracteres"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-12 text-sm focus:outline-none focus:border-brand transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={creating}
              className="bg-brand text-charcoal font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Criar usuário
            </button>
          </form>
        </div>

        {/* Lista de usuários */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-charcoal text-sm">Usuários cadastrados</h2>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 size={24} className="animate-spin text-gray-300" />
            </div>
          ) : users.length > 0 ? (
            <>
              <div className="grid grid-cols-3 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <span>E-mail</span>
                <span>Criado em</span>
                <span>Último acesso</span>
              </div>
              <div className="divide-y divide-gray-50">
                {users.map(u => (
                  <div key={u.id} className="grid grid-cols-3 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-charcoal truncate pr-4">{u.email}</span>
                    <span className="text-sm text-gray-400">
                      {new Date(u.created_at).toLocaleDateString("pt-BR")}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {u.last_sign_in_at
                          ? new Date(u.last_sign_in_at).toLocaleDateString("pt-BR")
                          : "—"}
                      </span>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                        title="Excluir usuário"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <UserCog size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Nenhum usuário encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

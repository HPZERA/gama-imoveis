"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import { Loader2, Save, CheckCircle, AlertCircle, Settings, Info } from "lucide-react";
import type { ImageConfig } from "@/types";

const DEFAULTS: ImageConfig = {
  max_width: 1920,
  quality: 85,
  format: "webp",
  webp_enabled: true,
  max_file_size_mb: 10,
  max_images_per_property: 20,
};

const SQL_SETUP = `CREATE TABLE IF NOT EXISTS image_config (
  id                       TEXT PRIMARY KEY,
  max_width                INTEGER NOT NULL DEFAULT 1920,
  quality                  INTEGER NOT NULL DEFAULT 85,
  format                   TEXT    NOT NULL DEFAULT 'webp',
  webp_enabled             BOOLEAN NOT NULL DEFAULT true,
  max_file_size_mb         INTEGER NOT NULL DEFAULT 10,
  max_images_per_property  INTEGER NOT NULL DEFAULT 20,
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO image_config (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;`;

export default function ImageConfigPage() {
  const [config, setConfig] = useState<ImageConfig>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    fetch("/api/admin/image-config")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setNeedsSetup(true);
        else setConfig({ ...DEFAULTS, ...data });
      })
      .catch(() => setNeedsSetup(true))
      .finally(() => setLoading(false));
  }, []);

  function set(field: keyof ImageConfig, value: any) {
    setConfig((c) => ({ ...c, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    const res = await fetch("/api/admin/image-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    const result = await res.json();

    if (result.error) {
      setErrorMsg(result.error);
      setStatus("error");
      setNeedsSetup(true);
    } else {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    }

    setSaving(false);
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-brand transition-colors bg-white";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";

  return (
    <AdminShell>
      <div className="p-6 md:p-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
            <Settings size={20} className="text-brand" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-charcoal">Configurações de Imagem</h1>
            <p className="text-sm text-gray-500">Controle qualidade, formato e limites do upload</p>
          </div>
        </div>

        {/* Setup needed notice */}
        {needsSetup && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-800">Tabela não encontrada</p>
                <p className="text-xs text-amber-700 mt-0.5 mb-3">
                  Execute este SQL no Supabase Dashboard → SQL Editor:
                </p>
                <pre className="text-[11px] bg-amber-100 text-amber-900 p-3 rounded-xl overflow-x-auto whitespace-pre leading-relaxed font-mono">
                  {SQL_SETUP}
                </pre>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-gray-400 py-8">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Carregando configurações...</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Formato e Qualidade */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-charcoal">Formato e Qualidade</h2>

              <div>
                <label className={labelClass}>Formato padrão</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["webp", "jpg", "png"] as const).map((fmt) => (
                    <label
                      key={fmt}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-medium transition-colors ${
                        config.format === fmt
                          ? "border-brand bg-brand/5 text-brand"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={fmt}
                        checked={config.format === fmt}
                        onChange={() => set("format", fmt)}
                        className="hidden"
                      />
                      {fmt.toUpperCase()}
                    </label>
                  ))}
                </div>
                {config.format === "webp" && (
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                    <Info size={11} /> WebP oferece menor tamanho com melhor qualidade
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Qualidade da compressão — {config.quality}%
                </label>
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={5}
                  value={config.quality}
                  onChange={(e) => set("quality", Number(e.target.value))}
                  className="w-full accent-brand"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>50% — menor tamanho</span>
                  <span>100% — máxima qualidade</span>
                </div>
              </div>
            </div>

            {/* Dimensões */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-charcoal">Dimensões</h2>

              <div>
                <label className={labelClass}>Largura máxima (pixels)</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[1280, 1600, 1920, 2560].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => set("max_width", w)}
                      className={`py-2 rounded-xl border-2 text-xs font-medium transition-colors ${
                        config.max_width === w
                          ? "border-brand bg-brand/5 text-brand"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {w}px
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={config.max_width}
                  onChange={(e) => set("max_width", Number(e.target.value))}
                  className={inputClass}
                  min={400}
                  max={4096}
                  placeholder="1920"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Altura calculada automaticamente mantendo proporção 4:3
                </p>
              </div>
            </div>

            {/* Limites */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-charcoal">Limites</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Tamanho máx. por arquivo (MB)</label>
                  <input
                    type="number"
                    value={config.max_file_size_mb}
                    onChange={(e) => set("max_file_size_mb", Number(e.target.value))}
                    className={inputClass}
                    min={1}
                    max={50}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className={labelClass}>Máx. fotos por imóvel</label>
                  <input
                    type="number"
                    value={config.max_images_per_property}
                    onChange={(e) => set("max_images_per_property", Number(e.target.value))}
                    className={inputClass}
                    min={1}
                    max={100}
                    placeholder="20"
                  />
                </div>
              </div>
            </div>

            {/* Otimizações */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-charcoal mb-4">Otimizações</h2>
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-charcoal">Conversão para WebP</span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Converte automaticamente qualquer formato para WebP no upload
                  </p>
                </div>
                <div
                  onClick={() => set("webp_enabled", !config.webp_enabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    config.webp_enabled ? "bg-brand" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      config.webp_enabled ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </label>
            </div>

            {/* Error */}
            {status === "error" && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl p-3">
                <AlertCircle size={16} />
                {errorMsg || "Erro ao salvar. Verifique se a tabela foi criada."}
              </div>
            )}

            {/* Save */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-brand text-charcoal font-semibold px-6 py-2.5 rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : status === "saved" ? (
                  <CheckCircle size={16} />
                ) : (
                  <Save size={16} />
                )}
                {saving ? "Salvando..." : status === "saved" ? "Salvo!" : "Salvar configurações"}
              </button>
              {status === "saved" && (
                <span className="text-sm text-emerald-600 flex items-center gap-1">
                  <CheckCircle size={14} /> Configurações aplicadas aos próximos uploads
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}

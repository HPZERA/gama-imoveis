"use client";

import { useState, useEffect, useCallback } from "react";
import AdminShell from "@/components/AdminShell";
import {
  HardDrive,
  Image as ImageIcon,
  Building2,
  BarChart2,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface Stats {
  totalProperties: number;
  activeProperties: number;
  totalImages: number;
  avgImagesPerProperty: number;
  estimatedSizeBytes: number;
  estimatedSizeMB: number;
}

interface OptimizeProgress {
  running: boolean;
  current: number;
  total: number;
  reprocessed: number;
  skippedLegacy: number;
  skippedNoOriginal: number;
  errors: number;
  savedKB: number;
  done: boolean;
  error?: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "brand",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  const colors: Record<string, string> = {
    brand: "bg-brand/10 text-brand",
    blue: "bg-blue-50 text-blue-500",
    purple: "bg-purple-50 text-purple-500",
    green: "bg-emerald-50 text-emerald-500",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div className="text-2xl font-bold text-charcoal">{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function ArmazenamentoPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [optimize, setOptimize] = useState<OptimizeProgress>({
    running: false,
    current: 0,
    total: 0,
    reprocessed: 0,
    skippedLegacy: 0,
    skippedNoOriginal: 0,
    errors: 0,
    savedKB: 0,
    done: false,
  });

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/storage-stats");
      const data = await res.json();
      if (!data.error) setStats(data);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  async function runOptimize() {
    if (!stats) return;

    setOptimize({
      running: true,
      current: 0,
      total: stats.totalProperties,
      reprocessed: 0,
      skippedLegacy: 0,
      skippedNoOriginal: 0,
      errors: 0,
      savedKB: 0,
      done: false,
    });

    let offset = 0;
    let totalReprocessed = 0;
    let totalSkippedLegacy = 0;
    let totalSkippedNoOriginal = 0;
    let totalErrors = 0;
    let totalSavedKB = 0;

    while (true) {
      try {
        const res = await fetch("/api/admin/optimize-bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offset }),
        });

        const data = await res.json();

        if (data.error) {
          setOptimize((p) => ({ ...p, running: false, error: data.error }));
          return;
        }

        totalReprocessed += data.reprocessed ?? 0;
        totalSkippedLegacy += data.skippedLegacy ?? 0;
        totalSkippedNoOriginal += data.skippedNoOriginal ?? 0;
        totalErrors += data.errors ?? 0;
        totalSavedKB += data.savedKB ?? 0;

        setOptimize((p) => ({
          ...p,
          current: offset + 1,
          total: data.totalProperties,
          reprocessed: totalReprocessed,
          skippedLegacy: totalSkippedLegacy,
          skippedNoOriginal: totalSkippedNoOriginal,
          errors: totalErrors,
          savedKB: totalSavedKB,
        }));

        if (data.done) break;
        offset = data.nextOffset;
      } catch (e: any) {
        setOptimize((p) => ({ ...p, running: false, error: e.message }));
        return;
      }
    }

    setOptimize((p) => ({ ...p, running: false, done: true }));
  }

  const progressPct =
    optimize.total > 0 ? Math.round((optimize.current / optimize.total) * 100) : 0;

  return (
    <AdminShell>
      <div className="p-6 md:p-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <HardDrive size={20} className="text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-charcoal">Armazenamento</h1>
              <p className="text-sm text-gray-500">Estatísticas de imagens e otimização em massa</p>
            </div>
          </div>
          <button
            onClick={loadStats}
            disabled={loadingStats}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-charcoal transition-colors"
          >
            <RefreshCw size={14} className={loadingStats ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>

        {/* Stats grid */}
        {loadingStats ? (
          <div className="flex items-center gap-2 text-gray-400 py-8">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Carregando estatísticas...</span>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatCard
              icon={Building2}
              label="Imóveis"
              value={stats.totalProperties}
              sub={`${stats.activeProperties} ativos`}
              color="brand"
            />
            <StatCard
              icon={ImageIcon}
              label="Total de fotos"
              value={stats.totalImages.toLocaleString("pt-BR")}
              color="blue"
            />
            <StatCard
              icon={BarChart2}
              label="Média por imóvel"
              value={stats.avgImagesPerProperty}
              sub="fotos/imóvel"
              color="purple"
            />
            <StatCard
              icon={HardDrive}
              label="Armazenamento est."
              value={`~${stats.estimatedSizeMB} MB`}
              sub="baseado em 280 KB/foto"
              color="green"
            />
          </div>
        ) : (
          <div className="bg-red-50 rounded-2xl p-4 text-sm text-red-600 mb-8">
            Erro ao carregar estatísticas.
          </div>
        )}

        {/* Bulk Optimize */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <Zap size={20} className="text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-charcoal">Otimizar Imagens Existentes</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Reprocessa apenas fotos enviadas pelo painel admin, a partir do arquivo original guardado
                (nunca aplica a marca d&apos;água duas vezes). Fotos importadas do site antigo são sempre
                puladas, preservando a logo original delas. Cada imóvel é processado individualmente para
                evitar timeouts.
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {(optimize.running || optimize.done) && (
            <div className="mb-5 space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Imóvel {optimize.current} de {optimize.total}
                </span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>{optimize.reprocessed} reprocessadas</span>
                <span>{optimize.skippedLegacy} puladas (fotos antigas/importadas)</span>
                {optimize.skippedNoOriginal > 0 && (
                  <span>{optimize.skippedNoOriginal} puladas (sem original salvo)</span>
                )}
                {optimize.errors > 0 && <span className="text-red-500">{optimize.errors} erros</span>}
                {optimize.savedKB > 0 && (
                  <span className="text-emerald-600">
                    {optimize.savedKB > 1024
                      ? `${(optimize.savedKB / 1024).toFixed(1)} MB economizados`
                      : `${optimize.savedKB} KB economizados`}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Result messages */}
          {optimize.done && !optimize.running && (
            <div className="mb-4 flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl px-4 py-3 text-sm">
              <CheckCircle size={16} />
              <span>
                Concluído! {optimize.reprocessed} fotos reprocessadas, {optimize.skippedLegacy} preservadas sem
                alteração
                {optimize.savedKB > 0 && ` — ${optimize.savedKB > 1024 ? `${(optimize.savedKB / 1024).toFixed(1)} MB` : `${optimize.savedKB} KB`} economizados`}
              </span>
            </div>
          )}

          {optimize.error && (
            <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={16} />
              <span>{optimize.error}</span>
            </div>
          )}

          <button
            onClick={runOptimize}
            disabled={optimize.running || !stats}
            className="flex items-center gap-2 bg-amber-400 text-charcoal font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-500 transition-colors disabled:opacity-50"
          >
            {optimize.running ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Otimizando...
              </>
            ) : (
              <>
                <Zap size={16} />
                {optimize.done ? "Otimizar novamente" : "Otimizar imagens existentes"}
              </>
            )}
          </button>

          {!optimize.running && !optimize.done && (
            <p className="text-xs text-gray-400 mt-2">
              Isso pode demorar alguns minutos dependendo da quantidade de imóveis.
            </p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

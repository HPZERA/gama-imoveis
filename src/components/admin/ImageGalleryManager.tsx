"use client";

import { Upload, X, Star, ChevronLeft, ChevronRight, Loader2, Image as ImageIcon } from "lucide-react";
import type { UploadStat } from "@/types";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  uploading?: boolean;
  pendingPreviews?: Array<{ id: string; url: string }>;
  uploadStats?: Record<string, UploadStat>;
  onFileSelect: (files: FileList) => void;
  maxImages?: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function savingPct(orig: number, opt: number): number {
  return Math.max(0, Math.round((1 - opt / orig) * 100));
}

export default function ImageGalleryManager({
  images,
  onChange,
  uploading = false,
  pendingPreviews = [],
  uploadStats = {},
  onFileSelect,
  maxImages = 20,
}: Props) {
  function remove(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  function moveLeft(idx: number) {
    if (idx === 0) return;
    const next = [...images];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  }

  function moveRight(idx: number) {
    if (idx === images.length - 1) return;
    const next = [...images];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  }

  function setMain(idx: number) {
    if (idx === 0) return;
    const next = [images[idx], ...images.filter((_, i) => i !== idx)];
    onChange(next);
  }

  const canUpload = images.length + pendingPreviews.length < maxImages;

  return (
    <div className="space-y-3">
      {/* Upload zone */}
      {canUpload && (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-5 cursor-pointer hover:border-brand hover:bg-brand/5 transition-colors">
          {uploading ? (
            <div className="flex items-center gap-2 text-brand">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Processando...</span>
            </div>
          ) : (
            <>
              <Upload size={22} className="text-gray-400 mb-1.5" />
              <span className="text-sm text-gray-500 font-medium">Clique ou arraste fotos aqui</span>
              <span className="text-xs text-gray-400 mt-0.5">
                JPG, PNG, WEBP — compressão automática com watermark
              </span>
            </>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && onFileSelect(e.target.files)}
          />
        </label>
      )}

      {/* Gallery grid */}
      {(images.length > 0 || pendingPreviews.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {images.map((url, i) => {
            const stat = uploadStats[url];
            const hasSaving = stat && stat.originalSize > stat.optimizedSize;

            return (
              <div
                key={url}
                className="group relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50"
              >
                {/* Thumbnail */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={url}
                    alt={`foto ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Index + main badges */}
                <div className="absolute top-1.5 left-1.5 flex gap-1">
                  <span className="bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    #{i + 1}
                  </span>
                  {i === 0 && (
                    <span className="bg-brand text-charcoal text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 leading-none">
                      <Star size={7} fill="currentColor" />
                      Principal
                    </span>
                  )}
                </div>

                {/* Savings badge */}
                {hasSaving && (
                  <div className="absolute top-1.5 right-1.5">
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      -{savingPct(stat.originalSize, stat.optimizedSize)}%
                    </span>
                  </div>
                )}

                {/* Stats tooltip on hover */}
                {stat && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[10px] px-2 py-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-10">
                    <div className="flex justify-between gap-2">
                      <span className="text-white/60">Original:</span>
                      <span>{formatBytes(stat.originalSize)}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-white/60">Otimizado:</span>
                      <span className="text-emerald-400">{formatBytes(stat.optimizedSize)}</span>
                    </div>
                    {stat.originalWidth && (
                      <div className="flex justify-between gap-2 mt-0.5 border-t border-white/10 pt-0.5">
                        <span className="text-white/60">Resolução:</span>
                        <span>
                          {stat.originalWidth}×{stat.originalHeight} → {stat.optimizedWidth}×{stat.optimizedHeight}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action buttons overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/25 z-20">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => setMain(i)}
                      title="Definir como foto principal"
                      className="w-8 h-8 bg-brand text-charcoal rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    >
                      <Star size={13} fill="currentColor" />
                    </button>
                  )}
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => moveLeft(i)}
                      title="Mover para frente"
                      className="w-8 h-8 bg-white/90 text-gray-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    >
                      <ChevronLeft size={15} />
                    </button>
                  )}
                  {i < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveRight(i)}
                      title="Mover para trás"
                      className="w-8 h-8 bg-white/90 text-gray-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    >
                      <ChevronRight size={15} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    title="Remover foto"
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Pending upload previews */}
          {pendingPreviews.map((p) => (
            <div
              key={p.id}
              className="relative rounded-xl overflow-hidden border border-brand/30 bg-gray-50"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.url} alt="" className="w-full h-full object-cover opacity-40" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <Loader2 size={22} className="text-brand animate-spin" />
                <span className="text-[10px] text-brand font-medium">Enviando...</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <ImageIcon size={12} />
          {images.length} foto{images.length !== 1 ? "s" : ""}
          {pendingPreviews.length > 0 && ` (+${pendingPreviews.length} enviando)`}
        </span>
        {images.length > 0 && (
          <span>Primeira foto = capa do imóvel</span>
        )}
        {!canUpload && (
          <span className="text-amber-500">Limite de {maxImages} fotos atingido</span>
        )}
      </div>
    </div>
  );
}

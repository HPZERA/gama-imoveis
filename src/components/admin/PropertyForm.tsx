"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2 } from "lucide-react";

interface Props {
  property?: Record<string, any>;
}

const CATEGORIES_BY_TYPE: Record<string, string[]> = {
  venda:   ["Casa", "Apartamento", "Comércio", "Terreno"],
  aluguel: ["Casa", "Apartamento", "Comércio", "Terreno"],
};

export default function PropertyForm({ property }: Props) {
  const router = useRouter();
  const isEditing = !!property;

  const [form, setForm] = useState({
    title: property?.title ?? "",
    code: property?.code ?? "",
    price: property?.price ?? "",
    type: property?.type ?? "venda",
    category: property?.category ?? "Casa",

    bedrooms: property?.bedrooms ?? "",
    bathrooms: property?.bathrooms ?? "",
    area: property?.area ?? "",
    address: property?.address ?? "",
    neighborhood: property?.neighborhood ?? "",
    city: property?.city ?? "São Gabriel",
    description: property?.description ?? "",
    featured: property?.featured ?? false,
    active: property?.active ?? true,
  });

  const [images, setImages] = useState<string[]>(property?.images ?? []);
  const [pendingPreviews, setPendingPreviews] = useState<Array<{ id: string; url: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: any) {
    setForm(f => {
      const updated = { ...f, [field]: value };
      // quando tipo muda, resetar categoria para a primeira opção válida
      if (field === "type") {
        const cats = CATEGORIES_BY_TYPE[value] ?? [];
        if (!cats.includes(updated.category)) {
          updated.category = cats[0] ?? "";
        }
      }
      return updated;
    });
  }

  async function uploadImages(files: FileList) {
    setUploading(true);
    const fileArray = Array.from(files);

    // Mostra previews locais imediatamente
    const previews = fileArray.map(file => ({
      id: Math.random().toString(36).slice(2),
      url: URL.createObjectURL(file),
    }));
    setPendingPreviews(prev => [...prev, ...previews]);

    // Faz uploads em paralelo
    await Promise.all(
      fileArray.map(async (file, idx) => {
        const fd = new FormData();
        fd.append("file", file);
        try {
          const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (data.url) setImages(prev => [...prev, data.url]);
        } finally {
          URL.revokeObjectURL(previews[idx].url);
          setPendingPreviews(prev => prev.filter(p => p.id !== previews[idx].id));
        }
      })
    );

    setUploading(false);
  }

  function removeImage(url: string) {
    setImages(prev => prev.filter(i => i !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const data = {
      ...form,
      code: form.code || null,
      price: form.price ? Number(form.price) : null,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      area: form.area ? Number(form.area) : null,
      address: form.address || null,
      neighborhood: form.neighborhood || null,
      description: form.description || null,
      images,
    };

    const res = await fetch("/api/admin/properties", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEditing ? { id: property.id, ...data } : data),
    });

    const result = await res.json();
    if (!result.ok) {
      setError(result.error ? `Erro: ${result.error}` : "Erro ao salvar. Tente novamente.");
      setSaving(false);
      return;
    }

    router.push("/admin/imoveis");
    router.refresh();
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-brand transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-w-3xl">
      {/* Título */}
      <div>
        <label className={labelClass}>Título *</label>
        <input required value={form.title} onChange={e => set("title", e.target.value)} className={inputClass} placeholder="Ex: Casa com 3 quartos no Centro" />
      </div>

      {/* Tipo e Categoria */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className={labelClass}>Tipo *</label>
          <select value={form.type} onChange={e => set("type", e.target.value)} className={inputClass}>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Categoria *</label>
          <select value={form.category} onChange={e => set("category", e.target.value)} className={inputClass}>
            {(CATEGORIES_BY_TYPE[form.type] ?? []).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Preço e Código */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className={labelClass}>Preço (R$)</label>
          <input type="number" value={form.price} onChange={e => set("price", e.target.value)} className={inputClass} placeholder="250000" />
        </div>
        <div>
          <label className={labelClass}>Código do imóvel</label>
          <input value={form.code} onChange={e => set("code", e.target.value)} className={inputClass} placeholder="Ex: CA-001" />
        </div>
      </div>

      {/* Características */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div>
          <label className={labelClass}>Quartos</label>
          <input type="number" value={form.bedrooms} onChange={e => set("bedrooms", e.target.value)} className={inputClass} placeholder="3" />
        </div>
        <div>
          <label className={labelClass}>Banheiros</label>
          <input type="number" value={form.bathrooms} onChange={e => set("bathrooms", e.target.value)} className={inputClass} placeholder="2" />
        </div>
        <div>
          <label className={labelClass}>Área (m²)</label>
          <input type="number" value={form.area} onChange={e => set("area", e.target.value)} className={inputClass} placeholder="120" />
        </div>
      </div>

      {/* Localização */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className={labelClass}>Bairro</label>
          <input value={form.neighborhood} onChange={e => set("neighborhood", e.target.value)} className={inputClass} placeholder="Centro" />
        </div>
        <div>
          <label className={labelClass}>Cidade</label>
          <input value={form.city} onChange={e => set("city", e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Endereço</label>
        <input value={form.address} onChange={e => set("address", e.target.value)} className={inputClass} placeholder="Rua Exemplo, 123" />
      </div>

      {/* Descrição */}
      <div>
        <label className={labelClass}>Descrição</label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Descreva o imóvel..." />
      </div>

      {/* Fotos */}
      <div>
        <label className={labelClass}>Fotos</label>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-brand hover:bg-brand/5 transition-colors">
          {uploading ? (
            <Loader2 size={24} className="text-brand animate-spin" />
          ) : (
            <>
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Clique para enviar fotos</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
            </>
          )}
          <input type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && uploadImages(e.target.files)} />
        </label>

        {(images.length > 0 || pendingPreviews.length > 0) && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3 mt-3">
            {images.map((url, i) => (
              <div key={i} className="relative group aspect-video">
                <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {pendingPreviews.map(p => (
              <div key={p.id} className="relative aspect-video">
                <img src={p.url} alt="" className="w-full h-full object-cover rounded-lg opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={20} className="text-brand animate-spin" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Opções */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="rounded accent-brand" />
          <span className="text-sm text-gray-600">Imóvel em destaque</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.active} onChange={e => set("active", e.target.checked)} className="rounded accent-brand" />
          <span className="text-sm text-gray-600">Ativo no site</span>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand text-charcoal font-semibold px-6 py-2.5 rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isEditing ? "Salvar alterações" : "Cadastrar imóvel"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

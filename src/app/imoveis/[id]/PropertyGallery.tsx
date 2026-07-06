"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Thumbs, Keyboard, FreeMode, Zoom, A11y } from "swiper/modules";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { withCacheBust } from "@/lib/imageUrl";

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const mainSwiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen]);

  if (!images.length) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-2xl">
        <span className="text-gray-400 text-sm">Sem fotos disponíveis</span>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-3 min-w-0">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 group">
        <Swiper
          modules={[Navigation, Thumbs, Keyboard, A11y]}
          onSwiper={(s) => (mainSwiperRef.current = s)}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          navigation={images.length > 1 ? { nextEl: ".gallery-next", prevEl: ".gallery-prev" } : false}
          keyboard={{ enabled: true }}
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
          className="property-detail-swiper"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <button
                type="button"
                onClick={() => openLightbox(i)}
                className="block w-full aspect-[4/3] md:aspect-auto md:h-[480px] bg-gray-100 cursor-zoom-in"
                aria-label="Ampliar imagem"
              >
                <img
                  src={withCacheBust(img)}
                  alt={`${title} - foto ${i + 1}`}
                  loading={Math.abs(i - activeIndex) <= 1 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-contain md:object-cover"
                  draggable={false}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              className="gallery-prev hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-md text-charcoal opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              className="gallery-next hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-md text-charcoal opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-3 right-3 z-10 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full pointer-events-none">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => openLightbox(activeIndex)}
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 shadow-md text-charcoal"
          aria-label="Ver em tela cheia"
        >
          <Expand size={16} />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Swiper
          modules={[Thumbs, FreeMode]}
          onSwiper={setThumbsSwiper}
          watchSlidesProgress
          freeMode
          slidesPerView="auto"
          spaceBetween={8}
          className="gallery-thumbs"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} style={{ width: 76 }}>
              <button
                type="button"
                onClick={() => mainSwiperRef.current?.slideTo(i)}
                className={`block w-full h-20 overflow-hidden rounded-xl border-2 transition-colors cursor-pointer ${
                  activeIndex === i ? "border-brand" : "border-transparent"
                }`}
                aria-label={`Ver foto ${i + 1}`}
              >
                <img
                  src={withCacheBust(img)}
                  alt={`${title} miniatura ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Lightbox */}
      {lightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={`Galeria de fotos - ${title}`}
          >
            <div className="flex items-center justify-between px-4 py-3 text-white shrink-0 z-10">
              <span className="text-sm font-medium">
                Imagem {activeIndex + 1} de {images.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Fechar"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 min-h-0 relative">
              <Swiper
                modules={[Zoom, Navigation, Keyboard, A11y]}
                initialSlide={activeIndex}
                zoom={{ maxRatio: 3 }}
                navigation={images.length > 1 ? { nextEl: ".lightbox-next", prevEl: ".lightbox-prev" } : false}
                keyboard={{ enabled: true }}
                onSlideChange={(s) => setActiveIndex(s.activeIndex)}
                className="w-full h-full lightbox-swiper"
              >
                {images.map((img, i) => (
                  <SwiperSlide key={i} className="flex items-center justify-center">
                    <div className="swiper-zoom-container">
                      <img
                        src={withCacheBust(img)}
                        alt={`${title} - foto ${i + 1}`}
                        loading={Math.abs(i - activeIndex) <= 1 ? "eager" : "lazy"}
                        decoding="async"
                        className="max-w-full max-h-full object-contain select-none"
                        draggable={false}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Foto anterior"
                    className="lightbox-prev hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    aria-label="Próxima foto"
                    className="lightbox-next hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

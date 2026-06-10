"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

export default function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  if (!images.length) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-2xl">
        <span className="text-gray-400 text-sm">Sem fotos disponíveis</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Wrapper com altura definida — obrigatório para Image fill funcionar */}
      <div className="relative h-72 sm:h-96 lg:h-[480px] rounded-2xl overflow-hidden bg-gray-100">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
          className="property-detail-swiper h-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} className="relative h-full">
              <Image
                src={img}
                alt={`${title} - foto ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority={i === 0}
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoIAAUAAUAmJYgCdAEO/gHOAAA="
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute bottom-12 right-4 z-10 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => swiper?.slideTo(i)}
              className={`relative h-16 sm:h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                activeIndex === i
                  ? "ring-2 ring-brand ring-offset-1 opacity-100"
                  : "opacity-55 hover:opacity-80"
              }`}
            >
              <Image
                src={img}
                alt={`${title} - miniatura ${i + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
              {i === 4 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">+{images.length - 5}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

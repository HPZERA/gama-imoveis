"use client";

import { useState } from "react";

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-2xl">
        <span className="text-gray-400 text-sm">Sem fotos disponíveis</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={images[activeIndex]}
          alt={title}
          className="w-full h-[480px] object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 10).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`overflow-hidden rounded-xl border-2 ${
                activeIndex === i
                  ? "border-cyan-400"
                  : "border-transparent"
              }`}
            >
              <img
                src={img}
                alt={`${title} ${i + 1}`}
                className="w-full h-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

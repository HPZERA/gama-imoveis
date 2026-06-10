"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/properties";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-brand fill-brand" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 bg-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-brand font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Depoimentos
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-white font-display mb-4"
          >
            O que nossos clientes dizem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mx-auto"
          >
            Histórias reais de clientes que realizaram o sonho da casa própria com a Gama Imóveis
          </motion.p>
        </div>

        {/* Swiper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="testimonial-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="pb-12">
                <div className="bg-charcoal-light border border-white/5 rounded-2xl p-7 h-full flex flex-col hover:border-brand/30 transition-colors group">
                  {/* Quote icon */}
                  <Quote
                    size={32}
                    className="text-brand/40 mb-4 flex-shrink-0 group-hover:text-brand/60 transition-colors"
                    strokeWidth={1}
                  />

                  {/* Stars */}
                  <StarRating rating={testimonial.rating} />

                  {/* Comment */}
                  <p className="text-white/70 text-sm leading-relaxed mt-4 mb-6 flex-1 line-clamp-3">
                    &ldquo;{testimonial.comment}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.photo}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-white/40 text-xs">
                        {testimonial.role}
                        {testimonial.date && ` · ${testimonial.date}`}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}

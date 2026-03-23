"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    badge: "🆕 Новая коллекция",
    title: "УЛИЧНАЯ ОДЕЖДА\nПРЕМИУМ-КЛАССА",
    subtitle: "Свежие дропы от мировых брендов — доставка по всей России",
    cta: "СМОТРЕТЬ КОЛЛЕКЦИЮ",
    href: "/catalog",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    badge: "🔥 Скидки до 30%",
    title: "ХИТЫ СЕЗОНА\nПО ЛУЧШИМ ЦЕНАМ",
    subtitle: "Лучшие модели по специальным ценам — успейте до конца акции",
    cta: "ВСЕ АКЦИИ",
    href: "/catalog",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    badge: "✨ Эксклюзивные бренды",
    title: "ТОЛЬКО\nОРИГИНАЛЬНЫЕ БРЕНДЫ",
    subtitle: "100% оригинальные товары от официальных поставщиков с гарантией",
    cta: "ВСЕ БРЕНДЫ",
    href: "/catalog",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-screen flex flex-col justify-end pb-24 px-4 overflow-hidden bg-brand-dark">
      {/* Top gradient for nav readability */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/70 to-transparent z-10 pointer-events-none" />

      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <div className="absolute inset-0 bg-brand-dark/40 z-10" />
          <img
            src={s.image}
            alt={s.badge}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}

      {/* Content */}
      <div className="container relative z-20 px-4 md:px-12 flex flex-col items-center md:items-start text-center md:text-left">
        <div
          key={`badge-${current}`}
          className="inline-block mb-6 animate-[fadeInUp_0.6s_ease-out]"
        >
          <span className="py-1 px-4 border border-foreground/30 text-[10px] font-bold uppercase tracking-[0.2em] bg-background/80 backdrop-blur-md rounded-full text-foreground inline-flex">
            {slide.badge}
          </span>
        </div>

        <h1
          key={`title-${current}`}
          className="text-4xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter text-white drop-shadow-2xl uppercase mb-6 leading-[1.1] animate-[fadeInUp_0.6s_ease-out_0.1s_both] whitespace-pre-line"
        >
          {slide.title}
        </h1>

        <p
          key={`sub-${current}`}
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl animate-[fadeInUp_0.6s_ease-out_0.2s_both] drop-shadow-lg"
        >
          {slide.subtitle}
        </p>

        <div
          key={`btn-${current}`}
          className="flex flex-col sm:flex-row items-center md:items-start gap-6 animate-[fadeInUp_0.6s_ease-out_0.3s_both]"
        >
          <Link href={slide.href}>
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 bg-foreground text-background hover:bg-brand-silver hover:text-white rounded-none uppercase tracking-widest font-semibold px-10 transition-colors"
            >
              {slide.cta}
            </Button>
          </Link>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm"
        aria-label="Предыдущий слайд"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm"
        aria-label="Следующий слайд"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Слайд ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

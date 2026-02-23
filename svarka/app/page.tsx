"use client";

import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle2, ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [homeHero, setHomeHero] = useState<any>({
    title: "ПРОМЫШЛЕННАЯ СВАРКА",
    subtitle: "Мы создаем прочные связи. Промышленные сварочные решения премиум-класса для сложных архитектурных и инженерных проектов.",
    buttonText: "Наши услуги"
  });

  useEffect(() => {
    async function fetchData() {
      const [contentRes] = await Promise.all([
        supabase.from('cms_content').select('*').eq('key', 'home_hero')
      ]);

      if (contentRes.data && contentRes.data.length > 0) {
        setHomeHero((prev: any) => ({ ...prev, ...contentRes.data[0].content }));
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-white selection:bg-white selection:text-black">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-brand-black/40 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop"
              alt="Industrial Background"
              className="w-full h-full object-cover grayscale contrast-125 scale-105 animate-[scaleIn_20s_infinite_alternate]"
            />
          </div>

          <div className="container relative z-20 px-4 text-center">
            <div className="inline-block mb-6 animate-[fadeInUp_0.8s_ease-out]">
              <span className="py-2 px-4 border border-white/20 rounded-full text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                Industrial Excellence
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-tighter text-white uppercase mb-8 leading-[0.9] drop-shadow-2xl animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
              {homeHero.title.split(' ')[0] || "ПРОМЫШЛЕННАЯ"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-brand-silver">
                {homeHero.title.split(' ').slice(1).join(' ') || "СВАРКА"}
              </span>
            </h1>

            <p className="max-w-xl mx-auto text-lg md:text-xl text-brand-silver font-light mb-12 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
              {homeHero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
              <Link href="/catalog">
                <Button size="lg" className="w-full sm:w-auto h-14 bg-white text-black hover:bg-brand-silver hover:text-black rounded-none uppercase tracking-widest font-bold px-8">
                  Перейти в каталог
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 border-white text-white hover:bg-white hover:text-black rounded-none uppercase tracking-widest font-bold px-8">
                  Связаться
                </Button>
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-pulse">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
          </div>
        </section>

        {/* Marquee / Ticker */}
        <div className="bg-white text-black overflow-hidden py-4 border-y border-brand-gray">
          <div className="flex whitespace-nowrap animate-marquee">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} className="text-4xl font-heading font-bold uppercase mx-8 tracking-tighter flex items-center">
                TIG Welding <span className="mx-4 text-xs align-middle">●</span>
                Structural Steel <span className="mx-4 text-xs align-middle">●</span>
                Custom Fabrication <span className="mx-4 text-xs align-middle">●</span>
              </span>
            ))}
          </div>
        </div>

        {/* About / Minimal - MOVED DOWN */}
        <section className="py-32 bg-brand-gray/5 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-silver mb-4">О нас</h2>
                <h3 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-8">
                  Мы не просто варим металл. <br /><span className="text-brand-silver">Мы строим будущее.</span>
                </h3>
                <div className="space-y-6 text-brand-silver font-light leading-relaxed">
                  <p>
                    IRONFORGE — это объединение сертифицированных специалистов, для которых сварка — это искусство. Мы работаем с титаном, нержавеющей сталью и сложными сплавами, обеспечивая качество уровня аэрокосмической отрасли.
                  </p>
                  <p>
                    Наша миссия — предоставить безупречный сервис и долговечность каждой конструкции.
                  </p>
                </div>
                <div className="mt-12">
                  <Link href="/about" className="inline-flex items-center text-white font-bold uppercase tracking-widest hover:text-brand-silver transition-colors border-b border-white pb-1 hover:border-brand-silver">
                    Подробнее о компании <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden rounded-sm">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
                    alt="Welder at work"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 p-8 bg-white text-black max-w-xs hidden md:block">
                  <p className="font-heading font-bold text-4xl mb-2">15+</p>
                  <p className="text-xs uppercase tracking-widest font-semibold">Лет безупречной работы на рынке</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

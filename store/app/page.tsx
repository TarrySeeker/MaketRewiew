import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getProducts } from "@/lib/products";

export const revalidate = 60;

export default async function Home() {
  let homeHero = {
    title: "УЛИЧНАЯ ОДЕЖДА ПРЕМИУМ-КЛАССА",
    subtitle: "Уличная одежда премиум-класса и современная мода от известных мировых брендов",
    buttonText: "КАТАЛОГ",
    bannerUrl: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop"
  };

  try {
    const { data } = await supabase.from('cms_content').select('*').eq('key', 'home_hero').single();
    if (data?.content) {
      homeHero = { ...homeHero, ...data.content };
    }
  } catch (e) {
    // fallback
  }

  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      <Header />

      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full h-screen flex flex-col justify-end pb-24 px-4 overflow-hidden bg-brand-dark">
          {/* Background Image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[95%] h-[90vh] overflow-hidden z-0 rounded-sm">
            <div className="absolute inset-0 bg-brand-dark/30 z-10" />
            <img
              src={homeHero.bannerUrl}
              alt="Fashion Background"
              className="w-full h-full object-cover animate-[scaleIn_30s_infinite_alternate]"
            />
          </div>

          <div className="container relative z-20 px-4 md:px-12 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="inline-block mb-6 animate-[fadeInUp_0.8s_ease-out]">
              <span className="py-1 px-4 border border-foreground/30 text-[10px] font-bold uppercase tracking-[0.2em] bg-background/80 backdrop-blur-md rounded-full text-foreground inline-flex">
                Новая Коллекция
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter text-white drop-shadow-2xl uppercase mb-6 leading-[1.1] animate-[fadeInUp_0.8s_ease-out_0.2s_both] mix-blend-difference">
              {homeHero.title}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl animate-[fadeInUp_0.8s_ease-out_0.4s_both] drop-shadow-lg">
              {homeHero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center md:items-start gap-6 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
              <Link href="/catalog">
                <Button size="lg" className="w-full sm:w-auto h-12 bg-foreground text-background hover:bg-brand-silver hover:text-white rounded-none uppercase tracking-widest font-semibold px-10 transition-colors">
                  {homeHero.buttonText}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <div className="w-full bg-background text-foreground overflow-hidden py-6 border-b border-brand-gray">
          <div className="container mx-auto px-4 flex justify-between items-center whitespace-nowrap overflow-x-auto no-scrollbar gap-12 text-sm uppercase tracking-widest font-medium text-brand-silver">
            <Link href="/catalog" className="hover:text-foreground transition-colors">Новинки</Link>
            <Link href="/catalog" className="hover:text-foreground transition-colors">Одежда</Link>
            <Link href="/catalog" className="hover:text-foreground transition-colors">Обувь</Link>
            <Link href="/catalog" className="hover:text-foreground transition-colors">Аксессуары</Link>
            <Link href="/catalog" className="hover:text-foreground transition-colors">Бренды</Link>
            <Link href="/catalog" className="hover:text-foreground transition-colors">Распродажа</Link>
          </div>
        </div>

        {/* About Section */}
        <section className="w-full py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 uppercase tracking-wider">О Бренде</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-5xl font-black mb-4">15+</div>
                <p className="text-brand-silver uppercase text-sm tracking-wide">лет на рынке</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black mb-4">30</div>
                <p className="text-brand-silver uppercase text-sm tracking-wide">дней гарантия</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black mb-4">20 000+</div>
                <p className="text-brand-silver uppercase text-sm tracking-wide">довольных клиентов</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="w-full py-20 bg-brand-dark">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 uppercase tracking-wider">Рекомендуем</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <Link key={product.id} href={`/catalog/${product.id}`}>
                    <div className="group cursor-pointer">
                      <div className="aspect-[3/4] bg-brand-gray mb-4 overflow-hidden">
                        {product.base_images?.[0] && (
                          <img
                            src={product.base_images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="text-sm uppercase tracking-wide mb-2">{product.brand || ''}</div>
                      <div className="text-xs text-brand-silver mb-2">{product.title}</div>
                      <div className="font-bold">{product.base_price?.toLocaleString()} ₽</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

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
    title: "NEW URBAN WARDROBE",
    subtitle: "Premium streetwear and contemporary fashion from curated global brands.",
    buttonText: "КАТАЛОГ",
    bannerUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop"
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
  const featuredProducts = products.slice(0, 4); // Top 4 items

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      <Header />

      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full h-screen flex flex-col justify-end pb-24 px-4 overflow-hidden bg-brand-dark">
          {/* Background Image Container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[95%] h-[90vh] overflow-hidden z-0 rounded-sm">
            <div className="absolute inset-0 bg-brand-dark/10 z-10" />
            <img
              src={homeHero.bannerUrl}
              alt="Fashion Background"
              className="w-full h-full object-cover animate-[scaleIn_30s_infinite_alternate]"
            />
          </div>

          <div className="container relative z-20 px-4 md:px-12 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="inline-block mb-6 animate-[fadeInUp_0.8s_ease-out]">
              <span className="py-1 px-4 border border-foreground/30 text-[10px] font-bold uppercase tracking-[0.2em] bg-background/50 backdrop-blur-md rounded-full text-foreground inline-flex">
                New Collection
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter text-white drop-shadow-md uppercase mb-6 leading-[1.1] animate-[fadeInUp_0.8s_ease-out_0.2s_both] mix-blend-difference">
              {homeHero.title}
            </h1>

            <div className="flex flex-col sm:flex-row items-center md:items-start gap-6 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
              <Link href="/catalog">
                <Button size="lg" className="w-full sm:w-auto h-12 bg-foreground text-background hover:bg-brand-silver hover:text-white rounded-none uppercase tracking-widest font-semibold px-10 transition-colors">
                  {homeHero.buttonText}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories / Minimal Ticker */}
        <div className="w-full bg-background text-foreground overflow-hidden py-6 border-b border-brand-gray">
          <div className="container mx-auto px-4 flex justify-between items-center whitespace-nowrap overflow-x-auto no-scrollbar gap-12 text-sm uppercase tracking-widest font-medium text-brand-silver">
            <Link href="/catalog" className="hover:text-foreground transition-colors">Новинки</Link>
            <Link href="/catalog" className="hover:text-foreground transition-colors">Одежда</Link>
            <Link href="/catalog" className="hover:text-foreground transition-colors">Обувь</Link>
            <Link href="/catalog" className="hover:text-foreground transition-colors">Аксессуары</Link>
            <Link href="/catalog" className="hover:text-foreground transition-colors">Бренды</Link>
            <Link href="/catalog" className="hover:text-foreground transition-colors">Sale</Link>
          </div>
        </div>

        {/* New Arrivals Grid (Cozy Minimalist) */}
        <section className="w-full py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-2xl md:text-3xl font-sans font-light uppercase tracking-widest">Новинки</h2>
              <Link href="/catalog" className="text-xs uppercase tracking-widest text-brand-silver hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-1">
                Смотреть все
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
              {featuredProducts.map((product) => (
                <Link href={`/catalog/${product.id}`} key={product.id} className="group block">
                  {/* Image Container with Hover Swap */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-brand-dark rounded-sm mb-6">
                    {product.base_images && product.base_images.length > 0 ? (
                      <>
                        <img
                          src={product.base_images[0]}
                          alt={product.title}
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-10 group-hover:opacity-0"
                        />
                        {product.base_images.length > 1 && (
                          <img
                            src={product.base_images[1]}
                            alt={`${product.title} alternative`}
                            className="absolute inset-0 w-full h-full object-cover z-0"
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-silver bg-brand-gray">
                        Нет фото
                      </div>
                    )}

                    {/* Minimalist Hover Add to Cart Button */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <Button className="w-full bg-background/90 backdrop-blur-sm text-foreground hover:bg-foreground hover:text-background rounded-none uppercase text-[10px] tracking-widest font-semibold h-10">
                        Быстрый просмотр
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col items-center text-center px-2">
                    <span className="text-[10px] text-brand-silver uppercase tracking-[0.2em] mb-2">
                      {product.category || 'Apparel'}
                    </span>
                    <h3 className="text-sm font-medium uppercase tracking-wider mb-2 text-foreground group-hover:text-brand-silver transition-colors">
                      {product.title}
                    </h3>
                    <span className="text-sm text-foreground">
                      {product.base_price ? product.base_price.toLocaleString('ru-RU') : '0'} ₽
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Editorial About Section */}
        <section className="w-full pb-24 pt-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-5 md:col-start-2">
                <div className="aspect-[4/5] overflow-hidden rounded-sm bg-brand-dark">
                  <img
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop"
                    alt="Store interior/Apparel"
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-700"
                  />
                </div>
              </div>
              <div className="md:col-span-5 flex flex-col justify-center">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-silver mb-6">Магазин</h2>
                <h3 className="text-3xl lg:text-5xl font-sans font-light leading-tight mb-8">
                  Стиль, свободный <br /><span className="font-semibold">от условностей.</span>
                </h3>
                <div className="space-y-6 text-brand-silver text-sm md:text-base font-light leading-relaxed mb-10">
                  <p>
                    {homeHero.subtitle} Мы тщательно отбираем бренды со всего мира, чтобы предложить вам уникальный взгляд на современную моду. От утилитарного стритвира до минималистичного премиума.
                  </p>
                  <p>
                    Эксклюзивные коллекции, идеальная посадка и бескомпромиссное качество материалов в каждом элементе гардероба.
                  </p>
                </div>
                <div>
                  <Link href="/about" className="inline-flex items-center text-foreground font-semibold text-xs uppercase tracking-widest hover:text-brand-silver transition-colors group border-b border-foreground pb-1 hover:border-brand-silver">
                    Узнать больше
                  </Link>
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

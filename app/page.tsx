import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import Link from "next/link";
import { getProducts } from "@/lib/products";

export const revalidate = 60;

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      <Header />

      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Slider */}
        <HeroSlider />

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

        {/* About Brand */}
        <section className="w-full py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 uppercase tracking-wider">О Бренде</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
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
              <div className="text-center">
                <div className="text-5xl font-black mb-4">24/7</div>
                <p className="text-brand-silver uppercase text-sm tracking-wide">поддержка</p>
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
                      <div className="text-sm uppercase tracking-wide mb-2">{product.brand || ""}</div>
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

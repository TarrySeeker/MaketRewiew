import { getProducts } from "@/lib/products";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export default async function CatalogPage() {
    const products = await getProducts();

    return (
        <div className="flex flex-col min-h-screen bg-brand-black text-white selection:bg-white selection:text-black">
            <Header />

            <main className="flex-1 pt-32 pb-24">
                <div className="container mx-auto px-4">
                    <div className="mb-16">
                        <div className="inline-block mb-4">
                            <span className="py-2 px-4 border border-white/20 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
                                Наше Производство
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading font-black uppercase mb-4">
                            Готовые <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-brand-silver">Мангалы</span>
                        </h1>
                        <p className="text-brand-silver max-w-2xl text-lg font-light">
                            Надежные и долговечные мангалы из качественной толстостенной стали.
                            Собственное производство, лазерная резка и идеальные сварные швы.
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-32 border border-white/10 bg-brand-gray/5">
                            <p className="text-brand-silver text-xl font-light">Товаров пока нет в наличии.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <Link href={`/catalog/${product.id}`} key={product.id} className="group block">
                                    <div className="bg-brand-dark border border-white/10 hover:border-white/30 transition-all duration-300 h-full flex flex-col">
                                        <div className="relative aspect-square overflow-hidden bg-brand-black/50">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-all duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-brand-silver bg-brand-gray/10">
                                                    Нет фото
                                                </div>
                                            )}
                                            {product.category && (
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">
                                                        {product.category}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-heading font-bold uppercase mb-2 group-hover:text-brand-silver transition-colors">
                                                {product.title}
                                            </h3>

                                            {product.description && (
                                                <p className="text-sm text-brand-silver line-clamp-2 mb-6 font-light">
                                                    {product.description}
                                                </p>
                                            )}

                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                                                <span className="text-2xl font-bold font-heading">
                                                    {product.price.toLocaleString('ru-RU')} ₽
                                                </span>
                                                <AddToCartButton
                                                    product={product}
                                                    className="w-12 h-12 p-0 flex items-center justify-center bg-transparent text-white border border-white/20 hover:bg-white hover:text-black transition-colors"
                                                >
                                                    <ShoppingCart className="h-5 w-5" />
                                                </AddToCartButton>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

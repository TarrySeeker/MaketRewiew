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
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
            <Header />

            <main className="flex-1 pt-32 pb-24">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <div className="inline-block mb-4">
                            <span className="py-1 px-4 border border-foreground/30 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-background/50 text-foreground">
                                SS 2026
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-sans font-light uppercase mb-4 tracking-tighter">
                            Новые <span className="font-semibold">Поступления</span>
                        </h1>
                        <p className="text-brand-silver max-w-2xl mx-auto text-lg font-light">
                            Откройте для себя нашу кураторскую подборку стритвира и премиум-брендов.
                            Безупречный крой, внимание к деталям и технологичные материалы.
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-32 border border-brand-gray bg-background">
                            <p className="text-brand-silver text-xl font-light">Товаров пока нет в наличии.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                            {products.map((product) => (
                                <Link href={`/catalog/${product.id}`} key={product.id} className="group block">
                                    {/* Image Container with Hover Swap */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-brand-dark rounded-sm mb-6">
                                        {product.base_images && product.base_images.length > 0 ? (
                                            <>
                                                <img
                                                    src={product.base_images[0]}
                                                    alt={product.title}
                                                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-10 group-hover:opacity-0"
                                                    style={{ objectPosition: product.cover_position || "center" }}
                                                />
                                                {product.base_images.length > 1 && (
                                                    <img
                                                        src={product.base_images[1]}
                                                        alt={`${product.title} alternative`}
                                                        className="absolute inset-0 w-full h-full object-cover z-0"
                                                        style={{ objectPosition: product.cover_position || "center" }}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-brand-silver bg-brand-gray">
                                                Нет фото
                                            </div>
                                        )}

                                        {product.category && (
                                            <div className="absolute top-4 left-4 z-30">
                                                <span className="bg-background/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground border border-foreground/10 rounded-full">
                                                    {product.category}
                                                </span>
                                            </div>
                                        )}

                                        {/* Minimalist Hover Add to Cart Button */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                            <AddToCartButton
                                                product={product as any}
                                                className="w-full bg-background/90 backdrop-blur-sm text-foreground hover:bg-foreground hover:text-background rounded-none uppercase text-[10px] tracking-widest font-semibold h-10 flex items-center justify-center border-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex flex-col items-center text-center px-2">
                                        <span className="text-[10px] text-brand-silver uppercase tracking-[0.2em] mb-2">
                                            {product.brand || 'Apparel'}
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
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

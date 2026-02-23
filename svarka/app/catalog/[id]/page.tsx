import { getProductById } from "@/lib/products";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShoppingCart, Scale, Maximize } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const productData = await getProductById(id);

    if (!productData || !productData.is_active) {
        notFound();
    }
    const product = productData;

    return (
        <div className="flex flex-col min-h-screen bg-brand-black text-white selection:bg-white selection:text-black">
            <Header />

            <main className="flex-1 pt-32 pb-24">
                <div className="container mx-auto px-4">
                    <Link href="/catalog" className="inline-flex items-center text-brand-silver hover:text-white mb-8 transition-colors text-sm uppercase tracking-widest font-bold">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Назад в каталог
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-brand-dark border border-white/10 overflow-hidden relative">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="w-full h-full object-contain p-4 bg-brand-black transition-all duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-brand-silver">
                                        Нет главного фото
                                    </div>
                                )}
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.slice(1).map((img, idx) => (
                                        <div key={idx} className="aspect-square border border-white/10 overflow-hidden bg-brand-dark cursor-pointer">
                                            <img src={img} alt={`${product.title} ${idx + 2}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            {product.category && (
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-silver mb-4">
                                    {product.category}
                                </span>
                            )}
                            <h1 className="text-4xl md:text-5xl font-heading font-black uppercase mb-6 leading-tight">
                                {product.title}
                            </h1>

                            <div className="text-4xl font-heading font-bold mb-8 text-white border-b border-white/10 pb-8">
                                {product.price.toLocaleString('ru-RU')} ₽
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex flex-col bg-brand-dark border border-white/10 p-4">
                                    <span className="text-brand-silver text-xs uppercase tracking-widest font-bold mb-2 flex items-center">
                                        <Scale className="w-4 h-4 mr-2" /> Вес
                                    </span>
                                    <span className="font-heading font-bold text-lg">
                                        {product.weight ? `${(product.weight / 1000).toFixed(1)} кг` : "20 кг"}
                                    </span>
                                </div>
                                <div className="flex flex-col bg-brand-dark border border-white/10 p-4">
                                    <span className="text-brand-silver text-xs uppercase tracking-widest font-bold mb-2 flex items-center">
                                        <Maximize className="w-4 h-4 mr-2" /> Габариты (Д×Ш×В)
                                    </span>
                                    <span className="font-heading font-bold text-lg">
                                        {product.dimensions
                                            ? `${product.dimensions.length}×${product.dimensions.width}×${product.dimensions.height} см`
                                            : "60×40×40 см"
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="prose prose-invert prose-brand max-w-none text-brand-silver font-light leading-relaxed mb-12">
                                {product.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
                                ) : (
                                    <p>Описание отсутствует.</p>
                                )}
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="flex items-center gap-2 text-sm text-green-500 font-bold uppercase tracking-widest mb-6">
                                    <CheckCircle2 className="h-5 w-5" /> В наличии на складе
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <AddToCartButton product={product} />
                                    <Link href="/contact" className="flex-1">
                                        <Button variant="outline" size="lg" className="w-full h-14 border-white/20 text-white hover:bg-white hover:text-black rounded-none uppercase tracking-widest font-bold text-sm">
                                            Задать вопрос
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

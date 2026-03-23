import { getProductById } from "@/lib/products";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductBuyForm } from "@/components/ui/ProductBuyForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
            <Header />

            <main className="flex-1 pt-32 pb-24">
                <div className="container mx-auto px-4 md:px-8">
                    <Link href="/catalog" className="inline-flex items-center text-brand-silver hover:text-foreground mb-12 transition-colors text-[10px] uppercase tracking-widest font-bold group">
                        <ArrowLeft className="mr-3 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" /> Назад к покупкам
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                        {/* Image Gallery */}
                        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 h-full">
                            {/* Thumbnails (Desktop) */}
                            {product.base_images && product.base_images.length > 1 && (
                                <div className="hidden md:flex flex-col gap-4 w-24 shrink-0 overflow-y-auto no-scrollbar max-h-[80vh]">
                                    {product.base_images.map((img, idx) => (
                                        <div key={idx} className="aspect-[3/4] bg-brand-dark cursor-pointer overflow-hidden border border-transparent hover:border-brand-gray transition-colors">
                                            <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Main Image */}
                            <div className="flex-1 aspect-[3/4] lg:aspect-auto lg:h-[80vh] bg-brand-dark overflow-hidden relative">
                                {product.base_images && product.base_images.length > 0 ? (
                                    <img
                                        src={product.base_images[0]}
                                        alt={product.title}
                                        className="w-full h-full object-cover cursor-zoom-in"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-brand-silver">
                                        Нет главного фото
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails (Mobile) */}
                            {product.base_images && product.base_images.length > 1 && (
                                <div className="flex md:hidden gap-4 overflow-x-auto no-scrollbar w-full pb-2">
                                    {product.base_images.map((img, idx) => (
                                        <div key={idx} className="w-20 shrink-0 aspect-[3/4] bg-brand-dark cursor-pointer overflow-hidden border border-transparent hover:border-brand-gray transition-colors">
                                            <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="lg:col-span-5 flex flex-col py-0 lg:py-8 sticky top-24 h-fit">
                            <div className="mb-8">
                                {product.category && (
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-brand-silver mb-3 block">
                                        {product.category}
                                    </span>
                                )}
                                <h1 className="text-3xl md:text-4xl font-sans font-medium uppercase mb-4 leading-tight">
                                    {product.title}
                                </h1>

                                <div className="text-2xl font-sans font-light text-foreground">
                                    {product.base_price ? product.base_price.toLocaleString('ru-RU') : '0'} ₽
                                </div>
                            </div>

                            <div className="w-full bg-brand-gray/30 h-px mb-8" />

                            <div className="mb-10">
                                <ProductBuyForm product={product as any} />
                            </div>

                            <div className="w-full bg-brand-gray/30 h-px mb-8" />

                            {/* Details Accordion / Text */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs uppercase tracking-widest font-bold mb-4">Детали продукта</h4>
                                    <div className="prose prose-sm prose-brand max-w-none text-brand-silver font-light leading-relaxed">
                                        {product.description ? (
                                            <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
                                        ) : (
                                            <p>Описание товара скоро появится.</p>
                                        )}
                                    </div>
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

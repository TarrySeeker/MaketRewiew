"use client";

import { useState } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { Button } from "./Button";
import { Product, ProductVariant } from "@/lib/products";
import { Check } from "lucide-react";

interface ProductBuyFormProps {
    product: Product;
}

export function ProductBuyForm({ product }: ProductBuyFormProps) {
    // Determine available colors and sizes from variants structure
    const hasVariants = product.variants && product.variants.length > 0;
    const initialVariant = hasVariants ? product.variants![0] : null;

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(initialVariant);

    // Find sizes available for the selected variant
    const availableSizes = selectedVariant?.skus?.map(sku => sku.size).filter(Boolean) || [];
    const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || "");

    const handleColorSelect = (varnt: ProductVariant) => {
        setSelectedVariant(varnt);
        const newSizes = varnt.skus?.map(sku => sku.size).filter(Boolean) || [];
        if (!newSizes.includes(selectedSize)) {
            setSelectedSize(newSizes[0] || "");
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Color Selection */}
            {hasVariants && product.variants!.length > 1 && (
                <div className="space-y-3">
                    <span className="text-xs uppercase tracking-widest text-brand-silver font-medium block">
                        Цвет: <span className="text-foreground ml-1">{selectedVariant?.color_name}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {product.variants!.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => handleColorSelect(v)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${selectedVariant?.id === v.id
                                        ? "border-foreground scale-110"
                                        : "border-brand-gray/30 hover:border-brand-gray"
                                    }`}
                                aria-label={`Выбрать цвет ${v.color_name}`}
                            >
                                <div
                                    className="w-6 h-6 rounded-full border border-background shadow-sm"
                                    style={{ backgroundColor: v.color_hex || '#ccc' }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs uppercase tracking-widest text-brand-silver font-medium">Размер</span>
                        <button className="text-[10px] uppercase tracking-widest text-brand-silver hover:text-foreground border-b border-brand-gray hover:border-foreground transition-all">Таблица размеров</button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {availableSizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`h-12 border flex items-center justify-center text-sm transition-all focus:outline-none ${selectedSize === size
                                        ? "border-foreground bg-foreground text-background font-medium"
                                        : "border-brand-gray hover:border-foreground text-foreground"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <AddToCartButton
                    product={product}
                    selectedColor={selectedVariant?.color_name}
                    selectedSize={selectedSize}
                    className="flex-1 h-14 bg-foreground text-background hover:bg-brand-silver hover:text-white rounded-none uppercase tracking-widest font-bold text-sm"
                />
            </div>

            <div className="space-y-2 mt-4 text-xs text-brand-silver font-light">
                <p className="flex items-center gap-2"><Check className="w-4 h-4" /> Быстрая доставка по России (СДЭК)</p>
                <p className="flex items-center gap-2"><Check className="w-4 h-4" /> примерка перед покупкой</p>
                <p className="flex items-center gap-2"><Check className="w-4 h-4" /> оплата при получении или онлайн</p>
            </div>
        </div>
    );
}

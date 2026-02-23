"use client";

import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/products";
import { toast } from "sonner";
import { ReactNode } from "react";

interface AddToCartButtonProps {
    product: Product;
    className?: string;
    children?: ReactNode;
}

export function AddToCartButton({ product, className, children }: AddToCartButtonProps) {
    const addItem = useCart((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if used inside a Link
        addItem({
            id: product.id,
            name: product.title,
            price: product.price,
            type: "product",
            quantity: 1,
            image: product.images && product.images.length > 0 ? product.images[0] : undefined,
            weight: product.weight,
            dimensions: product.dimensions
        });

        toast.success(`"${product.title}" добавлен в корзину!`, {
            description: "Перейдите в корзину для оформления заказа.",
        });
    };

    return (
        <Button
            onClick={handleAddToCart}
            size="lg"
            className={className || `flex-1 h-14 bg-white text-black hover:bg-brand-silver hover:text-black rounded-none uppercase tracking-widest font-bold text-sm`}
        >
            {children || (
                <>
                    <ShoppingCart className="mr-2 h-5 w-5" /> Добавить в корзину
                </>
            )}
        </Button>
    );
}

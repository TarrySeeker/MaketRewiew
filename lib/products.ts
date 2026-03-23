import { supabase } from "./supabaseClient";
import { mockProducts } from "./mockProducts";

export interface ProductSKU {
    id: string;
    variant_id: string;
    size: string;
    stock: number;
    price: number | null;
    barcode: string | null;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    color_name: string;
    color_hex: string | null;
    images: string[];
    skus?: ProductSKU[];
}

export interface Product {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    description: string | null;
    category: string | null;
    brand: string | null;
    is_active: boolean;
    variants?: ProductVariant[];
    base_price?: number;
    base_images?: string[];
    cover_position?: string;
}

export async function getProducts(): Promise<Product[]> {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*, variants:product_variants(*, skus:product_skus(*))")
            .eq("is_active", true)
            .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
            return mockProducts;
        }

        return data as Product[];
    } catch {
        return mockProducts;
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    // Try mock first for speed
    const mock = mockProducts.find((p) => p.id === id);

    try {
        const { data, error } = await supabase
            .from("products")
            .select("*, variants:product_variants(*, skus:product_skus(*))")
            .eq("id", id)
            .single();

        if (error || !data) return mock ?? null;
        return data as Product;
    } catch {
        return mock ?? null;
    }
}

import { supabase } from './supabaseClient';

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
    const { data, error } = await supabase
        .from('products')
        .select('*, variants:product_variants(*, skus:product_skus(*))')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*, variants:product_variants(*, skus:product_skus(*))')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data as Product;
}

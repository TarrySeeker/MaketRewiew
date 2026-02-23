import { supabase } from './supabaseClient';

export interface Product {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    price: number;
    description: string | null;
    images: string[];
    category: string | null;
    seo_title: string | null;
    seo_description: string | null;
    is_active: boolean;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    } | null;
}

export async function getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
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
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data as Product;
}

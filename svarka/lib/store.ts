import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number | "Custom Quote";
    type: "product";
    details?: string;
    quantity?: number; // added for products
    image?: string;    // added for products
    weight?: number;
    dimensions?: { length: number; width: number; height: number; } | null;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCart = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) => set((state) => {
                const existingItem = state.items.find(i => i.id === item.id);
                if (existingItem) {
                    return {
                        items: state.items.map(i =>
                            i.id === item.id
                                ? { ...i, quantity: (i.quantity || 1) + 1 }
                                : i
                        )
                    };
                }
                return { items: [...state.items, item] };
            }),
            removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            updateQuantity: (id, quantity) => set((state) => ({
                items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
            })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'store-cart-storage',
        }
    )
);

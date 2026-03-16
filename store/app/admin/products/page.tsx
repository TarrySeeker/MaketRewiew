"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Удалить товар?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  if (loading) {
    return <div className="text-center py-20">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Товары</h1>
        <button className="bg-foreground text-background px-6 py-3 rounded flex items-center gap-2 hover:bg-brand-silver transition-colors">
          <Plus className="h-5 w-5" />
          Добавить товар
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-background border border-brand-gray rounded-lg">
          <p className="text-brand-silver mb-4">Товаров пока нет</p>
          <button className="bg-foreground text-background px-6 py-3 rounded">
            Добавить первый товар
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-background border border-brand-gray p-6 rounded-lg flex items-center gap-6">
              <div className="w-24 h-24 bg-brand-gray rounded overflow-hidden flex-shrink-0">
                {product.base_images?.[0] && (
                  <img 
                    src={product.base_images[0]} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-1">{product.title}</h3>
                <p className="text-brand-silver text-sm mb-2">{product.brand || 'Без бренда'}</p>
                <p className="text-sm">{product.category || 'Без категории'}</p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold mb-2">{product.base_price?.toLocaleString()} ₽</div>
                <div className="text-sm text-brand-silver">
                  {product.is_active ? 'Активен' : 'Неактивен'}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-2 hover:bg-brand-gray rounded transition-colors">
                  <Edit className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => deleteProduct(product.id)}
                  className="p-2 hover:bg-red-500/20 rounded transition-colors text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

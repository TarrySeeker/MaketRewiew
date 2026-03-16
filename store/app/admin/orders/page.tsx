"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Package } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-20">Загрузка...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Заказы</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-background border border-brand-gray rounded-lg">
          <Package className="h-16 w-16 mx-auto mb-4 text-brand-silver" />
          <p className="text-brand-silver">Заказов пока нет</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-background border border-brand-gray p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl mb-2">Заказ #{order.id.slice(0, 8)}</h3>
                  <p className="text-brand-silver text-sm">
                    {new Date(order.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{order.total?.toLocaleString()} ₽</div>
                  <div className="text-sm text-brand-silver capitalize">{order.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

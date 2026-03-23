import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Админ-панель</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/admin/products">
          <div className="bg-background border border-brand-gray p-8 rounded-lg hover:border-foreground transition-colors cursor-pointer">
            <Package className="h-12 w-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Товары</h2>
            <p className="text-brand-silver">Управление каталогом товаров, вариантами и SKU</p>
          </div>
        </Link>

        <Link href="/admin/orders">
          <div className="bg-background border border-brand-gray p-8 rounded-lg hover:border-foreground transition-colors cursor-pointer">
            <ShoppingBag className="h-12 w-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Заказы</h2>
            <p className="text-brand-silver">Просмотр и управление заказами</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

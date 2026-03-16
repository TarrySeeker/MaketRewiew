import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-dark">
      <nav className="border-b border-brand-gray bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-bold text-xl">
              NUW Админ-панель
            </Link>
            <div className="flex gap-6">
              <Link href="/admin/products" className="hover:text-foreground transition-colors">
                Товары
              </Link>
              <Link href="/admin/orders" className="hover:text-foreground transition-colors">
                Заказы
              </Link>
              <Link href="/" className="text-brand-silver hover:text-foreground">
                ← На сайт
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

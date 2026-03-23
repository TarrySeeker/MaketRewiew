import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Truck, CreditCard, Package } from "lucide-react";

export default function DeliveryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 uppercase tracking-wider">Доставка и Оплата</h1>
          <p className="text-center text-brand-silver mb-16">
            Информация о доставке и способах оплаты
          </p>

          <div className="space-y-12">
            {/* Delivery */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Truck className="h-8 w-8 text-foreground" />
                <h2 className="text-2xl font-bold uppercase tracking-wide">Доставка</h2>
              </div>
              <div className="space-y-4 text-brand-silver">
                <div className="border-l-4 border-foreground pl-6 py-2">
                  <h3 className="font-semibold text-foreground mb-2">Доставка СДЭК</h3>
                  <p>Доставка по всей России курьерской службой СДЭК. Срок доставки 3-7 дней.</p>
                  <p className="mt-2">Стоимость рассчитывается автоматически при оформлении заказа.</p>
                </div>
                <div className="border-l-4 border-foreground pl-6 py-2">
                  <h3 className="font-semibold text-foreground mb-2">Самовывоз</h3>
                  <p>Бесплатно из нашего магазина в г. Новосибирск, ул. Ленина, 1</p>
                  <p className="mt-2">Пн-Вс: 10:00 - 22:00</p>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-8 w-8 text-foreground" />
                <h2 className="text-2xl font-bold uppercase tracking-wide">Оплата</h2>
              </div>
              <div className="space-y-4 text-brand-silver">
                <div className="border-l-4 border-foreground pl-6 py-2">
                  <h3 className="font-semibold text-foreground mb-2">Онлайн-оплата</h3>
                  <p>Банковской картой на сайте через защищённое соединение</p>
                </div>
                <div className="border-l-4 border-foreground pl-6 py-2">
                  <h3 className="font-semibold text-foreground mb-2">При получении</h3>
                  <p>Наличными или картой при получении в пункте выдачи СДЭК</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

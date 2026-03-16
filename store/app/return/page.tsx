import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RotateCcw } from "lucide-react";

export default function ReturnPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 uppercase tracking-wider">Возврат Товара</h1>
          <p className="text-center text-brand-silver mb-16">
            Условия возврата и обмена
          </p>

          <div className="space-y-8 text-brand-silver">
            <div className="border-l-4 border-foreground pl-6 py-4">
              <h3 className="font-semibold text-foreground mb-3 text-xl">Гарантия 30 дней</h3>
              <p>Вы можете вернуть или обменять товар в течение 30 дней с момента покупки.</p>
            </div>

            <div className="border-l-4 border-foreground pl-6 py-4">
              <h3 className="font-semibold text-foreground mb-3 text-xl">Условия возврата</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Товар не был в употреблении</li>
                <li>Сохранены все ярлыки и бирки</li>
                <li>Товарный вид не нарушен</li>
                <li>Наличие чека или подтверждения заказа</li>
              </ul>
            </div>

            <div className="border-l-4 border-foreground pl-6 py-4">
              <h3 className="font-semibold text-foreground mb-3 text-xl">Как оформить возврат</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Свяжитесь с нами по телефону или email</li>
                <li>Сообщите номер заказа и причину возврата</li>
                <li>Отправьте товар обратно или принесите в магазин</li>
                <li>Деньги вернутся в течение 7-14 дней</li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

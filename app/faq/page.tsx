import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "Как оформить заказ?",
      answer: "Выберите товар, добавьте в корзину, перейдите в корзину и нажмите 'Оформить заказ'. Заполните контактные данные и выберите способ доставки."
    },
    {
      question: "Сколько стоит доставка?",
      answer: "Стоимость доставки рассчитывается автоматически при оформлении заказа в зависимости от города и веса товара. Самовывоз из магазина бесплатный."
    },
    {
      question: "Как долго доставка?",
      answer: "Доставка СДЭК занимает 3-7 дней в зависимости от региона. Самовывоз доступен сразу после подтверждения заказа."
    },
    {
      question: "Можно ли примерить товар?",
      answer: "Да, вы можете примерить товар в нашем магазине по адресу: г. Новосибирск, ул. Ленина, 1. Режим работы: Пн-Вс 10:00 - 22:00"
    },
    {
      question: "Какие способы оплаты доступны?",
      answer: "Оплата банковской картой онлайн, наличными или картой при получении в пункте выдачи СДЭК."
    },
    {
      question: "Как вернуть товар?",
      answer: "Возврат возможен в течение 30 дней. Товар должен быть в первоначальном состоянии с сохранёнными бирками. Подробнее на странице 'Возврат'."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 uppercase tracking-wider">Частые Вопросы</h1>
          <p className="text-center text-brand-silver mb-16">
            Ответы на популярные вопросы
          </p>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-l-4 border-foreground pl-6 py-4">
                <h3 className="font-semibold text-foreground mb-3 text-xl flex items-start gap-3">
                  <HelpCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  {faq.question}
                </h3>
                <p className="text-brand-silver">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

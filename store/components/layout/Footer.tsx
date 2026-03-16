import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-brand-dark border-t border-brand-gray py-16 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-xl mb-4 uppercase tracking-wide">NUW</h3>
            <p className="text-brand-silver text-sm leading-relaxed">
              Уличная одежда премиум-класса
            </p>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-wide text-sm">Информация</h4>
            <ul className="space-y-3 text-brand-silver text-sm">
              <li><Link href="/about" className="hover:text-foreground transition-colors">О нас</Link></li>
              <li><Link href="/delivery" className="hover:text-foreground transition-colors">Доставка и оплата</Link></li>
              <li><Link href="/return" className="hover:text-foreground transition-colors">Возврат</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">Частые вопросы</Link></li>
            </ul>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-wide text-sm">Каталог</h4>
            <ul className="space-y-3 text-brand-silver text-sm">
              <li><Link href="/catalog" className="hover:text-foreground transition-colors">Одежда</Link></li>
              <li><Link href="/catalog" className="hover:text-foreground transition-colors">Обувь</Link></li>
              <li><Link href="/catalog" className="hover:text-foreground transition-colors">Аксессуары</Link></li>
              <li><Link href="/catalog" className="hover:text-foreground transition-colors">Новинки</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-wide text-sm">Контакты</h4>
            <ul className="space-y-3 text-brand-silver text-sm">
              <li>г. Новосибирск</li>
              <li>ул. Ленина, 1</li>
              <li className="pt-2">Пн-Вс: 10:00 - 22:00</li>
              <li>+7 (999) 123-45-67</li>
              <li><a href="mailto:info@nuw-shop.ru" className="hover:text-foreground transition-colors">info@nuw-shop.ru</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-gray pt-8 text-center text-brand-silver text-sm">
          <p>© {new Date().getFullYear()} NUW. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

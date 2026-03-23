import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 uppercase tracking-wider">Контакты</h1>
          <p className="text-center text-brand-silver mb-16 max-w-2xl mx-auto">
            Свяжитесь с нами удобным для вас способом
          </p>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-foreground flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2 uppercase tracking-wide">Адрес</h3>
                  <p className="text-brand-silver">г. Новосибирск, ул. Ленина, 1</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-foreground flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2 uppercase tracking-wide">Режим работы</h3>
                  <p className="text-brand-silver">Пн-Вс: 10:00 - 22:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-foreground flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2 uppercase tracking-wide">Телефон</h3>
                  <a href="tel:+79991234567" className="text-brand-silver hover:text-foreground transition-colors">
                    +7 (999) 123-45-67
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-foreground flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2 uppercase tracking-wide">Email</h3>
                  <a href="mailto:info@nuw-shop.ru" className="text-brand-silver hover:text-foreground transition-colors">
                    info@nuw-shop.ru
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-[400px] bg-brand-gray rounded-lg overflow-hidden">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=82.920400%2C55.030200&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1MzExMjM3MRIW0KDQvtGB0YHQuNGPLCDQodCQ0JYiCg1q0QNCFT5QQkI%2C&z=16"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

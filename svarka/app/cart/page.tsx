"use client";

import { useCart } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Trash2, ArrowRight, CheckCircle2, Minus, Plus, Search, Building2, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart } = useCart();
    const [mounted, setMounted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // CDEK State
    const [cities, setCities] = useState<any[]>([]);
    const [searchCity, setSearchCity] = useState('');
    const [selectedCity, setSelectedCity] = useState<any | null>(null);
    const [offices, setOffices] = useState<any[]>([]);
    const [selectedOffice, setSelectedOffice] = useState<any | null>(null);
    const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showCitiesDropdown, setShowCitiesDropdown] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (searchCity.length < 2) {
            setCities([]);
            setShowCitiesDropdown(false);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/cdek?action=cities&city=${encodeURIComponent(searchCity)}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCities(data);
                    setShowCitiesDropdown(true);
                }
            } catch (e) {
                console.error(e);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchCity]);

    const handleCitySelect = async (city: any) => {
        setSelectedCity(city);
        setSearchCity(city.city);
        setShowCitiesDropdown(false);
        setSelectedOffice(null);
        setDeliveryCost(null);

        try {
            const res = await fetch(`/api/cdek?action=offices&code=${city.code}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setOffices(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleOfficeSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const officeCode = e.target.value;
        const office = offices.find(o => o.code === officeCode);
        if (!office) {
            setSelectedOffice(null);
            setDeliveryCost(null);
            return;
        }
        setSelectedOffice(office);

        setIsCalculating(true);
        try {
            const productItems = items.filter(i => i.type === 'product');
            const totalQuantity = productItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

            if (totalQuantity === 0) {
                setDeliveryCost(0);
                setIsCalculating(false);
                return;
            }

            // Формируем массив мест (каждый товар = отдельное грузоместо для простоты или всё в одном)
            const packages = productItems.flatMap(item => {
                const qty = item.quantity || 1;
                const weight = item.weight || 20000; // По умолчанию 20кг
                const dims = item.dimensions || { length: 60, width: 40, height: 40 };
                return Array(qty).fill({
                    weight: weight,
                    length: dims.length,
                    width: dims.width,
                    height: dims.height
                });
            });

            const payload = {
                type: 1, // 1 - интернет-магазин, 2 - доставка
                from_location: { code: 269 }, // Екатеринбург (город отправителя)
                to_location: { code: selectedCity.code }, // Город получателя
                packages: packages
            };

            const res = await fetch(`/api/cdek`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'calculator', payload })
            });
            const data = await res.json();

            if (data.tariff_codes && data.tariff_codes.length > 0) {
                const validTariffs = data.tariff_codes.filter((t: any) => t.delivery_mode === 4 || t.delivery_mode === 3);
                const lowest = validTariffs.sort((a: any, b: any) => a.delivery_sum - b.delivery_sum)[0];

                if (lowest) {
                    setDeliveryCost(lowest.delivery_sum);
                } else if (data.tariff_codes[0]) {
                    setDeliveryCost(data.tariff_codes[0].delivery_sum);
                }
            } else {
                setDeliveryCost(null);
                alert("Доставка СДЭК в данный ПВЗ невозможна или не настроена.");
            }
        } catch (e) {
            console.error(e);
            alert("Ошибка расчета стоимости доставки СДЭК.");
        } finally {
            setIsCalculating(false);
        }
    };

    const total = items.reduce((acc, item) => {
        const itemTotal = typeof item.price === "number" ? item.price * (item.quantity || 1) : 0;
        return acc + itemTotal;
    }, 0);

    const finalTotal = total + (deliveryCost || 0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const comment = formData.get('comment') as string;

        try {
            // Save order to Supabase
            const { error } = await supabase.from('orders').insert([{
                customer_info: { name, phone, comment },
                items: items,
                total: finalTotal,
                status: 'new',
                shipping_cost: deliveryCost || 0,
                shipping_method: selectedOffice ? 'СДЭК ПВЗ' : 'Не выбран',
                delivery_detail: selectedOffice ? {
                    city: selectedCity?.city,
                    address: selectedOffice.location?.address || selectedOffice.address,
                    code: selectedOffice.code
                } : null
            }]);

            if (error) {
                console.error("Error creating order:", error);
                alert("Произошла ошибка при оформлении заказа.");
                setIsSubmitting(false);
                return;
            }

            setIsSubmitted(true);
            setTimeout(() => {
                clearCart();
            }, 500);
        } catch (err) {
            console.error(err);
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    if (isSubmitted) {
        return (
            <div className="flex flex-col min-h-screen bg-brand-black text-white">
                <Header />
                <main className="flex-1 pt-32 pb-24 flex items-center justify-center">
                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-flex p-6 border border-white/10 rounded-full mb-8 bg-brand-dark animate-[scaleIn_0.5s_ease-out]">
                            <CheckCircle2 className="h-20 w-20 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading font-black uppercase mb-6 drop-shadow-lg">
                            Заказ <span className="text-brand-silver">Оформлен</span>
                        </h1>
                        <p className="text-brand-silver max-w-lg mx-auto text-lg font-light mb-12">
                            Спасибо за ваш заказ! Наши специалисты свяжутся с вами в ближайшее время для уточнения деталей доставки и оплаты.
                        </p>
                        <Link href="/catalog">
                            <Button size="lg" className="h-14 px-10 bg-white text-black hover:bg-brand-silver hover:text-black rounded-none uppercase tracking-widest font-bold">
                                Вернуться в каталог
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-brand-black text-white selection:bg-white selection:text-black">
            <Header />

            <main className="flex-1 pt-32 pb-24">
                <div className="container mx-auto px-4">
                    <div className="mb-16">
                        <div className="inline-block mb-4">
                            <span className="py-2 px-4 border border-white/20 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
                                Оформление
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading font-black uppercase mb-4">
                            Ваша <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-brand-silver">Корзина</span>
                        </h1>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-24 bg-brand-dark border border-white/10">
                            <p className="text-brand-silver text-xl font-light mb-8">В корзине пока пусто.</p>
                            <Link href="/catalog">
                                <Button size="lg" className="bg-white text-black hover:bg-brand-silver hover:text-black rounded-none uppercase tracking-widest font-bold px-8">
                                    Перейти в каталог
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                            {/* Items List */}
                            <div className="lg:col-span-2 space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="bg-brand-dark border border-white/10 p-4 flex flex-col sm:flex-row gap-6 items-center">
                                        {/* Image */}
                                        <div className="w-full sm:w-32 h-32 bg-brand-black border border-white/5 flex-shrink-0 relative">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-brand-silver">Нет фото</div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 text-center sm:text-left">
                                            <div className="text-xs font-bold uppercase tracking-widest text-brand-silver mb-1">
                                                {item.type === 'product' ? 'Товар' : 'Услуга'}
                                            </div>
                                            <h3 className="text-xl font-heading font-bold uppercase mb-2">{item.name}</h3>
                                            {item.details && <p className="text-sm text-brand-silver font-light">{item.details}</p>}
                                        </div>

                                        {/* Quantity for products */}
                                        {item.type === 'product' && (
                                            <div className="flex items-center border border-white/20">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                                                    className="p-2 hover:bg-white/10 transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-12 text-center font-bold font-mono">{item.quantity || 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                                    className="p-2 hover:bg-white/10 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Price & Actions */}
                                        <div className="flex flex-col items-center sm:items-end gap-4 min-w-[120px]">
                                            <div className="font-heading font-bold text-xl">
                                                {typeof item.price === "number"
                                                    ? `${(item.price * (item.quantity || 1)).toLocaleString('ru-RU')} ₽`
                                                    : item.price}
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-white transition-colors flex items-center"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" /> Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Checkout Form */}
                            <div className="lg:col-span-1 bg-brand-dark border border-white/10 p-8 sticky top-32">
                                <h2 className="text-2xl font-heading font-bold uppercase mb-6 pb-6 border-b border-white/10">Оформление Заказа</h2>
                                <div className="flex justify-between items-center text-xl font-bold font-heading mb-8">
                                    <span>Итого:</span>
                                    <span>{finalTotal.toLocaleString('ru-RU')} ₽</span>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-brand-silver">Ваше Имя</label>
                                        <input
                                            name="name"
                                            required
                                            type="text"
                                            className="w-full bg-brand-black border border-white/20 text-white placeholder-white/30 p-4 focus:outline-none focus:border-white transition-colors"
                                            placeholder="Иван Иванов"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-brand-silver">Телефон</label>
                                        <input
                                            name="phone"
                                            required
                                            type="tel"
                                            className="w-full bg-brand-black border border-white/20 text-white placeholder-white/30 p-4 focus:outline-none focus:border-white transition-colors"
                                            placeholder="+7 (999) 000-00-00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-brand-silver">Комментарий</label>
                                        <textarea
                                            name="comment"
                                            className="w-full bg-brand-black border border-white/20 text-white placeholder-white/30 p-4 focus:outline-none focus:border-white transition-colors resize-none"
                                            rows={2}
                                            placeholder="Уточнения к заказу..."
                                        />
                                    </div>

                                    {/* Блок выбора доставки */}
                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-silver">Доставка (СДЭК)</h3>

                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-4 w-4 text-white/50" />
                                            </div>
                                            <input
                                                type="text"
                                                value={searchCity}
                                                onChange={(e) => {
                                                    setSearchCity(e.target.value);
                                                    if (selectedCity) setSelectedCity(null);
                                                }}
                                                placeholder="Введите ваш город (например, Москва)"
                                                className="w-full bg-brand-black border border-white/20 text-white placeholder-white/30 p-4 pl-10 focus:outline-none focus:border-white transition-colors"
                                            />
                                            {showCitiesDropdown && cities.length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-brand-black border border-white/20 max-h-60 overflow-y-auto shadow-2xl">
                                                    {cities.map((city: any) => (
                                                        <div
                                                            key={city.code}
                                                            onClick={() => handleCitySelect(city)}
                                                            className="p-3 hover:bg-white/10 cursor-pointer text-sm font-light"
                                                        >
                                                            {city.city} <span className="text-white/50 text-xs">({city.region})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {selectedCity && offices.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <MapPin className="h-4 w-4 text-white/50" />
                                                    </div>
                                                    <select
                                                        onChange={handleOfficeSelect}
                                                        className="w-full bg-brand-black border border-white/20 text-white p-4 pl-10 focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer text-sm"
                                                        value={selectedOffice?.code || ""}
                                                    >
                                                        <option value="" disabled>-- Выберите ПВЗ СДЭК --</option>
                                                        {offices.map((office: any) => (
                                                            <option key={office.code} value={office.code} className="bg-brand-black text-white">
                                                                {office.name} ({office.location?.address || office.address})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {isCalculating && (
                                            <p className="text-xs text-brand-silver animate-pulse">Расчет стоимости доставки...</p>
                                        )}

                                        {deliveryCost !== null && !isCalculating && (
                                            <div className="flex justify-between items-center text-sm p-4 bg-brand-black border border-white/10">
                                                <span className="text-brand-silver font-light">Доставка СДЭК:</span>
                                                <span className="font-bold">{deliveryCost.toLocaleString('ru-RU')} ₽</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-14 bg-white text-black hover:bg-brand-silver hover:text-black rounded-none uppercase tracking-widest font-bold text-sm"
                                    >
                                        {isSubmitting ? 'Отправка...' : 'Подтвердить Заказ'} <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                    <p className="text-xs text-brand-silver text-center font-light">
                                        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
                                    </p>
                                </form>
                            </div>

                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

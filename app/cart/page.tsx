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
                // Default apparel weight to 500g and typical package sizes
                const weight = 500;
                const dims = { length: 30, width: 20, height: 10 };
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

    const [user, setUser] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp' | 'split' | 'cod'>('card');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const comment = formData.get('comment') as string;

        try {
            const payload = {
                items,
                customer: { name, phone, comment },
                delivery: selectedOffice ? {
                    city: selectedCity?.city,
                    address: selectedOffice.location?.address || selectedOffice.address,
                    code: selectedOffice.code
                } : null,
                paymentMethod,
                total,
                shippingCost: deliveryCost || 0,
                userId: user?.id || null
            };

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Error creating order:", data.error);
                alert(`Произошла ошибка при оформлении заказа: ${data.error}`);
                setIsSubmitting(false);
                return;
            }

            if (data.paymentUrl) {
                clearCart();
                window.location.href = data.paymentUrl; // Redirect to payment gateway
                return;
            }

            setIsSubmitted(true);
            setTimeout(() => {
                clearCart();
            }, 500);
        } catch (err) {
            console.error(err);
            alert("Сетевая ошибка при оформлении заказа.");
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    if (isSubmitted) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <main className="flex-1 pt-32 pb-24 flex items-center justify-center">
                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-flex p-6 border border-brand-gray rounded-full mb-8 bg-brand-dark animate-[scaleIn_0.5s_ease-out]">
                            <CheckCircle2 className="h-20 w-20 text-foreground" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-sans font-black uppercase mb-6">
                            Заказ <span className="text-brand-silver">Оформлен</span>
                        </h1>
                        <p className="text-brand-silver max-w-lg mx-auto text-lg font-light mb-12">
                            Спасибо за ваш заказ! Наши специалисты свяжутся с вами в ближайшее время для уточнения деталей доставки и оплаты.
                        </p>
                        <Link href="/catalog">
                            <Button size="lg" className="h-14 px-10 rounded-none uppercase tracking-widest font-bold">
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
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
            <Header />

            <main className="flex-1 pt-32 pb-24">
                <div className="container mx-auto px-4">
                    <div className="mb-16">
                        <div className="inline-block mb-4">
                            <span className="py-2 px-4 border border-foreground/20 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
                                Оформление
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-sans font-black uppercase mb-4">
                            Ваша <span className="text-brand-silver">Корзина</span>
                        </h1>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-24 bg-brand-dark border border-brand-gray">
                            <p className="text-brand-silver text-xl font-light mb-8">В корзине пока пусто.</p>
                            <Link href="/catalog">
                                <Button size="lg" className="rounded-none uppercase tracking-widest font-bold px-8">
                                    Перейти в каталог
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                            {/* Items List */}
                            <div className="lg:col-span-2 space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="bg-brand-dark border border-brand-gray p-4 flex flex-col sm:flex-row gap-6 items-center">
                                        {/* Image */}
                                        <div className="w-full sm:w-32 h-32 bg-background border border-brand-gray flex-shrink-0 relative">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-brand-silver">Нет фото</div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 text-center sm:text-left">
                                            <div className="text-xs font-bold uppercase tracking-widest text-brand-silver mb-1">
                                                Товар
                                            </div>
                                            <h3 className="text-xl font-sans font-bold uppercase mb-2">{item.name}</h3>

                                            {(item.color || item.size) && (
                                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
                                                    {item.color && (
                                                        <span className="text-xs bg-brand-dark px-2 py-1 uppercase tracking-widest rounded-sm border border-brand-gray text-brand-silver">
                                                            Цвет: {item.color}
                                                        </span>
                                                    )}
                                                    {item.size && (
                                                        <span className="text-xs bg-brand-dark px-2 py-1 uppercase tracking-widest rounded-sm border border-brand-gray text-brand-silver">
                                                            Размер: {item.size}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Quantity */}
                                        {item.type === 'product' && (
                                            <div className="flex items-center border border-brand-gray">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                                                    className="p-2 hover:bg-brand-dark transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-12 text-center font-bold font-mono">{item.quantity || 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                                    className="p-2 hover:bg-brand-dark transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Price & Actions */}
                                        <div className="flex flex-col items-center sm:items-end gap-4 min-w-[120px]">
                                            <div className="font-sans font-bold text-xl">
                                                {typeof item.price === "number"
                                                    ? `${(item.price * (item.quantity || 1)).toLocaleString('ru-RU')} ₽`
                                                    : item.price}
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" /> Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Checkout Form */}
                            <div className="lg:col-span-1 bg-brand-dark border border-brand-gray p-8 sticky top-32">
                                <h2 className="text-2xl font-sans font-bold uppercase mb-6 pb-6 border-b border-brand-gray">Оформление Заказа</h2>
                                <div className="flex justify-between items-center text-xl font-bold font-sans mb-8">
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
                                            className="w-full bg-background border border-brand-gray text-foreground placeholder-brand-silver/50 p-4 focus:outline-none focus:border-foreground transition-colors"
                                            placeholder="Иван Иванов"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-brand-silver">Телефон</label>
                                        <input
                                            name="phone"
                                            required
                                            type="tel"
                                            className="w-full bg-background border border-brand-gray text-foreground placeholder-brand-silver/50 p-4 focus:outline-none focus:border-foreground transition-colors"
                                            placeholder="+7 (999) 000-00-00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-brand-silver">Комментарий</label>
                                        <textarea
                                            name="comment"
                                            className="w-full bg-background border border-brand-gray text-foreground placeholder-brand-silver/50 p-4 focus:outline-none focus:border-foreground transition-colors resize-none"
                                            rows={2}
                                            placeholder="Уточнения к заказу..."
                                        />
                                    </div>

                                    {/* Блок выбора доставки */}
                                    <div className="space-y-4 pt-4 border-t border-brand-gray">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-silver">Доставка (СДЭК)</h3>

                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-4 w-4 text-brand-silver/50" />
                                            </div>
                                            <input
                                                type="text"
                                                value={searchCity}
                                                onChange={(e) => {
                                                    setSearchCity(e.target.value);
                                                    if (selectedCity) setSelectedCity(null);
                                                }}
                                                placeholder="Введите ваш город (например, Москва)"
                                                className="w-full bg-background border border-brand-gray text-foreground placeholder-brand-silver/50 p-4 pl-10 focus:outline-none focus:border-foreground transition-colors"
                                            />
                                            {showCitiesDropdown && cities.length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-background border border-brand-gray max-h-60 overflow-y-auto shadow-2xl">
                                                    {cities.map((city: any) => (
                                                        <div
                                                            key={city.code}
                                                            onClick={() => handleCitySelect(city)}
                                                            className="p-3 hover:bg-brand-dark cursor-pointer text-sm font-light"
                                                        >
                                                            {city.city} <span className="text-brand-silver/50 text-xs">({city.region})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {selectedCity && offices.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <MapPin className="h-4 w-4 text-brand-silver/50" />
                                                    </div>
                                                    <select
                                                        onChange={handleOfficeSelect}
                                                        className="w-full bg-background border border-brand-gray text-foreground p-4 pl-10 focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer text-sm"
                                                        value={selectedOffice?.code || ""}
                                                    >
                                                        <option value="" disabled>-- Выберите ПВЗ СДЭК --</option>
                                                        {offices.map((office: any) => (
                                                            <option key={office.code} value={office.code}>
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
                                            <div className="flex justify-between items-center text-sm p-4 bg-background border border-brand-gray">
                                                <span className="text-brand-silver font-light">Доставка СДЭК:</span>
                                                <span className="font-bold">{deliveryCost.toLocaleString('ru-RU')} ₽</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Блок выбора оплаты */}
                                    <div className="space-y-4 pt-4 border-t border-brand-gray">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-silver">Способ Оплаты</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <label className={`border p-4 cursor-pointer flex items-center space-x-3 transition-colors ${paymentMethod === 'card' ? 'border-foreground bg-brand-dark' : 'border-brand-gray hover:border-brand-silver'}`}>
                                                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-foreground' : 'border-brand-silver'}`}>
                                                    {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-foreground" />}
                                                </div>
                                                <span className="text-sm font-bold">Картой онлайн</span>
                                            </label>

                                            <label className={`border p-4 cursor-pointer flex items-center space-x-3 transition-colors ${paymentMethod === 'sbp' ? 'border-foreground bg-brand-dark' : 'border-brand-gray hover:border-brand-silver'}`}>
                                                <input type="radio" name="payment" value="sbp" checked={paymentMethod === 'sbp'} onChange={() => setPaymentMethod('sbp')} className="hidden" />
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'sbp' ? 'border-foreground' : 'border-brand-silver'}`}>
                                                    {paymentMethod === 'sbp' && <div className="w-2 h-2 rounded-full bg-foreground" />}
                                                </div>
                                                <span className="text-sm font-bold">СБП</span>
                                            </label>

                                            <label className={`border p-4 cursor-pointer flex items-center space-x-3 transition-colors ${paymentMethod === 'split' ? 'border-foreground bg-brand-dark' : 'border-brand-gray hover:border-brand-silver'}`}>
                                                <input type="radio" name="payment" value="split" checked={paymentMethod === 'split'} onChange={() => setPaymentMethod('split')} className="hidden" />
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'split' ? 'border-foreground' : 'border-brand-silver'}`}>
                                                    {paymentMethod === 'split' && <div className="w-2 h-2 rounded-full bg-foreground" />}
                                                </div>
                                                <span className="text-sm font-bold">Долями / Сплит</span>
                                            </label>

                                            <label className={`border p-4 flex items-center space-x-3 transition-colors ${!user ? 'opacity-50 cursor-not-allowed border-brand-gray/50' : paymentMethod === 'cod' ? 'border-foreground bg-brand-dark cursor-pointer' : 'border-brand-gray hover:border-brand-silver cursor-pointer'}`}>
                                                <input disabled={!user} type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => user && setPaymentMethod('cod')} className="hidden" />
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-foreground' : 'border-brand-silver'}`}>
                                                    {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-foreground" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold">При получении</span>
                                                    {!user && <span className="text-xs text-brand-silver font-light">Только для авторизованных</span>}
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-14 rounded-none uppercase tracking-widest font-bold text-sm"
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

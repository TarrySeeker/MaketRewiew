"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Calculator as CalculatorIcon, ShoppingCart, RefreshCw, DollarSign } from "lucide-react";
import { useCart } from "@/lib/store";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface CalculatorSettings {
    key: string;
    value: number;
}

export function Calculator() {
    const [material, setMaterial] = useState("steel");
    const [weldType, setWeldType] = useState("mig");
    const [length, setLength] = useState<number>(0);
    const [estimate, setEstimate] = useState<number | null>(null);
    const [settings, setSettings] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    const { addItem } = useCart();
    const router = useRouter();

    useEffect(() => {
        async function fetchSettings() {
            const { data } = await supabase.from('calculator_settings').select('key, value');
            if (data) {
                const settingsMap: Record<string, number> = {};
                data.forEach((item: CalculatorSettings) => {
                    settingsMap[item.key] = item.value;
                });
                setSettings(settingsMap);
            }
            setLoading(false);
        }
        fetchSettings();
    }, []);

    const calculate = () => {
        // Default fallbacks if DB fetch fails
        let baseRate = 500;
        if (weldType === "mig") baseRate = settings?.rate_mig || 500;
        if (weldType === "tig") baseRate = settings?.rate_tig || 800;
        if (weldType === "stick") baseRate = settings?.rate_stick || 600;

        let materialMultiplier = 1;
        if (material === "aluminum") materialMultiplier = settings?.mult_aluminum || 1.5;
        if (material === "stainless") materialMultiplier = settings?.mult_stainless || 1.8;
        if (material === "titanium") materialMultiplier = settings?.mult_titanium || 3.0;

        const total = baseRate * materialMultiplier * length;
        setEstimate(Math.round(total));
    };

    const addToCart = () => {
        if (estimate) {
            addItem({
                id: `est-${Date.now()}`,
                name: `Расчет: ${material === 'steel' ? 'Сталь' : material} / ${weldType.toUpperCase()}`,
                price: estimate,
                type: "estimate",
                details: `Длина шва: ${length}м`
            });
            router.push("/cart");
        }
    };

    if (loading) return <div className="text-white">Загрузка данных...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8 bg-brand-gray/20 p-8 border border-white/5 backdrop-blur-sm">
                <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-bold text-white uppercase">Параметры</h2>
                    <p className="text-brand-silver text-sm">Укажите детали проекта.</p>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-brand-silver uppercase tracking-widest">Материал</label>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { id: "steel", label: "Сталь" },
                            { id: "aluminum", label: "Алюминий" },
                            { id: "stainless", label: "Нержавейка" },
                            { id: "titanium", label: "Титан" }
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMaterial(m.id)}
                                className={`p-4 border text-sm font-bold uppercase tracking-wider transition-all duration-300 ${material === m.id
                                        ? "border-white bg-white text-black"
                                        : "border-white/20 bg-transparent text-brand-silver hover:border-white/50 hover:text-white"
                                    }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-brand-silver uppercase tracking-widest">Тип сварки</label>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { id: "mig", label: "MIG", desc: "Полуавтомат" },
                            { id: "tig", label: "TIG", desc: "Аргон" },
                            { id: "stick", label: "MMA", desc: "Электрод" }
                        ].map((w) => (
                            <button
                                key={w.id}
                                onClick={() => setWeldType(w.id)}
                                className={`p-4 border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${weldType === w.id
                                        ? "border-white bg-white text-black"
                                        : "border-white/20 bg-transparent text-brand-silver hover:border-white/50 hover:text-white"
                                    }`}
                            >
                                <span className="font-bold text-sm uppercase">{w.label}</span>
                                <span className="text-[10px] opacity-70 uppercase tracking-wide">{w.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-brand-silver uppercase tracking-widest">Длина шва (м)</label>
                    <input
                        type="number"
                        min="0"
                        value={length || ""}
                        onChange={(e) => setLength(parseFloat(e.target.value))}
                        className="w-full bg-brand-black border border-white/20 px-6 py-4 text-white placeholder-brand-silver/30 focus:outline-none focus:border-white transition-colors"
                        placeholder="0.0"
                    />
                </div>

                <Button onClick={calculate} size="lg" className="w-full h-14 bg-white text-black hover:bg-brand-silver font-bold uppercase tracking-widest rounded-none">
                    <CalculatorIcon className="mr-2 h-5 w-5" /> Рассчитать стоимость
                </Button>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex-1 flex flex-col justify-center items-center text-center p-12 bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {estimate !== null ? (
                        <div className="space-y-6 animate-in fade-in zoom-in duration-500 w-full relative z-10">
                            <p className="text-brand-silver uppercase tracking-[0.3em] text-xs font-bold">Ориентировочная смета</p>
                            <div className="text-6xl md:text-8xl font-heading font-black text-white tracking-tighter">
                                {estimate.toLocaleString('ru-RU')} ₽
                            </div>
                            <p className="text-xs text-brand-silver/60 max-w-xs mx-auto">
                                *Не является публичной офертой. Стоимость может измениться после осмотра.
                            </p>
                            <div className="pt-8 w-full">
                                <Button size="lg" className="w-full h-14 border border-white text-white hover:bg-white hover:text-black font-bold uppercase tracking-widest rounded-none bg-transparent" onClick={addToCart}>
                                    <ShoppingCart className="mr-2 h-4 w-4" /> Добавить в смету
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-brand-silver/30 flex flex-col items-center">
                            <RefreshCw className="h-24 w-24 mb-6 opacity-20" />
                            <p className="uppercase tracking-widest text-sm font-bold">Введите параметры для расчета</p>
                        </div>
                    )}
                </div>

                <div className="bg-brand-gray/20 border border-white/10 p-6 flex items-start gap-4">
                    <DollarSign className="h-6 w-6 text-white shrink-0" />
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">
                            Минимальный заказ
                        </h4>
                        <p className="text-xs text-brand-silver leading-relaxed">
                            Минимальная стоимость выезда бригады — <strong>3000 ₽</strong>.
                            В эту сумму входит диагностика и мелкий ремонт до 1 часа.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

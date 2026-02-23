"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CalculatorSetting {
    id: number;
    key: string;
    value: number;
    label: string;
    category: string;
}

export function AdminCalculatorForm() {
    const [settings, setSettings] = useState<CalculatorSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data, error } = await supabase
            .from('calculator_settings')
            .select('*')
            .order('category', { ascending: true })
            .order('id', { ascending: true });

        if (data) setSettings(data);
        if (error) console.error("Error fetching settings:", error);
        setLoading(false);
    };

    const handleChange = (id: number, newValue: string) => {
        setSettings(prev => prev.map(s =>
            s.id === id ? { ...s, value: parseFloat(newValue) || 0 } : s
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update each setting one by one
            const updates = settings.map(setting =>
                supabase
                    .from('calculator_settings')
                    .update({ value: setting.value })
                    .eq('id', setting.id)
            );

            await Promise.all(updates);
            alert('Настройки успешно сохранены!');
        } catch (error) {
            console.error(error);
            alert('Ошибка при сохранении');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-white">
            <Loader2 className="animate-spin h-8 w-8 text-brand-silver" />
        </div>
    );

    const groupedSettings = settings.reduce((acc, output) => {
        const category = output.category || 'other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(output);
        return acc;
    }, {} as Record<string, CalculatorSetting[]>);

    return (
        <div className="space-y-8 bg-brand-gray/20 p-8 border border-white/5 backdrop-blur-sm max-w-2xl mx-auto rounded-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-heading font-bold text-white uppercase">Настройки Калькулятора</h2>
                    <p className="text-brand-silver text-sm">Управление базовыми ставками и коэффициентами.</p>
                </div>
                <Link href="/" className="text-brand-silver hover:text-white transition-colors">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
            </div>

            {Object.entries(groupedSettings).map(([category, items]) => (
                <div key={category} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xs font-bold text-brand-accent uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
                        {category === 'material' ? 'Множители Материалов' :
                            category === 'weld_type' ? 'Базовые ставки (₽/метр)' : category}
                    </h3>
                    <div className="grid gap-4 bg-black/20 p-4 rounded-md border border-white/5">
                        {items.map((setting) => (
                            <div key={setting.id} className="grid grid-cols-2 items-center gap-4">
                                <label className="text-brand-silver text-sm font-medium">{setting.label}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step={category === 'material' ? "0.1" : "10"}
                                        value={setting.value}
                                        onChange={(e) => handleChange(setting.id, e.target.value)}
                                        className="w-full bg-brand-black border border-white/10 px-4 py-3 text-white focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all text-right font-mono"
                                    />
                                    {category === 'weld_type' && (
                                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-brand-silver/30 text-xs pointer-events-none">₽</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="pt-4">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-white text-black hover:bg-brand-silver font-bold uppercase tracking-widest h-14 rounded-none transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                    {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                    {saving ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
            </div>
        </div>
    );
}

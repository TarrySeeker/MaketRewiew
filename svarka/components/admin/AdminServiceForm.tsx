"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";
import { Save, Plus, Trash2, Edit2, X, Loader2, Image as ImageIcon } from "lucide-react";

interface Service {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
    category: string;
    features: string[];
}

export function AdminServiceForm() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<Service>>({});

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('id', { ascending: true });

        if (data) setServices(data);
        if (error) console.error("Error fetching services:", error);
        setLoading(false);
    };

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setFormData(service);
    };

    const handleCreate = () => {
        setEditingId(-1); // -1 marks new item
        setFormData({
            title: "",
            description: "",
            price: "",
            image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1",
            category: "Сварка",
            features: []
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({});
    };

    const handleSave = async () => {
        if (!formData.title) return;

        try {
            if (editingId === -1) {
                // Create
                const { error } = await supabase.from('services').insert([formData]);
                if (error) throw error;
            } else {
                // Update
                const { error } = await supabase.from('services').update(formData).eq('id', editingId);
                if (error) throw error;
            }
            await fetchServices();
            handleCancel();
        } catch (error) {
            alert("Ошибка при сохранении");
            console.error(error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Вы уверены, что хотите удалить эту услугу?")) return;
        try {
            await supabase.from('services').delete().eq('id', id);
            await fetchServices();
        } catch (error) {
            alert("Ошибка при удалении");
        }
    };

    if (loading) return <div className="text-white">Загрузка...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-heading font-bold text-white uppercase">Услуги</h3>
                <Button onClick={handleCreate} size="sm" className="bg-white text-black hover:bg-brand-silver">
                    <Plus className="mr-2 h-4 w-4" /> Добавить
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {editingId !== null && (
                    <div className="bg-brand-black p-6 border border-brand-accent rounded-lg mb-6 animate-in fade-in zoom-in">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-white font-bold uppercase">{editingId === -1 ? 'Новая услуга' : 'Редактирование'}</h4>
                            <button onClick={handleCancel}><X className="text-brand-silver hover:text-white" /></button>
                        </div>
                        <div className="space-y-4">
                            <input
                                className="w-full bg-black/50 border border-white/20 p-3 text-white"
                                placeholder="Название услуги"
                                value={formData.title || ""}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                            <textarea
                                className="w-full bg-black/50 border border-white/20 p-3 text-white h-24"
                                placeholder="Описание"
                                value={formData.description || ""}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    className="w-full bg-black/50 border border-white/20 p-3 text-white"
                                    placeholder="Цена (например 'от 500 ₽')"
                                    value={formData.price || ""}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                                <input
                                    className="w-full bg-black/50 border border-white/20 p-3 text-white"
                                    placeholder="Категория"
                                    value={formData.category || ""}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        className="w-full bg-black/50 border border-white/20 p-3 text-white"
                                        placeholder="URL картинки"
                                        value={formData.image || ""}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                                {formData.image && (
                                    <div className="w-12 h-12 rounded overflow-hidden">
                                        <img src={formData.image} className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <Button onClick={handleSave} className="w-full bg-brand-accent text-black hover:bg-white font-bold uppercase">
                                <Save className="mr-2 h-4 w-4" /> Сохранить
                            </Button>
                        </div>
                    </div>
                )}

                {services.map(service => (
                    <div key={service.id} className="flex items-center justify-between bg-white/5 p-4 border border-white/5 rounded hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black rounded overflow-hidden">
                                <img src={service.image} alt="" className="w-full h-full object-cover grayscale" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{service.title}</h4>
                                <p className="text-xs text-brand-silver">{service.category} | {service.price}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(service)}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(service.id)} className="text-red-500 hover:text-red-400">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

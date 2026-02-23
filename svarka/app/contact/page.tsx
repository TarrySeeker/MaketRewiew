"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ContactPage() {
    const [contactInfo, setContactInfo] = useState({
        phone: "+7 (343) 123-45-67",
        email: "info@ironforge.ru",
        address: "Екатеринбург, ул. Промышленная, 10",
        schedule: "Пн-Пт: 9:00 - 18:00"
    });

    useEffect(() => {
        async function fetchContent() {
            const { data } = await supabase.from('cms_content').select('*').eq('key', 'contact_info').single();
            if (data && data.content) {
                setContactInfo(prev => ({ ...prev, ...data.content }));
            }
        }
        fetchContent();
    }, []);
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-32 pb-12 container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-heading font-black text-foreground uppercase mb-12 text-center">
                    Наши <span className="text-industry-accent">Контакты</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Напишите нам</CardTitle>
                            <CardDescription>Заполните форму, и мы свяжемся с вами в ближайшее время.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Имя</label>
                                        <input type="text" className="w-full bg-industry-900 border border-industry-600 rounded p-2" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Фамилия</label>
                                        <input type="text" className="w-full bg-industry-900 border border-industry-600 rounded p-2" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input type="email" className="w-full bg-industry-900 border border-industry-600 rounded p-2" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Интересующая услуга</label>
                                    <select className="w-full bg-industry-900 border border-industry-600 rounded p-2 text-industry-500">
                                        <option>Общий вопрос</option>
                                        <option>Сварка труб</option>
                                        <option>Металлоконструкции</option>
                                        <option>Изделия на заказ</option>
                                        <option>Мобильный ремонт</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Сообщение</label>
                                    <textarea rows={4} className="w-full bg-industry-900 border border-industry-600 rounded p-2"></textarea>
                                </div>
                                <Button className="w-full bg-industry-accent text-industry-900 hover:bg-industry-accent/90">Отправить</Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-industry-800/50">
                                <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                                    <div className="p-3 bg-industry-900 rounded-full text-industry-accent">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold">Телефон</h3>
                                    <p className="text-sm text-industry-500">{contactInfo.phone}</p>
                                    <p className="text-xs text-industry-600">В рабочее время</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-industry-800/50">
                                <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                                    <div className="p-3 bg-industry-900 rounded-full text-industry-accent">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold">Email</h3>
                                    <p className="text-sm text-industry-500">{contactInfo.email}</p>
                                    <p className="text-xs text-industry-600">Ответ в течение 24ч</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-industry-800/50">
                                <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                                    <div className="p-3 bg-industry-900 rounded-full text-industry-accent">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold">Адрес</h3>
                                    <p className="text-sm text-industry-500">{contactInfo.address}</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-industry-800/50">
                                <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                                    <div className="p-3 bg-industry-900 rounded-full text-industry-accent">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold">Режим работы</h3>
                                    <p className="text-sm text-industry-500">{contactInfo.schedule}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-industry-900 rounded-lg aspect-video w-full flex items-center justify-center border border-industry-700 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-50 group-hover:grayscale-0 transition-all duration-700"></div>
                            <div className="relative z-10 bg-industry-900/80 backdrop-blur px-6 py-3 rounded-full border border-industry-accent/30 text-industry-accent font-bold flex items-center">
                                <MapPin className="mr-2 h-5 w-5" /> Открыть Яндекс.Карты
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

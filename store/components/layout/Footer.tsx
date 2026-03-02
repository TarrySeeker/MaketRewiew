"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

export function Footer() {
    const [contactInfo, setContactInfo] = useState({
        phone: "+7 (495) 123-45-67",
        email: "hello@nuw.store",
        address: "Москва, Столешников переулок, 10",
        schedule: "Ежедневно: 10:00 - 22:00",
        brandName: "NUW",
        footerDescription: "Premium streetwear and contemporary fashion. Мультибрендовый магазин одежды с тщательно отобранным ассортиментом.",
        socials: {
            instagram: "#",
            whatsapp: "#",
            telegram: "#"
        }
    });

    useEffect(() => {
        async function fetchContent() {
            try {
                const { data } = await supabase.from('cms_content').select('*').eq('key', 'contact_info').single();
                if (data && data.content) {
                    setContactInfo(prev => ({
                        ...prev,
                        ...data.content,
                        socials: { ...prev.socials, ...(data.content.socials || {}) }
                    }));
                }
            } catch (e) {
                // Фолбэк на дефолт
            }
        }
        fetchContent();
    }, []);

    return (
        <footer className="bg-brand-dark border-t border-brand-gray mt-auto pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                    {/* Brand Branding - Large */}
                    <div className="md:col-span-4 space-y-8">
                        <Link href="/" className="inline-block">
                            <span className="font-heading font-black text-4xl tracking-tighter text-foreground">
                                {contactInfo.brandName}
                            </span>
                        </Link>
                        <p className="text-brand-silver text-lg leading-relaxed max-w-md font-light">
                            {contactInfo.footerDescription}
                        </p>

                        <div className="flex space-x-4 pt-4">
                            {contactInfo.socials.instagram && (
                                <Link href={contactInfo.socials.instagram} target="_blank">
                                    <Button variant="outline" size="icon" className="rounded-full border-brand-gray hover:bg-foreground hover:text-background hover:border-foreground transition-all">
                                        <Instagram className="h-5 w-5" />
                                    </Button>
                                </Link>
                            )}
                            {contactInfo.socials.whatsapp && (
                                <Link href={contactInfo.socials.whatsapp} target="_blank">
                                    <Button variant="outline" size="icon" className="rounded-full border-brand-gray hover:bg-foreground hover:text-background hover:border-foreground transition-all">
                                        <Phone className="h-5 w-5" />
                                    </Button>
                                </Link>
                            )}
                            {contactInfo.socials.telegram && (
                                <Link href={contactInfo.socials.telegram} target="_blank">
                                    <Button variant="outline" size="icon" className="rounded-full border-brand-gray hover:bg-foreground hover:text-background hover:border-foreground transition-all">
                                        <Mail className="h-5 w-5" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="md:col-span-2 md:col-start-7">
                        <h3 className="font-heading font-bold text-foreground mb-8 uppercase tracking-widest text-sm">Покупателям</h3>
                        <ul className="space-y-4">
                            {['Каталог', 'О бренде', 'Доставка и оплата'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item === 'Каталог' ? 'catalog' : item === 'О бренде' ? 'about' : '#'}`} className="text-brand-silver hover:text-foreground transition-colors text-sm uppercase tracking-wide">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Navigation Links 2 */}
                    <div className="md:col-span-2">
                        <h3 className="font-heading font-bold text-foreground mb-8 uppercase tracking-widest text-sm">Помощь</h3>
                        <ul className="space-y-4">
                            {['Личный кабинет', 'Возврат', 'FAQ'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item === 'Личный кабинет' ? 'auth' : '#'}`} className="text-brand-silver hover:text-foreground transition-colors text-sm uppercase tracking-wide">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-2">
                        <h3 className="font-heading font-bold text-foreground mb-8 uppercase tracking-widest text-sm">Контакты</h3>
                        <ul className="space-y-6">
                            <li className="space-y-1">
                                <span className="text-xs text-brand-silver uppercase block">Адрес</span>
                                <span className="text-foreground text-sm">{contactInfo.address}</span>
                            </li>
                            <li className="space-y-1">
                                <span className="text-xs text-brand-silver uppercase block">Телефон</span>
                                <span className="text-foreground text-sm">{contactInfo.phone}</span>
                            </li>
                            <li className="space-y-1">
                                <span className="text-xs text-brand-silver uppercase block">Режим работы</span>
                                <span className="text-foreground text-sm">{contactInfo.schedule}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter / Bottom */}
                <div className="border-t border-brand-gray pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-brand-silver/80 uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} NUW Apparel. Все права защищены.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="text-xs text-brand-silver/80 hover:text-foreground uppercase tracking-widest transition-colors">Политика конфиденциальности</Link>
                        <Link href="/terms" className="text-xs text-brand-silver/80 hover:text-foreground uppercase tracking-widest transition-colors">Публичная оферта</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

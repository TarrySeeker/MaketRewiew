"use client";

import Link from "next/link";
import { Hammer, MapPin, Phone, Mail, Facebook, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

export function Footer() {
    const [contactInfo, setContactInfo] = useState({
        phone: "+7 (343) 123-45-67",
        email: "info@ironforge.ru",
        address: "Екатеринбург, ул. Промышленная, 10",
        schedule: "Пн-Пт: 9:00 - 18:00",
        brandName: "IRONFORGE",
        footerDescription: "Искусство работы с металлом. Премиальные сварочные решения для тех, кто ценит качество, точность и эстетику.",
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
        <footer className="bg-brand-black border-t border-white/10 mt-auto pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                    {/* Brand Branding - Large */}
                    <div className="md:col-span-5 space-y-8">
                        <Link href="/" className="inline-block">
                            <span className="font-heading font-black text-4xl tracking-tighter text-white">
                                {contactInfo.brandName.includes('IRON') ? (
                                    <>
                                        IRON<span className="font-light text-brand-silver">{contactInfo.brandName.replace('IRON', '')}</span>
                                    </>
                                ) : contactInfo.brandName}
                            </span>
                        </Link>
                        <p className="text-brand-silver text-lg leading-relaxed max-w-md font-light">
                            {contactInfo.footerDescription}
                        </p>

                        <div className="flex space-x-4 pt-4">
                            {contactInfo.socials.instagram && (
                                <Link href={contactInfo.socials.instagram} target="_blank">
                                    <Button variant="outline" size="icon" className="rounded-full border-white/20 hover:bg-white hover:text-black hover:border-white transition-all">
                                        <Instagram className="h-5 w-5" />
                                    </Button>
                                </Link>
                            )}
                            {contactInfo.socials.whatsapp && (
                                <Link href={contactInfo.socials.whatsapp} target="_blank">
                                    <Button variant="outline" size="icon" className="rounded-full border-white/20 hover:bg-white hover:text-black hover:border-white transition-all">
                                        <Phone className="h-5 w-5" />
                                    </Button>
                                </Link>
                            )}
                            {contactInfo.socials.telegram && (
                                <Link href={contactInfo.socials.telegram} target="_blank">
                                    <Button variant="outline" size="icon" className="rounded-full border-white/20 hover:bg-white hover:text-black hover:border-white transition-all">
                                        <Mail className="h-5 w-5" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="md:col-span-2 md:col-start-7">
                        <h3 className="font-heading font-bold text-white mb-8 uppercase tracking-widest text-sm">Покупателям</h3>
                        <ul className="space-y-4">
                            {['Каталог', 'О компании', 'Доставка и оплата'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item === 'Каталог' ? 'catalog' : item === 'О компании' ? 'about' : '#'}`} className="text-brand-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wide">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-2">
                        <h3 className="font-heading font-bold text-white mb-8 uppercase tracking-widest text-sm">Контакты</h3>
                        <ul className="space-y-6">
                            <li className="space-y-1">
                                <span className="text-xs text-brand-silver uppercase block">Адрес</span>
                                <span className="text-white text-sm">{contactInfo.address}</span>
                            </li>
                            <li className="space-y-1">
                                <span className="text-xs text-brand-silver uppercase block">Телефон</span>
                                <span className="text-white text-sm">{contactInfo.phone}</span>
                            </li>
                            <li className="space-y-1">
                                <span className="text-xs text-brand-silver uppercase block">Email</span>
                                <span className="text-white text-sm">{contactInfo.email}</span>
                            </li>
                            <li className="space-y-1">
                                <span className="text-xs text-brand-silver uppercase block">Режим работы</span>
                                <span className="text-white text-sm">{contactInfo.schedule}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter / Bottom */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-brand-silver/50 uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} IronForge Welding.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="text-xs text-brand-silver/50 hover:text-white uppercase tracking-widest transition-colors">Политика конфиденциальности</Link>
                        <Link href="/terms" className="text-xs text-brand-silver/50 hover:text-white uppercase tracking-widest transition-colors">Публичная оферта</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ShieldCheck, UserCheck, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AboutPage() {
    const [aboutContent, setAboutContent] = useState({
        title: "О Нашем Магазине",
        description: "Мы — современный интернет-магазин с широким ассортиментом качественных товаров. Наша миссия — предоставить покупателям лучший сервис, быструю доставку и гарантию качества на каждый товар.",
        stats: {
            years: "15+",
            projects: "500+",
            support: "24/7",
            warranty: "100%"
        }
    });

    useEffect(() => {
        const fetchAbout = async () => {
            const { data } = await supabase
                .from('cms_content')
                .select('content')
                .eq('key', 'about_page')
                .single();

            if (data?.content) {
                setAboutContent(prev => ({ ...prev, ...data.content }));
            }
        };
        fetchAbout();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-32 pb-12 container mx-auto px-4">

                {/* Intro */}
                <section className="text-center mb-16 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-sans font-black mb-6 uppercase">
                        {aboutContent.title}
                    </h1>
                    <p className="text-xl text-brand-silver mb-8 leading-relaxed">
                        {aboutContent.description}
                    </p>
                </section>

                {/* Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
                    <div className="bg-brand-dark p-6 rounded text-center border-t-4 border-foreground">
                        <div className="text-4xl font-bold text-foreground mb-2">{aboutContent.stats.years}</div>
                        <div className="text-sm text-brand-silver uppercase tracking-widest">Лет опыта</div>
                    </div>
                    <div className="bg-brand-dark p-6 rounded text-center border-t-4 border-foreground">
                        <div className="text-4xl font-bold text-foreground mb-2">{aboutContent.stats.projects}</div>
                        <div className="text-sm text-brand-silver uppercase tracking-widest">Проектов</div>
                    </div>
                    <div className="bg-brand-dark p-6 rounded text-center border-t-4 border-foreground">
                        <div className="text-4xl font-bold text-foreground mb-2">{aboutContent.stats.support}</div>
                        <div className="text-sm text-brand-silver uppercase tracking-widest">Поддержка</div>
                    </div>
                    <div className="bg-brand-dark p-6 rounded text-center border-t-4 border-foreground">
                        <div className="text-4xl font-bold text-foreground mb-2">{aboutContent.stats.warranty}</div>
                        <div className="text-sm text-brand-silver uppercase tracking-widest">Гарантия</div>
                    </div>
                </section>

                {/* Team/Certificates */}
                <section className="mb-24">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="h-px flex-1 bg-brand-gray"></div>
                        <h2 className="text-3xl font-sans font-bold uppercase">Наши Гарантии</h2>
                        <div className="h-px flex-1 bg-brand-gray"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-brand-dark border border-brand-gray p-8 rounded-lg flex flex-col items-center text-center">
                            <ShieldCheck className="h-16 w-16 text-foreground mb-4" />
                            <h3 className="text-xl font-bold mb-2">Оригинальность</h3>
                            <p className="text-brand-silver">Мы гарантируем подлинность каждого товара от официальных поставщиков.</p>
                        </div>
                        <div className="bg-brand-dark border border-brand-gray p-8 rounded-lg flex flex-col items-center text-center">
                            <Award className="h-16 w-16 text-foreground mb-4" />
                            <h3 className="text-xl font-bold mb-2">Качество</h3>
                            <p className="text-brand-silver">Тщательный контроль качества на каждом этапе — от закупки до доставки.</p>
                        </div>
                        <div className="bg-brand-dark border border-brand-gray p-8 rounded-lg flex flex-col items-center text-center">
                            <UserCheck className="h-16 w-16 text-foreground mb-4" />
                            <h3 className="text-xl font-bold mb-2">Поддержка</h3>
                            <p className="text-brand-silver">Персональная консультация и помощь с подбором размера и стиля.</p>
                        </div>
                    </div>
                </section>

                <div className="text-center">
                    <Link href="/contact"><Button size="lg">Связаться с нами</Button></Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}

"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ShieldCheck, UserCheck, Award, Clock } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-32 pb-12 container mx-auto px-4">

                {/* Intro */}
                <section className="text-center mb-16 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-sans font-black mb-6 uppercase">
                        О Нашем Магазине
                    </h1>
                    <p className="text-xl text-brand-silver mb-8 leading-relaxed">
                        Мы — современный интернет-магазин уличной одежды и обуви премиум-класса. 
                        Более 15 лет помогаем людям одеваться стильно — с доставкой по всей России 
                        и гарантией подлинности каждого товара.
                    </p>
                </section>

                {/* Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
                    <div className="bg-brand-dark p-6 rounded text-center border-t-4 border-foreground">
                        <div className="text-4xl font-bold text-foreground mb-2">15+</div>
                        <div className="text-sm text-brand-silver uppercase tracking-widest">лет на рынке</div>
                    </div>
                    <div className="bg-brand-dark p-6 rounded text-center border-t-4 border-foreground">
                        <div className="text-4xl font-bold text-foreground mb-2">30</div>
                        <div className="text-sm text-brand-silver uppercase tracking-widest">дней гарантия</div>
                    </div>
                    <div className="bg-brand-dark p-6 rounded text-center border-t-4 border-foreground">
                        <div className="text-4xl font-bold text-foreground mb-2">20 000+</div>
                        <div className="text-sm text-brand-silver uppercase tracking-widest">довольных клиентов</div>
                    </div>
                    <div className="bg-brand-dark p-6 rounded text-center border-t-4 border-foreground">
                        <div className="text-4xl font-bold text-foreground mb-2">24/7</div>
                        <div className="text-sm text-brand-silver uppercase tracking-widest">поддержка</div>
                    </div>
                </section>

                {/* Guarantees */}
                <section className="mb-24">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="h-px flex-1 bg-brand-gray"></div>
                        <h2 className="text-3xl font-sans font-bold uppercase">Наши Гарантии</h2>
                        <div className="h-px flex-1 bg-brand-gray"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="bg-brand-dark border border-brand-gray p-8 rounded-lg flex flex-col items-center text-center">
                            <ShieldCheck className="h-16 w-16 text-foreground mb-4" />
                            <h3 className="text-xl font-bold mb-2">Оригинальность</h3>
                            <p className="text-brand-silver">Только подлинные товары от официальных поставщиков.</p>
                        </div>
                        <div className="bg-brand-dark border border-brand-gray p-8 rounded-lg flex flex-col items-center text-center">
                            <Award className="h-16 w-16 text-foreground mb-4" />
                            <h3 className="text-xl font-bold mb-2">Качество</h3>
                            <p className="text-brand-silver">Тщательный контроль на каждом этапе — от закупки до доставки.</p>
                        </div>
                        <div className="bg-brand-dark border border-brand-gray p-8 rounded-lg flex flex-col items-center text-center">
                            <UserCheck className="h-16 w-16 text-foreground mb-4" />
                            <h3 className="text-xl font-bold mb-2">Поддержка</h3>
                            <p className="text-brand-silver">Персональная консультация и помощь с подбором размера и стиля.</p>
                        </div>
                        <div className="bg-brand-dark border border-brand-gray p-8 rounded-lg flex flex-col items-center text-center">
                            <Clock className="h-16 w-16 text-foreground mb-4" />
                            <h3 className="text-xl font-bold mb-2">Возврат 30 дней</h3>
                            <p className="text-brand-silver">Не подошло — вернём деньги в течение 30 дней без лишних вопросов.</p>
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

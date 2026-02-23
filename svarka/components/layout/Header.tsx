"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Hammer, ShoppingCart, Menu, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/lib/store";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [brandName, setBrandName] = useState("IRONFORGE");
    const pathname = usePathname();
    const { items } = useCart();
    const cartItemsCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

    useEffect(() => {
        const fetchBrand = async () => {
            const { data } = await supabase
                .from('cms_content')
                .select('content')
                .eq('key', 'contact_info')
                .single();

            if (data?.content?.brandName) {
                setBrandName(data.content.brandName);
            }
        };
        fetchBrand();

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Каталог товаров", href: "/catalog" },
        { name: "О компании", href: "/about" },
        { name: "Контакты", href: "/contact" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300 border-b",
                scrolled
                    ? "bg-brand-black/80 backdrop-blur-md border-white/5 py-4"
                    : "bg-transparent border-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group z-50">
                    <div className="flex flex-col">
                        <span className="font-heading font-extrabold text-2xl tracking-tighter text-white group-hover:opacity-80 transition-opacity">
                            {brandName.includes('IRON') ? (
                                <>
                                    IRON<span className="font-light text-brand-silver">{brandName.replace('IRON', '')}</span>
                                </>
                            ) : brandName}
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-12">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-all hover:text-white uppercase tracking-widest relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-white after:transition-all hover:after:w-full",
                                pathname === item.href ? "text-white after:w-full" : "text-brand-silver"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative group text-brand-silver hover:text-white">
                            <ShoppingCart className="h-5 w-5" />
                            {cartItemsCount > 0 ? (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-accent text-brand-black text-[10px] font-bold flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            ) : (
                                <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                        </Button>
                    </Link>
                    <Link href="/booking">
                        <Button size="sm" className="bg-white text-black hover:bg-brand-silver font-bold uppercase tracking-wider rounded-none px-6">
                            Заказать
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-white z-50"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            <div className={cn(
                "fixed inset-0 bg-brand-black z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden",
                isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <div className="flex flex-col space-y-8 text-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-3xl font-heading font-bold text-brand-silver hover:text-white transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="mt-8 relative inline-flex items-center justify-center gap-2 text-xl text-white">
                        <ShoppingCart className="h-6 w-6" />
                        <span>Корзина</span>
                        {cartItemsCount > 0 && (
                            <span className="ml-2 bg-brand-accent text-brand-black text-sm font-bold px-2 py-0.5 rounded-full">
                                {cartItemsCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}

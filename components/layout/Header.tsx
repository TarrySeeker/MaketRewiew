"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Menu, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/lib/store";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [brandName, setBrandName] = useState("NUW");
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
        { name: "О бренде", href: "/about" },
        { name: "Контакты", href: "/contact" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300 border-b",
                scrolled
                    ? "bg-background/80 backdrop-blur-md border-brand-gray py-4"
                    : "bg-black/20 backdrop-blur-sm border-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group z-50">
                    <div className="flex flex-col">
                        <span className="font-heading font-extrabold text-3xl tracking-tighter text-foreground group-hover:opacity-80 transition-opacity">
                            {brandName}
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
                                "text-sm font-medium transition-all hover:text-foreground uppercase tracking-widest relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-foreground after:transition-all hover:after:w-full",
                                pathname === item.href ? "text-foreground after:w-full" : "text-brand-silver"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative group text-brand-silver hover:text-foreground">
                            <ShoppingCart className="h-5 w-5" />
                            {cartItemsCount > 0 ? (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            ) : (
                                <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                        </Button>
                    </Link>
                    <Link href="/auth">
                        <Button variant="ghost" size="icon" className="text-brand-silver hover:text-foreground group">
                            <User className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-foreground z-50"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            <div className={cn(
                "fixed inset-0 bg-background z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden",
                isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <div className="flex flex-col space-y-8 text-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-3xl font-heading font-bold text-brand-silver hover:text-foreground transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="mt-8 relative inline-flex items-center justify-center gap-2 text-xl text-foreground">
                        <ShoppingCart className="h-6 w-6" />
                        <span>Корзина</span>
                        {cartItemsCount > 0 && (
                            <span className="ml-2 bg-foreground text-background text-sm font-bold px-2 py-0.5 rounded-full">
                                {cartItemsCount}
                            </span>
                        )}
                    </Link>
                    <Link href="/auth" onClick={() => setIsMenuOpen(false)} className="relative inline-flex items-center justify-center gap-2 text-xl text-foreground">
                        <User className="h-6 w-6" />
                        <span>Профиль</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}

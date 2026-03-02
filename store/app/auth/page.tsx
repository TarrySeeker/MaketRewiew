"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { LogOut, Package, Star } from "lucide-react";

export default function AuthPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Auth Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    const [points, setPoints] = useState(0);
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currUser = session?.user || null;
            setUser(currUser);

            if (currUser) {
                // Fetch profile data
                const [{ data: profile }, { count: ordersCount }] = await Promise.all([
                    supabase.from('users_profiles').select('loyalty_points').eq('id', currUser.id).single(),
                    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('user_id', currUser.id)
                ]);

                if (profile) setPoints(profile.loyalty_points || 0);
                if (ordersCount) setOrderCount(ordersCount || 0);
            }

            setLoading(false);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            if (session?.user) checkUser();
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin,
                    }
                });
                if (error) throw error;
                setMessage({ text: "Регистрация успешна! Проверьте email для подтверждения (если требуется).", type: 'success' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.refresh();
            }
        } catch (error: any) {
            setMessage({ text: error.message || "Произошла ошибка при авторизации", type: 'error' });
        } finally {
            setAuthLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse w-8 h-8 rounded-full bg-foreground"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
            <Header />

            <main className="flex-1 pt-32 pb-24 flex items-center justify-center">
                <div className="container mx-auto px-4 max-w-md">
                    {user ? (
                        <div className="bg-brand-dark border border-brand-gray p-8 space-y-8">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background border border-brand-gray mb-4">
                                    <span className="text-2xl font-sans">{user.email?.charAt(0).toUpperCase()}</span>
                                </div>
                                <h1 className="text-2xl font-sans font-bold uppercase mb-2">Личный Кабинет</h1>
                                <p className="text-brand-silver text-sm font-light">{user.email}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-brand-gray p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-background transition-colors">
                                    <div className="relative mb-2">
                                        <Package className="h-6 w-6 text-brand-silver" />
                                        {orderCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                {orderCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-center">Мои Заказы</span>
                                </div>
                                <div className="border border-brand-gray p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-background transition-colors">
                                    <Star className="h-6 w-6 mb-2 text-brand-silver" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-center">Избранное</span>
                                </div>
                            </div>

                            <div className="bg-background border border-brand-gray p-4 text-center">
                                <span className="block text-xs font-light text-brand-silver mb-1">Ваши баллы лояльности</span>
                                <span className="text-3xl font-sans font-bold">{points}</span>
                            </div>

                            <Button
                                onClick={handleSignOut}
                                variant="outline"
                                className="w-full rounded-none uppercase tracking-widest font-bold h-12"
                            >
                                <LogOut className="h-4 w-4 mr-2" /> Выйти
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-brand-dark border border-brand-gray p-8">
                            <h1 className="text-3xl font-sans font-bold uppercase mb-8 text-center">
                                {isSignUp ? "Регистрация" : "Вход"}
                            </h1>

                            {message && (
                                <div className={`p-4 mb-6 border text-sm text-center ${message.type === 'error' ? 'border-red-500/50 bg-red-500/10 text-red-700' : 'border-green-500/50 bg-green-500/10 text-green-700'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleAuth} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-brand-silver">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-background border border-brand-gray text-foreground placeholder-brand-silver/50 p-4 focus:outline-none focus:border-foreground transition-colors"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-brand-silver">Пароль</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-background border border-brand-gray text-foreground placeholder-brand-silver/50 p-4 focus:outline-none focus:border-foreground transition-colors"
                                        placeholder="••••••••"
                                        minLength={6}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={authLoading}
                                    className="w-full h-14 rounded-none uppercase tracking-widest font-bold"
                                >
                                    {authLoading ? "Загрузка..." : (isSignUp ? "Создать аккаунт" : "Войти")}
                                </Button>
                            </form>

                            <div className="mt-8 text-center pt-6 border-t border-brand-gray">
                                <button
                                    onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
                                    className="text-sm font-light text-brand-silver hover:text-foreground transition-colors"
                                >
                                    {isSignUp ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

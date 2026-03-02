"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, MessageSquare, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

export default function DashboardPage() {
    const [stats, setStats] = useState([
        { title: "Всего заказов", value: 0, icon: ShoppingCart, color: "text-blue-500" },
        { title: "Товары", value: 0, icon: Package, color: "text-green-500" },
        { title: "Новые заявки", value: 0, icon: MessageSquare, color: "text-purple-500" },
    ]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            const tables = ["orders", "products", "applications"];
            const results = await Promise.allSettled(
                tables.map(t => adminApi({ action: "count", table: t }))
            );

            setStats(prev => prev.map((stat, idx) => {
                const result = results[idx];
                if (result.status === "fulfilled" && !result.value.error) {
                    return { ...stat, value: result.value.count || 0 };
                }
                return stat;
            }));
            setIsLoading(false);
        }
        loadStats();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Дашборд</h1>
                <p className="text-muted-foreground mt-2">
                    Сводная информация по вашему проекту
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            ) : (
                                <div className="text-2xl font-bold">{stat.value}</div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Последние действия</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Здесь будет лог последних событий...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

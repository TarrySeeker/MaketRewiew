"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Database, AlertTriangle } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

interface TableStatus {
    name: string;
    label: string;
    ok: boolean | null;
}

export default function SetupPage() {
    const [tables, setTables] = useState<TableStatus[]>([
        { name: "products", label: "Товары", ok: null },
        { name: "orders", label: "Заказы", ok: null },
        { name: "applications", label: "Заявки", ok: null },
        { name: "cms_content", label: "CMS Контент", ok: null },
    ]);
    const [checking, setChecking] = useState(false);

    const checkTables = async () => {
        setChecking(true);
        const results = await Promise.allSettled(
            tables.map(t => adminApi({ action: "select", table: t.name, data: { limit: 1 } }))
        );

        setTables(prev => prev.map((t, idx) => {
            const result = results[idx];
            if (result.status === "fulfilled" && !result.value.error) {
                return { ...t, ok: true };
            }
            return { ...t, ok: false };
        }));
        setChecking(false);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Настройка базы данных</h1>
                <p className="text-muted-foreground mt-2">
                    Проверка таблиц Supabase для работы админ-панели
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" /> Статус таблиц
                    </CardTitle>
                    <CardDescription>Нажмите "Проверить" чтобы проверить наличие всех необходимых таблиц</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {tables.map(t => (
                            <div key={t.name} className={`p-4 rounded-lg border text-center ${t.ok === null ? 'border-zinc-200 dark:border-zinc-800' : t.ok ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950' : 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950'}`}>
                                <div className="text-sm font-mono text-muted-foreground">{t.name}</div>
                                <div className="font-semibold mt-1">{t.label}</div>
                                <div className="mt-2">
                                    {t.ok === null ? (
                                        <span className="text-xs text-muted-foreground">Не проверено</span>
                                    ) : t.ok ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 text-red-600 mx-auto" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button onClick={checkTables} disabled={checking}>
                        {checking ? "Проверка..." : "Проверить таблицы"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

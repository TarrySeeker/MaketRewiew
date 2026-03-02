"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Trash2, Loader2, ShieldAlert } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [deletePassword, setDeletePassword] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        const { data, error } = await adminApi({
            action: "select",
            table: "orders",
            data: { order: { column: "created_at", ascending: false } },
        });
        if (error) {
            toast.error("Ошибка при загрузке заказов: " + error);
        } else {
            setOrders(data || []);
        }
        setIsLoading(false);
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        const { error } = await adminApi({
            action: "update",
            table: "orders",
            id,
            data: { status: newStatus },
        });
        if (error) {
            toast.error("Ошибка обновления статуса: " + error);
        } else {
            toast.success("Статус обновлен");
            fetchOrders();
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget || !deletePassword) return;
        setIsDeleting(true);

        const { error: verifyError } = await adminApi({
            action: "verify_password",
            table: "_",
            password: deletePassword,
        });

        if (verifyError) {
            toast.error(verifyError);
            setIsDeleting(false);
            return;
        }

        const prev = [...orders];
        setOrders(o => o.filter(x => x.id !== deleteTarget));

        const { error } = await adminApi({
            action: "delete",
            table: "orders",
            id: deleteTarget,
        });

        if (error) {
            toast.error("Ошибка удаления: " + error);
            setOrders(prev);
        } else {
            toast.success("Заказ удалён");
        }

        setDeleteTarget(null);
        setDeletePassword("");
        setIsDeleting(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Новый</Badge>;
            case 'processing': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">В обработке</Badge>;
            case 'completed': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Выполнен</Badge>;
            case 'cancelled': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Отменен</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Заказы</h1>
                <p className="text-muted-foreground mt-2">Управление заказами из интернет-магазина</p>
            </div>

            {/* Password confirmation dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => {
                if (!open) { setDeleteTarget(null); setDeletePassword(""); }
            }}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <ShieldAlert className="h-5 w-5" /> Подтверждение удаления
                        </DialogTitle>
                        <DialogDescription>
                            Для удаления заказа введите пароль от вашего аккаунта администратора.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Пароль</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleDeleteConfirm(); }}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => { setDeleteTarget(null); setDeletePassword(""); }}>
                            Отмена
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={!deletePassword || isDeleting}
                        >
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Удалить заказ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="border rounded-md bg-white dark:bg-zinc-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Дата</TableHead>
                            <TableHead>Клиент</TableHead>
                            <TableHead>Комментарий</TableHead>
                            <TableHead>Сумма</TableHead>
                            <TableHead>Доставка</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Товары</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">Загрузка...</TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">Заказов пока нет</TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {format(new Date(order.created_at), "dd MMM yyyy HH:mm", { locale: ru })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{order.customer_info?.name || "Без имени"}</div>
                                        <div className="text-sm text-muted-foreground">{order.customer_info?.phone}</div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {order.customer_info?.comment || "—"}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {order.total?.toLocaleString('ru-RU') || 0} ₽
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium">{order.shipping_method || 'Не выбран'}</div>
                                        {Number(order.shipping_cost) > 0 && <div className="text-xs text-muted-foreground">+{Number(order.shipping_cost).toLocaleString('ru-RU')} ₽</div>}
                                        {order.delivery_detail && (
                                            <div className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                                                {order.delivery_detail.city}, {order.delivery_detail.address}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(order.status)}
                                            <Select defaultValue={order.status} onValueChange={(val) => handleStatusChange(order.id, val)}>
                                                <SelectTrigger className="w-[140px] h-8">
                                                    <SelectValue placeholder="Сменить" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="new">Новый</SelectItem>
                                                    <SelectItem value="processing">В обработке</SelectItem>
                                                    <SelectItem value="completed">Выполнен</SelectItem>
                                                    <SelectItem value="cancelled">Отменен</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {order.items?.map((item: any, idx: number) => (
                                                <div key={idx} className="text-sm">
                                                    {item.quantity}x {item.name}
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                            onClick={() => setDeleteTarget(order.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

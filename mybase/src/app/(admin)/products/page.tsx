"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, GripVertical, Star } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ImageUploader";
import { adminApi } from "@/lib/admin-api";

const POSITION_OPTIONS = [
    { value: "top", label: "Верх" },
    { value: "center", label: "Центр" },
    { value: "bottom", label: "Низ" },
] as const;

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [uploadImageUrls, setUploadImageUrls] = useState<string[]>([]);
    const [coverPosition, setCoverPosition] = useState<string>("center");
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        const { data, error } = await adminApi({
            action: "select",
            table: "products",
            data: { order: { column: "created_at", ascending: false } },
        });
        if (error) {
            toast.error("Ошибка при загрузке товаров: " + error);
        } else {
            setProducts(data || []);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Удалить этот товар?")) return;

        const previousProducts = [...products];
        setProducts(prev => prev.filter(p => p.id !== id));

        const { error } = await adminApi({
            action: "delete",
            table: "products",
            id,
        });

        if (error) {
            toast.error("Ошибка удаления: " + error);
            setProducts(previousProducts);
            return;
        }

        toast.success("Товар удален");
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const priceValue = formData.get('price') as string;
        const productData: Record<string, any> = {
            title: formData.get('title') as string,
            description: (formData.get('description') as string) || null,
            base_price: priceValue ? parseFloat(priceValue) : 0,
            category: (formData.get('category') as string) || null,
            is_active: formData.get('is_active') === 'on',
            base_images: uploadImageUrls,
            cover_position: coverPosition,
        };

        if (editingProduct) {
            const { error } = await adminApi({
                action: "update",
                table: "products",
                id: editingProduct.id,
                data: productData,
            });
            if (error) {
                toast.error("Ошибка обновления: " + error);
                return;
            }
            toast.success("Товар обновлен");
        } else {
            const { error } = await adminApi({
                action: "insert",
                table: "products",
                data: productData,
            });
            if (error) {
                toast.error("Ошибка добавления: " + error);
                return;
            }
            toast.success("Товар добавлен");
        }

        setIsDialogOpen(false);
        setEditingProduct(null);
        setUploadImageUrls([]);
        setCoverPosition("center");
        await fetchProducts();
    };

    const openEdit = (product: any) => {
        setEditingProduct(product);
        setUploadImageUrls(product.base_images || []);
        setCoverPosition(product.cover_position || "center");
        setIsDialogOpen(true);
    };

    const openAdd = () => {
        setEditingProduct(null);
        setUploadImageUrls([]);
        setCoverPosition("center");
        setIsDialogOpen(true);
    };

    const moveImage = (fromIdx: number, toIdx: number) => {
        setUploadImageUrls(prev => {
            const arr = [...prev];
            const [moved] = arr.splice(fromIdx, 1);
            arr.splice(toIdx, 0, moved);
            return arr;
        });
    };

    const setAsMain = (idx: number) => {
        if (idx === 0) return;
        moveImage(idx, 0);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Товары</h1>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingProduct(null);
                        setUploadImageUrls([]);
                        setCoverPosition("center");
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Добавить товар</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingProduct ? "Редактировать товар" : "Новый товар"}</DialogTitle>
                        </DialogHeader>
                        <form ref={formRef} onSubmit={handleSave} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Название</Label>
                                <Input id="title" name="title" key={editingProduct?.id || 'new'} defaultValue={editingProduct?.title || ''} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Категория</Label>
                                    <Input id="category" name="category" key={`cat-${editingProduct?.id || 'new'}`} defaultValue={editingProduct?.category || ''} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Цена (₽)</Label>
                                    <Input id="price" name="price" type="number" step="0.01" key={`price-${editingProduct?.id || 'new'}`} defaultValue={editingProduct?.base_price || ''} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Описание</Label>
                                <Textarea id="description" name="description" key={`desc-${editingProduct?.id || 'new'}`} defaultValue={editingProduct?.description || ''} rows={3} />
                            </div>

                            {/* Photos section */}
                            <div className="space-y-3">
                                <Label>Фотографии товара (до 5 штук)</Label>

                                {uploadImageUrls.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                            {uploadImageUrls.map((url, idx) => (
                                                <div key={`${url}-${idx}`} className={`relative group rounded-lg overflow-hidden border-2 transition-colors ${idx === 0 ? 'border-green-500 ring-2 ring-green-500/20' : 'border-zinc-200 dark:border-zinc-700'}`}>
                                                    <div className="aspect-[3/4] relative">
                                                        <img
                                                            src={url}
                                                            alt={`Фото ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                            style={{ objectPosition: idx === 0 ? coverPosition : "center" }}
                                                        />
                                                        {idx === 0 && (
                                                            <div className="absolute top-1 left-1 bg-green-500 text-white rounded px-1.5 py-0.5 text-[10px] font-bold uppercase">
                                                                Главное
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                                                        {idx !== 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setAsMain(idx)}
                                                                className="bg-green-500 hover:bg-green-600 text-white rounded px-2 py-1 text-[10px] font-medium flex items-center gap-1"
                                                            >
                                                                <Star className="w-3 h-3" /> Главное
                                                            </button>
                                                        )}
                                                        {idx > 0 && (
                                                            <button type="button" onClick={() => moveImage(idx, idx - 1)} className="bg-white/20 hover:bg-white/30 text-white rounded px-2 py-1 text-[10px]">
                                                                ← Левее
                                                            </button>
                                                        )}
                                                        {idx < uploadImageUrls.length - 1 && (
                                                            <button type="button" onClick={() => moveImage(idx, idx + 1)} className="bg-white/20 hover:bg-white/30 text-white rounded px-2 py-1 text-[10px]">
                                                                Правее →
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => setUploadImageUrls(prev => prev.filter((_, i) => i !== idx))}
                                                            className="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1 text-[10px] font-medium"
                                                        >
                                                            Удалить
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Cover position selector -- only when there is a main image */}
                                        <div className="space-y-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                Ракурс главного фото в каталоге
                                            </Label>
                                            <p className="text-xs text-muted-foreground mb-2">
                                                Выберите, какая часть фото будет видна в карточке каталога (обрезка 3:4)
                                            </p>
                                            <div className="flex gap-2">
                                                {POSITION_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setCoverPosition(opt.value)}
                                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium border transition-all ${coverPosition === opt.value
                                                            ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white'
                                                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-500'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {/* Live preview */}
                                            <div className="mt-2 flex items-center gap-3">
                                                <div className="text-xs text-muted-foreground shrink-0">Превью:</div>
                                                <div className="w-16 h-20 rounded border border-zinc-300 dark:border-zinc-600 overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                                                    <img
                                                        src={uploadImageUrls[0]}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        style={{ objectPosition: coverPosition }}
                                                    />
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Так фото будет выглядеть в каталоге магазина
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {uploadImageUrls.length < 5 && (
                                    <ImageUploader
                                        currentImage=""
                                        onUploadAction={(url) => {
                                            if (url) {
                                                setUploadImageUrls(prev => {
                                                    if (prev.includes(url)) return prev;
                                                    return [...prev].slice(0, 4).concat(url);
                                                });
                                            }
                                        }}
                                        bucketName="products"
                                        multiple
                                        maxFiles={5 - uploadImageUrls.length}
                                    />
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="is_active" name="is_active" key={`active-${editingProduct?.id || 'new'}`} defaultChecked={editingProduct ? editingProduct.is_active : true} className="rounded border-gray-300" />
                                <Label htmlFor="is_active">Активен (Отображать на сайте)</Label>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button type="submit">Сохранить</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">Фото</TableHead>
                            <TableHead>Название</TableHead>
                            <TableHead>Категория</TableHead>
                            <TableHead>Цена</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">Загрузка...</TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">Товары не найдены</TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="w-10 h-12 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                            {product.base_images?.[0] ? (
                                                <img
                                                    src={product.base_images[0]}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    style={{ objectPosition: product.cover_position || "center" }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">—</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.title}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.base_price ? product.base_price.toLocaleString('ru-RU') : '0'} ₽</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-800'}`}>
                                            {product.is_active ? "Активен" : "Скрыт"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(product.id)}>
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

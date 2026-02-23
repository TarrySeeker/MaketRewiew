"use client";

import * as React from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/store";
import { useRouter } from "next/navigation";

// Interface for Service
export interface Service {
    id: number | string;
    title: string;
    description: string;
    price: string;
    features: string[];
    category: string;
    image: string;
}

interface ServiceCardProps {
    service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
    const { addItem } = useCart();
    const router = useRouter();
    const [imageError, setImageError] = React.useState(false);

    const handleAddToCart = () => {
        // Parse price, create 0 if custom quote
        const priceNum = service.price.startsWith("от") || service.price.startsWith("$")
            ? parseFloat(service.price.replace(/[^0-9.]/g, ''))
            : 0;

        addItem({
            id: `${service.id}-${Date.now()}`,
            name: service.title,
            price: priceNum,
            type: "service",
            details: service.category
        });

        const confirm = window.confirm(`Услуга добавлена в корзину! Перейти к оформлению?`);
        if (confirm) {
            router.push("/cart");
        }
    };

    const fallbackImage = "https://placehold.co/600x400/1a1a1a/orange?text=No+Image";

    return (
        <Card className="flex flex-col h-full hover:border-industry-accent/50 transition-colors group">
            <div className="aspect-video relative overflow-hidden rounded-t-lg bg-industry-900">
                <img
                    src={imageError || !service.image ? fallbackImage : service.image}
                    alt={service.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    onError={() => setImageError(true)}
                />
                <div className="absolute top-2 right-2 bg-industry-900/80 backdrop-blur text-industry-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-industry-700">
                    {service.category}
                </div>
            </div>

            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-xl group-hover:text-industry-accent transition-colors">{service.title}</CardTitle>
                </div>
                <CardDescription>{service.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <div className="mb-4">
                    <span className="text-2xl font-bold text-foreground">{service.price}</span>
                </div>
                <ul className="space-y-2 text-sm text-industry-500">
                    {service.features && service.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-industry-500" /> {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="gap-2">
                <Link href={`/contact?service=${service.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">Уточнить</Button>
                </Link>
                <Button className="flex-1" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> В корзину
                </Button>
            </CardFooter>
        </Card>
    );
}

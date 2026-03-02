"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useEffect } from "react";

interface Service {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
    features: string[];
    category: string;
}

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
}

export function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!service) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-colors"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-background w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-brand-gray shadow-2xl pointer-events-auto flex flex-col md:flex-row relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-foreground hover:text-background transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Image Section */}
                            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                                <div className="absolute inset-0">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/40" />
                                </div>
                                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                                    <p className="text-white/80 text-sm uppercase tracking-widest mb-1 font-medium">{service.category}</p>
                                    <h2 className="text-3xl font-sans font-bold text-white leading-tight drop-shadow-md">{service.title}</h2>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col bg-background">
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h3 className="text-xl font-sans font-semibold text-foreground mb-2">Описание</h3>
                                        <p className="text-brand-silver leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-sans font-semibold text-foreground mb-3">Особенности</h3>
                                        <ul className="space-y-3">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start text-brand-silver">
                                                    <CheckCircle2 className="h-5 w-5 mr-3 text-foreground shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="pt-4 border-t border-brand-gray">
                                        <div className="flex items-end justify-between mb-4">
                                            <span className="text-brand-silver text-sm">Стоимость услуги</span>
                                            <span className="text-2xl font-sans font-bold text-foreground">{service.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <Link href="/contact" className="flex-1">
                                        <Button className="w-full h-12 bg-foreground text-background hover:bg-brand-silver font-bold uppercase tracking-wide rounded-none">
                                            Заказать
                                        </Button>
                                    </Link>
                                    <Link href="/catalog" className="flex-1">
                                        <Button variant="outline" className="w-full h-12 uppercase tracking-wide rounded-none">
                                            Каталог <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

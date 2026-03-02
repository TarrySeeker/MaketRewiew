"use client";

import React, { useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { UploadCloud, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
    onUploadAction: (url: string) => void;
    onMultiUploadAction?: (urls: string[]) => void;
    currentImage?: string;
    bucketName?: string;
    multiple?: boolean;
    maxFiles?: number;
}

export function ImageUploader({
    onUploadAction,
    onMultiUploadAction,
    currentImage = "",
    bucketName = "products",
    multiple = true,
    maxFiles = 5,
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            processFiles(files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            processFiles(files);
        }
    };

    const processFiles = (files: File[]) => {
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        if (imageFiles.length === 0) {
            toast.error("Выберите изображения (PNG, JPG, WEBP)");
            return;
        }

        const limited = imageFiles.slice(0, maxFiles);
        if (imageFiles.length > maxFiles) {
            toast.warning(`Можно загрузить не более ${maxFiles} файлов за раз. Первые ${maxFiles} будут загружены.`);
        }

        const oversized = limited.filter(f => f.size > 5 * 1024 * 1024);
        if (oversized.length > 0) {
            toast.error(`${oversized.length} файл(ов) больше 5MB и будут пропущены.`);
        }

        const valid = limited.filter(f => f.size <= 5 * 1024 * 1024);
        if (valid.length > 0) {
            uploadFiles(valid);
        }
    };

    const uploadSingleFile = async (file: File): Promise<string | null> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    };

    const uploadFiles = async (files: File[]) => {
        setIsUploading(true);
        setUploadProgress({ done: 0, total: files.length });
        const uploadedUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            try {
                const url = await uploadSingleFile(files[i]);
                if (url) {
                    uploadedUrls.push(url);
                    onUploadAction(url);
                }
            } catch (error: any) {
                console.error("Upload error:", error);
                if (error.message?.includes('Bucket not found') || error.message?.includes('not found')) {
                    toast.error("Хранилище '" + bucketName + "' не найдено. Выполните SQL-скрипт настройки в Supabase.");
                    break;
                } else if (error.message?.includes('security') || error.message?.includes('policy')) {
                    toast.error("Нет прав на загрузку. Выполните SQL-скрипт настройки из раздела 'Настройка БД'.");
                    break;
                } else {
                    toast.error(`Ошибка загрузки "${files[i].name}": ${error.message}`);
                }
            }
            setUploadProgress({ done: i + 1, total: files.length });
        }

        if (uploadedUrls.length > 0) {
            if (onMultiUploadAction) {
                onMultiUploadAction(uploadedUrls);
            }
            const word = uploadedUrls.length === 1 ? "фото загружено" : `${uploadedUrls.length} фото загружено`;
            toast.success(word);
        }

        setIsUploading(false);
        setUploadProgress({ done: 0, total: 0 });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-32 border-2 border-dashed rounded-md flex flex-col justify-center items-center cursor-pointer transition-colors ${isDragging
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                    }`}
            >
                {isUploading ? (
                    <div className="flex flex-col items-center text-zinc-500">
                        <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                        <span className="text-sm font-medium">
                            Загрузка {uploadProgress.done}/{uploadProgress.total}...
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-zinc-500">
                        <UploadCloud className="w-8 h-8 mb-2 text-zinc-400" />
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Нажмите или перетащите файлы
                        </span>
                        <span className="text-xs text-zinc-400 mt-1">
                            PNG, JPG, WEBP до 5MB · можно выбрать несколько
                        </span>
                    </div>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileSelect}
                disabled={isUploading}
            />
        </div>
    );
}

-- ============================================
-- ПОЛНАЯ НАСТРОЙКА БАЗЫ ДАННЫХ ДЛЯ АДМИН-ПАНЕЛИ
-- Выполните этот скрипт в Supabase Dashboard → SQL Editor
-- ============================================

-- 1. ТАБЛИЦА ТОВАРОВ (products)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC DEFAULT 0,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  base_images JSONB DEFAULT '[]',
  cover_position TEXT DEFAULT 'center',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cover_position TEXT DEFAULT 'center';

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Products select" ON public.products;
DROP POLICY IF EXISTS "Products all" ON public.products;
CREATE POLICY "Products select" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products all" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. ТАБЛИЦА ЗАКАЗОВ (orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  items JSONB DEFAULT '[]',
  total NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'new',
  customer_info JSONB DEFAULT '{}',
  shipping_method TEXT,
  shipping_cost NUMERIC DEFAULT 0,
  delivery_detail JSONB,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Orders select" ON public.orders;
DROP POLICY IF EXISTS "Orders insert" ON public.orders;
DROP POLICY IF EXISTS "Orders all" ON public.orders;
CREATE POLICY "Orders select" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders all" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. ТАБЛИЦА ЗАЯВОК (applications)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  phone TEXT,
  details TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Applications select" ON public.applications;
DROP POLICY IF EXISTS "Applications insert" ON public.applications;
DROP POLICY IF EXISTS "Applications all" ON public.applications;
CREATE POLICY "Applications select" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Applications insert" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Applications all" ON public.applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. ТАБЛИЦА CMS КОНТЕНТА (cms_content)
CREATE TABLE IF NOT EXISTS public.cms_content (
  key TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "CMS select" ON public.cms_content;
DROP POLICY IF EXISTS "CMS all" ON public.cms_content;
CREATE POLICY "CMS select" ON public.cms_content FOR SELECT USING (true);
CREATE POLICY "CMS all" ON public.cms_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. STORAGE BUCKET ДЛЯ ИЗОБРАЖЕНИЙ
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('products', 'products', true, 5242880)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Product images select" ON storage.objects;
DROP POLICY IF EXISTS "Product images insert" ON storage.objects;
DROP POLICY IF EXISTS "Product images update" ON storage.objects;
DROP POLICY IF EXISTS "Product images delete" ON storage.objects;

CREATE POLICY "Product images select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Product images insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'products');

CREATE POLICY "Product images update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'products');

CREATE POLICY "Product images delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'products');

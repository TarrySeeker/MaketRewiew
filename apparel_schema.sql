-- 1. Сброс старых таблиц (ОСТОРОЖНО, УДАЛИТ ДАННЫЕ)
drop table if exists order_shipping cascade;
drop table if exists order_items cascade;
drop table if exists orders cascade;
drop table if exists wishlists cascade;
drop table if exists users_profiles cascade;
drop table if exists product_skus cascade;
drop table if exists product_variants cascade;
drop table if exists products cascade;

-- ПРОДУКТЫ (Products)
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  category text,
  brand text,
  is_active boolean default true,
  base_price numeric not null default 0,
  base_images text[] default '{}',
  moysklad_id text unique -- Для синхронизации с МойСклад
);

-- ВАРИАЦИИ ТОВАРА (Product Variants - Цвета)
create table product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  color_name text not null,
  color_hex text,
  images text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SKU ТОВАРА (Product SKUs - Размеры и остатки)
create table product_skus (
  id uuid default gen_random_uuid() primary key,
  variant_id uuid references product_variants(id) on delete cascade not null,
  size text not null,
  stock integer default 0 not null,
  price numeric, -- null если цена равна base_price продукта
  barcode text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (variant_id, size)
);

-- ПРОФИЛИ ПОЛЬЗОВАТЕЛЕЙ (User Profiles)
-- Привязка к auth.users через id
create table users_profiles (
  id uuid primary key, -- References auth.users(id) in Supabase
  phone text unique,
  full_name text,
  loyalty_points integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ИЗБРАННОЕ (Wishlists)
create table wishlists (
  user_id uuid references users_profiles(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, product_id)
);

-- ЗАКАЗЫ (Orders)
create table orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references users_profiles(id) on delete set null, -- null если гость
  customer_info jsonb not null default '{}', -- { name, phone, email, comment }
  total numeric not null,
  status text not null default 'new', -- new, paid, processing, shipped, completed, cancelled
  payment_method text, -- card, sbp, split, cod
  is_paid boolean default false
);

-- ПОЗИЦИИ ЗАКАЗА (Order Items)
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  sku_id uuid references product_skus(id) on delete set null,
  sku_snapshot jsonb not null, -- Сохраняем название, размер, цвет, чтобы при удалении SKU инфа осталась
  quantity integer not null default 1,
  price numeric not null
);

-- ДОСТАВКА ЗАКАЗА (Order Shipping - интеграция со СДЭК)
create table order_shipping (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null unique,
  shipping_method text, -- 'cdek_pvz', 'cdek_courier', etc
  shipping_cost numeric default 0,
  delivery_detail jsonb, -- { city, address, pvz_code }
  cdek_uuid text, -- ID заказа в СДЭК
  cdek_tracking_number text, -- Трек-номер
  status text -- статус доставки
);

-- SECURITY POLICIES (RLS)
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_skus enable row level security;
alter table users_profiles enable row level security;
alter table wishlists enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_shipping enable row level security;

-- Публичные политики для чтения каталога
create policy "Public read products" on products for select using (true);
create policy "Public read variants" on product_variants for select using (true);
create policy "Public read skus" on product_skus for select using (true);

-- Политики для заказов (только для инсерта гостями или чтения/управления своими)
create policy "Guest and users can insert orders" on orders for insert with check (true);
create policy "Guest and users can insert order items" on order_items for insert with check (true);
create policy "Guest and users can insert order shipping" on order_shipping for insert with check (true);

-- ДЕМО ДАННЫЕ (Seed)
insert into products (title, description, category, brand, base_price, base_images) 
values (
  'Оверсайз Худи "Essential"', 
  'Плотный хлопок с начесом, комфортная посадка.', 
  'Худи', 
  'NUW', 
  8500, 
  ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop']
);

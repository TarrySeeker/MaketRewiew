import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { createCdekOrder } from '@/lib/cdek';

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const { items, customer, delivery, paymentMethod, total, shippingCost, userId } = payload;

        // 1. Сборка заказа
        const orderId = crypto.randomUUID();
        const finalTotal = total + shippingCost;

        // В реальном проекте здесь нужно перепроверять цены и наличие товаров через БД

        // 2. Создаем заказ в Supabase
        const { error: orderError } = await supabase.from('orders').insert([{
            id: orderId,
            user_id: userId || null,
            customer_info: customer,
            total: finalTotal,
            status: paymentMethod === 'cod' ? 'processing' : 'new', // cod - cash on delivery (оплата при получении)
            payment_method: paymentMethod,
            is_paid: false
        }]);

        if (orderError) throw new Error(`Supabase Insert Error: ${orderError.message}`);

        // 3. Формируем данные доставки
        const { error: shippingError } = await supabase.from('order_shipping').insert([{
            order_id: orderId,
            shipping_method: 'cdek_pvz',
            shipping_cost: shippingCost,
            delivery_detail: delivery
        }]);

        if (shippingError) console.error('Shipping Error:', shippingError);

        // 4. Если выбрана "Оплата при получении" (cod), сразу создаем накладную в СДЭК
        // Иначе ждем вебхук от ЮKassa (будет реализовано в webhook)
        let cdekTracking = null;
        if (paymentMethod === 'cod' && delivery?.code) {
            const cdekPayload = {
                type: 1,
                number: orderId,
                tariff_code: 136, // ПВЗ-ПВЗ (пример)
                from_location: { code: 269 }, // Екатеринбург (город отправителя)
                to_location: { code: delivery.code },
                recipient: {
                    name: customer.name,
                    phones: [{ number: customer.phone }]
                },
                packages: items.map((item: any) => ({
                    number: item.id,
                    weight: 500, // Граммы
                    length: 30,
                    width: 20,
                    height: 10,
                    items: [{
                        name: item.name,
                        ware_key: item.id,
                        payment: { value: item.price },
                        cost: item.price,
                        weight: 500,
                        amount: item.quantity
                    }]
                }))
            };

            try {
                const cdekRes = await createCdekOrder(cdekPayload);
                if (cdekRes.entity?.uuid) {
                    await supabase.from('order_shipping').update({
                        cdek_uuid: cdekRes.entity.uuid
                    }).eq('order_id', orderId);
                }
            } catch (e) {
                console.error("Failed to create cdek order on COD", e);
            }
        }

        // 5. Для онлайн оплаты возвращаем ссылку на оплату
        if (paymentMethod !== 'cod') {
            // Здесь должна быть генерация ссылки ЮKassa
            // const paymentUrl = await createYookassaPayment(orderId, finalTotal);
            const mockPaymentUrl = `/checkout/success?order_id=${orderId}`; // Mock
            return NextResponse.json({ success: true, paymentUrl: mockPaymentUrl, orderId });
        }

        return NextResponse.json({ success: true, orderId });

    } catch (error: any) {
        console.error("Checkout Api Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

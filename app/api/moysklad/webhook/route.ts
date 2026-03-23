import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Basic Webhook handler for MoySklad (МойСклад)
// This endpoint expects a POST request from MoySklad when products or stock change.

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // In a real scenario, MoySklad webhook payload needs to be parsed:
        // payload.events will contain array of changes (e.g. meta.type = 'product', 'variant')
        // We would then query MoySklad API to get the changed entity details
        // using the href provided in the event meta.

        console.log("MoySklad Webhook received:", JSON.stringify(payload, null, 2));

        const events = payload.events || [];

        for (const event of events) {
            const { meta, action } = event;
            const type = meta.type;

            // Example logic for stock update
            if (type === 'stock' || type === 'assortment') {
                // Here you would normally fetch the updated item from MoySklad API
                // const moyskladData = await fetchMoySkladItem(meta.href);
                // and then update Supabase:

                // const { error } = await supabase
                //     .from('product_skus')
                //     .update({ stock: moyskladData.stock })
                //     .eq('moysklad_id', event.meta.id);
            }
        }

        // Always return 200 OK so MoySklad doesn't retry
        return NextResponse.json({ status: 'success' }, { status: 200 });

    } catch (error) {
        console.error("Error processing MoySklad webhook:", error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

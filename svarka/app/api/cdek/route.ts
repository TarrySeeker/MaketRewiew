import { NextResponse } from 'next/server';
import { getCities, getOffices, calculateTariffList } from '@/lib/cdek';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    try {
        if (action === 'cities') {
            const city = searchParams.get('city');
            if (!city) return NextResponse.json({ error: 'City is required' }, { status: 400 });
            const data = await getCities(city);
            return NextResponse.json(data);
        }

        if (action === 'offices') {
            const cityCode = searchParams.get('code');
            if (!cityCode) return NextResponse.json({ error: 'City code is required' }, { status: 400 });
            const data = await getOffices(parseInt(cityCode));
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, payload } = body;

        if (action === 'calculator') {
            const data = await calculateTariffList(payload);
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

const CDEK_CLIENT_ID = process.env.CDEK_CLIENT_ID || "wqGwiQx0gg8mLtiEKsUinjVSICCjtTEP";
const CDEK_CLIENT_SECRET = process.env.CDEK_CLIENT_SECRET || "RmAmgvSgSl1yirlz9QupbzOJVqhCxcP5";
const CDEK_API_URL = process.env.NEXT_PUBLIC_CDEK_API_URL || "https://api.edu.cdek.ru/v2";

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getCdekToken() {
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CDEK_CLIENT_ID);
    params.append('client_secret', CDEK_CLIENT_SECRET);

    const response = await fetch(`${CDEK_API_URL}/oauth/token?parameters`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
        cache: 'no-store'
    });

    if (!response.ok) {
        console.error('Failed to get CDEK token', await response.text());
        throw new Error('Failed to authenticate with CDEK');
    }

    const data = await response.json();
    cachedToken = data.access_token;
    // Токен действует 1 час (3600 сек), ставим время жизни на 5 минут меньше для безопасности
    tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;

    return cachedToken;
}

export async function getCities(city: string) {
    const token = await getCdekToken();
    const response = await fetch(`${CDEK_API_URL}/location/cities?city=${encodeURIComponent(city)}&size=10`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch cities');
    return response.json();
}

export async function getOffices(cityCode: number) {
    const token = await getCdekToken();
    const response = await fetch(`${CDEK_API_URL}/deliverypoints?city_code=${cityCode}&type=PVZ`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch offices');
    return response.json();
}

export async function calculateTariffList(payload: any) {
    const token = await getCdekToken();
    const response = await fetch(`${CDEK_API_URL}/calculator/tarifflist`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to calculate tariff: ' + await response.text());
    return response.json();
}

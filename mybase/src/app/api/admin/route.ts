import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, table, data, id, filters } = body;

    try {
        switch (action) {
            case "verify_password": {
                const { password } = body;
                if (!password) return NextResponse.json({ error: "Password required" }, { status: 400 });

                const verifyClient = createAdminClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );
                const { error } = await verifyClient.auth.signInWithPassword({
                    email: user.email!,
                    password,
                });
                if (error) {
                    return NextResponse.json({ error: "Неверный пароль" }, { status: 403 });
                }
                return NextResponse.json({ success: true });
            }
            case "select": {
                let query = supabase.from(table).select(data?.select || "*");
                if (data?.order) {
                    query = query.order(data.order.column, { ascending: data.order.ascending ?? false });
                }
                if (data?.limit) {
                    query = query.limit(data.limit);
                }
                if (filters) {
                    for (const f of filters) {
                        query = query.eq(f.column, f.value);
                    }
                }
                const { data: result, error, count } = await query;
                if (error) return NextResponse.json({ error: error.message }, { status: 400 });
                return NextResponse.json({ data: result, count });
            }

            case "insert": {
                const { error, data: result } = await supabase.from(table).insert(data).select();
                if (error) return NextResponse.json({ error: error.message }, { status: 400 });
                return NextResponse.json({ data: result });
            }

            case "update": {
                if (!id) return NextResponse.json({ error: "ID required for update" }, { status: 400 });
                const { error, data: result } = await supabase.from(table).update(data).eq("id", id).select();
                if (error) return NextResponse.json({ error: error.message }, { status: 400 });
                return NextResponse.json({ data: result });
            }

            case "upsert": {
                const { error, data: result } = await supabase.from(table).upsert(data, {
                    onConflict: body.onConflict || "id"
                }).select();
                if (error) return NextResponse.json({ error: error.message }, { status: 400 });
                return NextResponse.json({ data: result });
            }

            case "delete": {
                if (!id) return NextResponse.json({ error: "ID required for delete" }, { status: 400 });
                const { error } = await supabase.from(table).delete().eq("id", id);
                if (error) return NextResponse.json({ error: error.message }, { status: 400 });
                return NextResponse.json({ success: true });
            }

            case "count": {
                const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
                if (error) return NextResponse.json({ error: error.message }, { status: 400 });
                return NextResponse.json({ count });
            }

            default:
                return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}

interface AdminFilter {
    column: string;
    value: any;
}

interface AdminRequestBase {
    table: string;
}

interface SelectRequest extends AdminRequestBase {
    action: "select";
    data?: {
        select?: string;
        order?: { column: string; ascending?: boolean };
        limit?: number;
    };
    filters?: AdminFilter[];
}

interface InsertRequest extends AdminRequestBase {
    action: "insert";
    data: Record<string, any> | Record<string, any>[];
}

interface UpdateRequest extends AdminRequestBase {
    action: "update";
    id: string | number;
    data: Record<string, any>;
}

interface UpsertRequest extends AdminRequestBase {
    action: "upsert";
    data: Record<string, any>;
    onConflict?: string;
}

interface DeleteRequest extends AdminRequestBase {
    action: "delete";
    id: string | number;
}

interface CountRequest extends AdminRequestBase {
    action: "count";
}

interface VerifyPasswordRequest {
    action: "verify_password";
    table: string;
    password: string;
}

type AdminRequest = SelectRequest | InsertRequest | UpdateRequest | UpsertRequest | DeleteRequest | CountRequest | VerifyPasswordRequest;

interface AdminResponse<T = any> {
    data?: T;
    count?: number;
    success?: boolean;
    error?: string;
}

export async function adminApi<T = any>(request: AdminRequest): Promise<AdminResponse<T>> {
    const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });

    const json = await res.json();

    if (!res.ok) {
        return { error: json.error || `HTTP ${res.status}` };
    }

    return json;
}

import { API_BASE_URL } from "@/config/environment";
import { getAuthToken } from "./authToken";

export interface User {
	userId: number;
	email: string;
	firstName?: string;
	lastName?: string;
	roles?: string[];
}

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
	const token = await getAuthToken();

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		Accept: "application/json",
		...(options.headers || {}),
	};

	if (token) {
		(headers as any).Authorization = `Bearer ${token}`;
	}

	const res = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers,
	});

	return res;
}

export async function getAllUsers(): Promise<User[]> {
	const res = await authFetch(`/users`);

	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || `Failed to fetch users (${res.status})`);
	}

	const data = await res.json();
	return Array.isArray(data) ? data : [];
}

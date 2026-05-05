import { createClient, type SanityClient } from '@sanity/client';
import { env } from '$env/dynamic/public';

export const SANITY_PROJECT_ID = env.PUBLIC_SANITY_PROJECT_ID;
export const SANITY_DATASET = env.PUBLIC_SANITY_DATASET || 'production';
export const SANITY_API_VERSION = env.PUBLIC_SANITY_API_VERSION || '2024-10-01';
export const SANITY_CONFIGURED = Boolean(SANITY_PROJECT_ID);

let client: SanityClient | null = null;

/**
 * Lazy client. Returns null if the project isn't configured yet (pre-`sanity init`).
 * Call sites should handle null and fall back to local data.
 */
export function getSanityClient(): SanityClient | null {
	if (!SANITY_CONFIGURED) return null;
	if (!client) {
		client = createClient({
			projectId: SANITY_PROJECT_ID,
			dataset: SANITY_DATASET,
			apiVersion: SANITY_API_VERSION,
			useCdn: true,
			perspective: 'published'
		});
	}
	return client;
}

/**
 * Run a GROQ query, returning fallback if Sanity isn't configured or the call fails.
 * Logs errors but never throws — keeps the site up while Nair team is editing.
 */
export async function safeFetch<T>(
	query: string,
	params: Record<string, unknown> = {},
	fallback: T
): Promise<T> {
	const c = getSanityClient();
	if (!c) return fallback;
	try {
		const result = await c.fetch<T>(query, params);
		return result ?? fallback;
	} catch (err) {
		console.error('[sanity] fetch failed:', err);
		return fallback;
	}
}

import type { Locale } from '$lib/paraglide/runtime';
import type { Localized } from './types';

/**
 * Pull the current-locale string out of a Localized object. Falls back to MN, then any value, then ''.
 * Use everywhere you'd otherwise do `value?.[locale] || ''`.
 */
export function t(value: Localized | undefined, locale: Locale): string {
	if (!value) return '';
	return value[locale] || value.mn || Object.values(value).find(Boolean) || '';
}

// URL-safe slug. Keeps Cyrillic so Mongolian titles still produce stable slugs.
export function slugify(s: string): string {
	return s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9Ѐ-ӿ]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// Site-level SEO + GEO constants and helpers.
//
// SEO = traditional search engines (Google, Bing).
// GEO = "Generative Engine Optimization" — making content quotable/discoverable
//        by LLM-driven search (ChatGPT, Perplexity, Claude, Gemini).
//
// Both share the same fundamentals: clean canonical URLs, semantic HTML,
// per-page titles + descriptions, og:image for share previews, JSON-LD
// structured data, sitemap + llms.txt for crawlers.

import type { Locale } from '$lib/paraglide/runtime';

export const SITE = {
	name: 'Nair Entertainment',
	domain: 'nair.mn',
	origin: 'https://nair.mn',
	locales: ['mn', 'en'] as const,
	baseLocale: 'mn' as Locale,
	twitter: '@nairentertainment',
	defaultOgImage: '/client-materials/og-default.jpg',
	logo: '/client-materials/Logo/symbol.svg'
};

const DESCRIPTIONS: Record<Locale, string> = {
	mn: 'Уламжлалт монгол урлаг, мэргэжлийн найруулга, гүйцэтгэл — арга хэмжээ, найр, цэнгүүн, төрөлхийн ёслол үйлчилгээ.',
	en: 'Traditional Mongolian performing arts — long song, khoomei, morin khuur, dance and ceremonial performances for events, weddings and cultural programmes.'
};

export function defaultDescription(locale: Locale): string {
	return DESCRIPTIONS[locale] ?? DESCRIPTIONS.mn;
}

/** Build the canonical URL for a given pathname + locale. */
export function canonicalUrl(pathname: string, locale: Locale): string {
	const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
	if (locale === SITE.baseLocale) return `${SITE.origin}${path}`;
	return `${SITE.origin}/${locale}${path === '/' ? '' : path}`;
}

/** All locale variants of a path, for hreflang alternates. */
export function alternateUrls(pathname: string): { locale: Locale; href: string }[] {
	return SITE.locales.map((locale) => ({ locale, href: canonicalUrl(pathname, locale) }));
}

export function absoluteUrl(maybeRelative: string | null | undefined): string | null {
	if (!maybeRelative) return null;
	if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
	return `${SITE.origin}${maybeRelative.startsWith('/') ? maybeRelative : `/${maybeRelative}`}`;
}

export interface SeoInput {
	title?: string;
	description?: string;
	image?: string | null;
	pathname: string;
	locale: Locale;
	type?: 'website' | 'article' | 'profile';
	noindex?: boolean;
}

export interface SeoOutput {
	title: string;
	description: string;
	canonical: string;
	image: string;
	type: NonNullable<SeoInput['type']>;
	noindex: boolean;
	alternates: { locale: Locale; href: string }[];
}

export function buildSeo(input: SeoInput): SeoOutput {
	const description = input.description?.trim() || defaultDescription(input.locale);
	const baseTitle = input.title?.trim();
	const title = baseTitle && baseTitle !== SITE.name ? `${baseTitle} — ${SITE.name}` : SITE.name;
	const image = absoluteUrl(input.image) ?? absoluteUrl(SITE.defaultOgImage)!;
	return {
		title,
		description,
		canonical: canonicalUrl(input.pathname, input.locale),
		image,
		type: input.type ?? 'website',
		noindex: !!input.noindex,
		alternates: alternateUrls(input.pathname)
	};
}

/** Trim text to ~160 chars on a word boundary for meta descriptions. */
export function clampDescription(text: string | undefined | null, max = 160): string {
	if (!text) return '';
	const t = text.replace(/\s+/g, ' ').trim();
	if (t.length <= max) return t;
	const cut = t.slice(0, max);
	const lastSpace = cut.lastIndexOf(' ');
	return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

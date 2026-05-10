import type { RequestHandler } from './$types';
import { safeFetch } from '$lib/sanity/client';
import {
	DISCIPLINES_QUERY,
	ALL_SERVICES_QUERY,
	ALL_EVENTS_QUERY,
	ALL_SEASONS_QUERY
} from '$lib/sanity/queries';
import type { DisciplinesSection, Service, Event, Season } from '$lib/sanity/types';
import { SITE, alternateUrls } from '$lib/seo';
import { slugify } from '$lib/sanity/i18n';

const STATIC_PATHS = ['/', '/services', '/events', '/seasonal'];

const FALLBACK_DISCIPLINE_SLUGS = [
	'urtin-duu',
	'ardiin-duu',
	'khoomii',
	'yurool',
	'mongol-bujig',
	'uran-nugaralt',
	'tsam-bujig',
	'morin-khuur-quartet',
	'undesnii-khugjim'
];

interface UrlEntry {
	path: string;
	lastmod?: string;
	changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
	priority?: number;
}

function escapeXml(s: string): string {
	return s.replace(/[<>&'"]/g, (c) =>
		c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c === "'" ? '&apos;' : '&quot;'
	);
}

function urlBlock(entry: UrlEntry): string {
	const alts = alternateUrls(entry.path);
	const baseHref = alts.find((a) => a.locale === SITE.baseLocale)?.href ?? '';
	const altLinks = alts
		.map(
			(a) =>
				`    <xhtml:link rel="alternate" hreflang="${a.locale}" href="${escapeXml(a.href)}" />`
		)
		.join('\n');
	return [
		'  <url>',
		`    <loc>${escapeXml(baseHref)}</loc>`,
		entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : '',
		entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : '',
		entry.priority !== undefined ? `    <priority>${entry.priority}</priority>` : '',
		altLinks,
		`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(baseHref)}" />`,
		'  </url>'
	]
		.filter(Boolean)
		.join('\n');
}

export const GET: RequestHandler = async ({ setHeaders }) => {
	const [disciplines, services, events, seasons] = await Promise.all([
		safeFetch<DisciplinesSection | null>(DISCIPLINES_QUERY, {}, null),
		safeFetch<Service[]>(ALL_SERVICES_QUERY, {}, []),
		safeFetch<Event[]>(ALL_EVENTS_QUERY, {}, []),
		safeFetch<Season[]>(ALL_SEASONS_QUERY, {}, [])
	]);

	const disciplineSlugs = (() => {
		if (disciplines?.cards?.length) {
			return disciplines.cards
				.map((c) => c.slug || slugify(c.title?.en || c.title?.mn || ''))
				.filter(Boolean);
		}
		return FALLBACK_DISCIPLINE_SLUGS;
	})();

	const entries: UrlEntry[] = [
		...STATIC_PATHS.map((path) => ({
			path,
			changefreq: 'weekly' as const,
			priority: path === '/' ? 1 : 0.7
		})),
		...disciplineSlugs.map((slug) => ({
			path: `/disciplines/${slug}`,
			changefreq: 'monthly' as const,
			priority: 0.7
		})),
		...services.map((s) => ({
			path: `/services/${s.slug.current}`,
			changefreq: 'monthly' as const,
			priority: 0.6
		})),
		...events.map((e) => ({
			path: `/events/${e.slug.current}`,
			changefreq: 'weekly' as const,
			priority: 0.6
		})),
		...seasons.map((sn) => ({
			path: `/seasonal/${sn.slug.current}`,
			changefreq: 'monthly' as const,
			priority: 0.5
		}))
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(urlBlock).join('\n')}
</urlset>`;

	setHeaders({
		'content-type': 'application/xml; charset=utf-8',
		'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
	});

	return new Response(xml);
};

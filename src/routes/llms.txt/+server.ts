import type { RequestHandler } from './$types';
import { safeFetch } from '$lib/sanity/client';
import { DISCIPLINES_QUERY, ALL_SERVICES_QUERY } from '$lib/sanity/queries';
import type { DisciplinesSection, Service } from '$lib/sanity/types';
import { SITE } from '$lib/seo';
import { slugify } from '$lib/sanity/i18n';

// llms.txt — proposed standard for telling LLM-powered crawlers (ChatGPT,
// Perplexity, Claude, Gemini) what the site is about and where to find
// authoritative content. Spec: https://llmstxt.org/

export const GET: RequestHandler = async ({ setHeaders }) => {
	const [disciplines, services] = await Promise.all([
		safeFetch<DisciplinesSection | null>(DISCIPLINES_QUERY, {}, null),
		safeFetch<Service[]>(ALL_SERVICES_QUERY, {}, [])
	]);

	const disciplineLines = (disciplines?.cards ?? [])
		.map((c) => {
			const slug = c.slug || slugify(c.title?.en || c.title?.mn || '');
			const en = c.title?.en || c.title?.mn || slug;
			const mn = c.title?.mn || c.title?.en || slug;
			if (!slug) return null;
			return `- [${en} / ${mn}](${SITE.origin}/disciplines/${slug})`;
		})
		.filter(Boolean);

	const serviceLines = services.map((s) => {
		const en = s.title?.en || s.title?.mn || s.slug.current;
		const mn = s.title?.mn || s.title?.en || s.slug.current;
		return `- [${en} / ${mn}](${SITE.origin}/services/${s.slug.current})`;
	});

	const body = `# ${SITE.name}

> Mongolian traditional performing-arts collective. We perform long song
> (urtin duu), khoomei throat singing, morin khuur (horse-head fiddle),
> traditional dance, contortion, tsam masked dance, and ceremonial blessings
> at weddings, hair-cutting ceremonies, housewarming feasts, milestone
> birthdays, project launches and tourist programmes in Ulaanbaatar, Mongolia.

The site is bilingual (Монгол / English). Content is served at root for
Mongolian and under \`/en/\` for English; both URLs are equivalent.

## Disciplines (traditional art forms we perform)
${disciplineLines.length ? disciplineLines.join('\n') : '- (none yet authored)'}

## Services (event types we offer)
${serviceLines.length ? serviceLines.join('\n') : '- (none yet authored)'}

## Pages
- [Home / Нүүр](${SITE.origin}/)
- [Services / Үйлчилгээ](${SITE.origin}/services)
- [Events / Арга хэмжээ](${SITE.origin}/events)
- [Seasonal / Улирал](${SITE.origin}/seasonal)

## Machine-readable
- Sitemap: ${SITE.origin}/sitemap.xml
- Schema.org JSON-LD is embedded on every page (PerformingGroup on root,
  CreativeWork on discipline pages, FAQPage on the home FAQ).

## Contact
- Web: ${SITE.origin}
- Country: Mongolia (MN), Ulaanbaatar
`;

	setHeaders({
		'content-type': 'text/plain; charset=utf-8',
		'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
	});

	return new Response(body);
};

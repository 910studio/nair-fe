import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { safeFetch } from '$lib/sanity/client';
import { DISCIPLINES_QUERY } from '$lib/sanity/queries';
import type { DisciplinesSection } from '$lib/sanity/types';
import { slugify } from '$lib/sanity/i18n';

const FALLBACK: Record<string, { mn: string; en: string }> = {
	'urtin-duu': { mn: 'Уртын дуу', en: 'Long song' },
	'ardiin-duu': { mn: 'Ардын дуу', en: 'Folk song' },
	khoomii: { mn: 'Хөөмий', en: 'Khoomei' },
	yurool: { mn: 'Ерөөл магтаал', en: 'Blessings & eulogies' },
	'mongol-bujig': { mn: 'Монгол бүжиг', en: 'Mongolian dance' },
	'uran-nugaralt': { mn: 'Уран нугаралт', en: 'Contortion' },
	'tsam-bujig': { mn: 'Цамын бүжиг', en: 'Tsam dance' },
	'morin-khuur-quartet': { mn: 'Морин хуурын дөрвөл', en: 'Morin khuur quartet' },
	'undesnii-khugjim': { mn: 'Үндэсний хөгжмийн цөөхүүл', en: 'National music ensemble' }
};

export const load: PageServerLoad = async ({ params }) => {
	const section = await safeFetch<DisciplinesSection | null>(DISCIPLINES_QUERY, {}, null);

	const cmsCard = section?.cards?.find((c) => {
		if (c.slug && c.slug === params.slug) return true;
		const en = c.title?.en || '';
		const mn = c.title?.mn || '';
		return slugify(en) === params.slug || slugify(mn) === params.slug;
	});

	if (cmsCard) {
		return { slug: params.slug, cms: cmsCard, fallback: null };
	}

	const fb = FALLBACK[params.slug];
	if (fb) {
		return { slug: params.slug, cms: null, fallback: fb };
	}

	throw error(404, 'Discipline not found');
};

import type { PageServerLoad } from './$types';
import type { Config } from '@sveltejs/adapter-vercel';
import { safeFetch } from '$lib/sanity/client';
import {
	HERO_QUERY,
	INTRO_QUERY,
	DISCIPLINES_QUERY,
	COLLABS_QUERY,
	WHY_US_QUERY,
	FAQ_QUERY
} from '$lib/sanity/queries';
import type {
	HeroSection,
	IntroSection,
	DisciplinesSection,
	CollabsSection,
	WhyUsSection,
	FaqItem
} from '$lib/sanity/types';

export const config: Config = {
	isr: { expiration: 300 }
};

export const load: PageServerLoad = async () => {
	const [hero, intro, disciplines, collabs, whyUs, faq] = await Promise.all([
		safeFetch<HeroSection | null>(HERO_QUERY, {}, null),
		safeFetch<IntroSection | null>(INTRO_QUERY, {}, null),
		safeFetch<DisciplinesSection | null>(DISCIPLINES_QUERY, {}, null),
		safeFetch<CollabsSection | null>(COLLABS_QUERY, {}, null),
		safeFetch<WhyUsSection | null>(WHY_US_QUERY, {}, null),
		safeFetch<FaqItem[]>(FAQ_QUERY, {}, [])
	]);
	return { hero, intro, disciplines, collabs, whyUs, faq };
};

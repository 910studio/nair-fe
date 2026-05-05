import type { PageServerLoad } from './$types';
import type { Config } from '@sveltejs/adapter-vercel';
import { safeFetch } from '$lib/sanity/client';
import { ALL_SEASONS_QUERY } from '$lib/sanity/queries';
import type { Season } from '$lib/sanity/types';

export const config: Config = {
	isr: { expiration: 300 }
};

export const load: PageServerLoad = async () => {
	const seasons = await safeFetch<Season[]>(ALL_SEASONS_QUERY, {}, []);
	return { seasons };
};

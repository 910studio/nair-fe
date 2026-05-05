import type { PageServerLoad } from './$types';
import { safeFetch } from '$lib/sanity/client';
import { ALL_SEASONS_QUERY } from '$lib/sanity/queries';
import type { Season } from '$lib/sanity/types';

export const load: PageServerLoad = async () => {
	const seasons = await safeFetch<Season[]>(ALL_SEASONS_QUERY, {}, []);
	return { seasons };
};

import type { PageServerLoad } from './$types';
import { safeFetch } from '$lib/sanity/client';
import { ALL_SEASONS_QUERY } from '$lib/sanity/queries';
import type { Season } from '$lib/sanity/types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const seasons = await safeFetch<Season[]>(ALL_SEASONS_QUERY, {}, []);
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400'
	});
	return { seasons };
};

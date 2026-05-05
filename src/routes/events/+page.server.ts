import type { PageServerLoad } from './$types';
import { safeFetch } from '$lib/sanity/client';
import { ALL_EVENTS_QUERY } from '$lib/sanity/queries';
import type { Event } from '$lib/sanity/types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const events = await safeFetch<Event[]>(ALL_EVENTS_QUERY, {}, []);
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400'
	});
	return { events };
};

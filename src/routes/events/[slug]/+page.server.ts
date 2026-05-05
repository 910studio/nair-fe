import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { safeFetch } from '$lib/sanity/client';
import { EVENT_BY_SLUG_QUERY } from '$lib/sanity/queries';
import type { Event } from '$lib/sanity/types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const event = await safeFetch<Event | null>(EVENT_BY_SLUG_QUERY, { slug: params.slug }, null);
	if (!event) error(404, 'Event not found');
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400'
	});
	return { event };
};

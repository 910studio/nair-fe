import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { safeFetch } from '$lib/sanity/client';
import { SEASON_WITH_EVENTS_QUERY } from '$lib/sanity/queries';
import type { Season, Event } from '$lib/sanity/types';

type SeasonWithEvents = Season & { events: Event[] };

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const season = await safeFetch<SeasonWithEvents | null>(
		SEASON_WITH_EVENTS_QUERY,
		{ slug: params.slug },
		null
	);
	if (!season) error(404, 'Season not found');
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400'
	});
	return { season };
};

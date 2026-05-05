import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Config } from '@sveltejs/adapter-vercel';
import { safeFetch } from '$lib/sanity/client';
import { SEASON_WITH_EVENTS_QUERY } from '$lib/sanity/queries';
import type { Season, Event } from '$lib/sanity/types';

export const config: Config = {
	isr: { expiration: 300 }
};

type SeasonWithEvents = Season & { events: Event[] };

export const load: PageServerLoad = async ({ params }) => {
	const season = await safeFetch<SeasonWithEvents | null>(
		SEASON_WITH_EVENTS_QUERY,
		{ slug: params.slug },
		null
	);
	if (!season) error(404, 'Season not found');
	return { season };
};

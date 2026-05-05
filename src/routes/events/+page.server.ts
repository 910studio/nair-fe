import type { PageServerLoad } from './$types';
import { safeFetch } from '$lib/sanity/client';
import { ALL_EVENTS_QUERY } from '$lib/sanity/queries';
import type { Event } from '$lib/sanity/types';

export const load: PageServerLoad = async () => {
	const events = await safeFetch<Event[]>(ALL_EVENTS_QUERY, {}, []);
	return { events };
};

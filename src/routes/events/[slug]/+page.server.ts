import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Config } from '@sveltejs/adapter-vercel';
import { safeFetch } from '$lib/sanity/client';
import { EVENT_BY_SLUG_QUERY } from '$lib/sanity/queries';
import type { Event } from '$lib/sanity/types';

export const config: Config = {
	isr: { expiration: 300 }
};

export const load: PageServerLoad = async ({ params }) => {
	const event = await safeFetch<Event | null>(EVENT_BY_SLUG_QUERY, { slug: params.slug }, null);
	if (!event) error(404, 'Event not found');
	return { event };
};

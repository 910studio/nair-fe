import type { LayoutServerLoad } from './$types';
import { safeFetch } from '$lib/sanity/client';
import { SITE_SETTINGS_QUERY, ALL_SERVICES_QUERY } from '$lib/sanity/queries';
import type { SiteSettings, Service } from '$lib/sanity/types';

export const load: LayoutServerLoad = async () => {
	const [siteSettings, services] = await Promise.all([
		safeFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null),
		safeFetch<Service[]>(ALL_SERVICES_QUERY, {}, [])
	]);
	return { siteSettings, services };
};

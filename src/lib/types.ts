import type { Locale } from '$lib/paraglide/runtime';

export type Localized = Record<Locale, string>;

export interface ServiceBase {
	slug: string;
	title: Localized;
	bannerImage: string;
	description: Localized;
}

export interface ServiceArtist {
	name: Localized;
	role?: Localized;
	image?: string;
	songs?: Localized;
}

export interface ServicePlanRoster {
	variant?: 'default' | 'plus';
	name: Localized;
	price: Localized;
	artists: ServiceArtist[];
}

export interface ServiceSmall extends ServiceBase {
	layout: 'small';
	program: {
		title: Localized;
		items: { label: Localized; active: boolean; description?: Localized }[];
	};
	duration: Localized;
	artists: Localized;
	plans?: ServicePlanRoster[];
	disclaimer?: Localized;
	gallery?: string[];
	tips?: {
		title: Localized;
		items: Localized[];
	};
}

export interface ServiceMedium extends ServiceBase {
	layout: 'medium';
	plans: {
		name: Localized;
		price?: Localized;
		duration?: Localized;
		programmeItems?: { label: Localized; active?: boolean }[];
		artistTags?: Localized[];
	}[];
	gallery?: string[];
	tips?: {
		title: Localized;
		items: Localized[];
	};
}

export interface ServiceBigOption {
	label?: Localized;
	title: Localized;
	image?: string;
	programmeItems?: { label: Localized; active?: boolean }[];
	artistTags?: Localized[];
}

export interface ServiceBigSubsection {
	name: Localized;
	duration?: Localized;
	options?: ServiceBigOption[];
	artists?: ServiceArtist[];
}

export interface ServiceBig extends ServiceBase {
	layout: 'big';
	priceRange?: Localized;
	parts: {
		id: string;
		kind?: 'section' | 'cta';
		title: Localized;
		body?: Localized;
		subsections?: ServiceBigSubsection[];
	}[];
	gallery?: string[];
	tips?: {
		title: Localized;
		items: Localized[];
	};
}

export type Service = ServiceSmall | ServiceMedium | ServiceBig;

export interface ServiceLabels {
	price?: Localized;
	contactLabel?: Localized;
	contactCta?: Localized;
}

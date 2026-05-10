import type { Locale } from '$lib/paraglide/runtime';

export type Localized = Record<Locale, string>;

export interface SanityImage {
	_type: 'image';
	asset: { _ref: string; _type: 'reference'; url?: string };
	alt?: string;
	hotspot?: { x: number; y: number };
}

export interface SanityFile {
	_type: 'file';
	asset: { _ref: string; _type: 'reference'; url?: string };
}

export interface SiteSettings {
	phone?: string;
	socials?: { platform: string; url: string }[];
	serviceLabelPrice?: Localized;
	serviceContactLabel?: Localized;
	serviceContactCta?: Localized;
	footerCopyright?: Localized;
}

export interface HeroSection {
	videoWebm?: SanityFile;
	videoMp4?: SanityFile;
	videoPoster?: SanityImage;
	eyebrow?: Localized;
	headline?: Localized;
	subheadline?: Localized;
	ctaLabel?: Localized;
	ctaHref?: string;
}

export interface IntroBodySegment {
	text?: Localized;
	emphasized?: boolean;
}

export interface IntroSection {
	bodySegments?: IntroBodySegment[];
	ctaLabel?: Localized;
	ctaHref?: string;
	image?: SanityImage;
}

export interface DisciplineCard {
	title?: Localized;
	slug?: string;
	image?: SanityImage;
	heroImage?: SanityImage;
	tagline?: Localized;
	description?: Localized;
	gallery?: SanityImage[];
}

export interface DisciplinesSection {
	title?: Localized;
	cards?: DisciplineCard[];
}

export interface CollabPartner {
	name?: string;
	logo?: SanityImage;
}

export interface CollabsSection {
	title?: Localized;
	partners?: CollabPartner[];
}

export interface WhyUsSection {
	badge?: Localized;
	title?: Localized;
	description?: Localized;
	leftPills?: Localized[];
	rightPills?: Localized[];
}

export interface Season {
	_id: string;
	slug: { current: string };
	name: Localized;
	kind: 'recurring' | 'calendar' | 'campaign';
	recurringMonth?: string;
	description?: Localized;
	coverImage?: SanityImage;
	accentColor?: string;
	order?: number;
}

export interface Event {
	_id: string;
	slug: { current: string };
	title: Localized;
	summary?: Localized;
	body?: { en?: unknown[]; mn?: unknown[] };
	season?: Pick<Season, '_id' | 'slug' | 'name' | 'kind' | 'accentColor'> | null;
	startDate?: string;
	endDate?: string;
	recurring?: boolean;
	location?: Localized;
	banner?: SanityImage;
	gallery?: SanityImage[];
	featured?: boolean;
	status?: 'draft' | 'upcoming' | 'past' | 'cancelled';
}

export type ServiceLayout = 'small' | 'medium' | 'big';

export interface ServiceLogoBeltPartner {
	name?: string;
	logo?: SanityImage;
}

export interface ServiceBase {
	_id: string;
	slug: { current: string };
	title: Localized;
	description?: Localized;
	bannerImage?: SanityImage;
	order?: number;
	layout: ServiceLayout;
	logoBeltTitle?: Localized;
	logoBeltPartners?: ServiceLogoBeltPartner[];
}

export interface SanityArtistRef {
	_id: string;
	name: Localized;
	role?: Localized;
	photo?: SanityImage;
}

export interface ServicePlanRosterRaw {
	variant?: 'default' | 'plus';
	name: Localized;
	price: Localized;
	artists?: SanityArtistRef[];
}

export interface ServiceTipsRaw {
	title?: Localized;
	items?: Localized[];
}

export interface ServiceSmall extends ServiceBase {
	layout: 'small';
	programmeTitle?: Localized;
	programmeItems?: { label: Localized; active: boolean }[];
	duration?: Localized;
	artists?: Localized;
	planRosters?: ServicePlanRosterRaw[];
	gallery?: SanityImage[];
	disclaimer?: Localized;
	tips?: ServiceTipsRaw;
}

export interface Artist {
	_id: string;
	name: Localized;
	role?: Localized;
	photo?: SanityImage;
	bio?: Localized;
	order?: number;
}

export interface ServiceMedium extends ServiceBase {
	layout: 'medium';
	plans?: {
		name: Localized;
		price?: Localized;
		duration?: Localized;
		programmeItems?: { label: Localized; active?: boolean }[];
		artistTags?: Localized[];
	}[];
	gallery?: SanityImage[];
	tips?: ServiceTipsRaw;
}

export interface ServiceBigSubsectionRaw {
	name: Localized;
	duration?: Localized;
	options?: {
		label?: Localized;
		title: Localized;
		image?: SanityImage;
		programmeItems?: { label: Localized; active?: boolean }[];
		artistTags?: Localized[];
	}[];
	artists?: {
		artist?: SanityArtistRef;
		songs?: Localized;
	}[];
}

export interface ServiceBig extends ServiceBase {
	layout: 'big';
	priceRange?: Localized;
	parts?: {
		partId: string;
		kind?: 'section' | 'cta';
		title: Localized;
		body?: Localized;
		subsections?: ServiceBigSubsectionRaw[];
	}[];
	gallery?: SanityImage[];
	tips?: ServiceTipsRaw;
}

export type Service = ServiceSmall | ServiceMedium | ServiceBig;

export interface FaqItem {
	_id: string;
	question: Localized;
	answer: Localized;
	order?: number;
	published?: boolean;
}

import groq from 'groq';

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings" && _id == "siteSettings"][0]{
	phone,
	socials,
	serviceLabelPrice,
	serviceContactLabel,
	serviceContactCta,
	footerCopyright
}`;

export const HERO_QUERY = groq`*[_type == "heroSection" && _id == "heroSection"][0]{
	videoWebm{ asset->{ _ref, url } },
	videoMp4{ asset->{ _ref, url } },
	videoPoster,
	eyebrow,
	headline,
	subheadline,
	ctaLabel,
	ctaHref
}`;

export const INTRO_QUERY = groq`*[_type == "introSection" && _id == "introSection"][0]{
	bodySegments[]{ text, emphasized },
	ctaLabel,
	ctaHref,
	image
}`;

export const DISCIPLINES_QUERY = groq`*[_type == "disciplinesSection" && _id == "disciplinesSection"][0]{
	title,
	cards[]{ title, image }
}`;

export const COLLABS_QUERY = groq`*[_type == "collabsSection" && _id == "collabsSection"][0]{
	title,
	partners[]{ name, logo }
}`;

export const WHY_US_QUERY = groq`*[_type == "whyUsSection" && _id == "whyUsSection"][0]{
	badge,
	title,
	description,
	leftPills,
	rightPills
}`;

const EVENT_PROJECTION = groq`{
	_id,
	slug,
	title,
	summary,
	startDate,
	endDate,
	recurring,
	location,
	banner,
	featured,
	status,
	"season": season->{ _id, slug, name, kind, accentColor }
}`;

export const FEATURED_EVENTS_QUERY = groq`*[_type == "event" && featured == true && status != "draft"]
	| order(startDate desc)[0...6]${EVENT_PROJECTION}`;

export const ALL_EVENTS_QUERY = groq`*[_type == "event" && status != "draft"]
	| order(startDate desc)${EVENT_PROJECTION}`;

export const UPCOMING_EVENTS_QUERY = groq`*[_type == "event" && status == "upcoming"]
	| order(startDate asc)${EVENT_PROJECTION}`;

export const EVENT_BY_SLUG_QUERY = groq`*[_type == "event" && slug.current == $slug][0]{
	_id,
	slug,
	title,
	summary,
	body,
	startDate,
	endDate,
	recurring,
	location,
	banner,
	gallery,
	featured,
	status,
	"season": season->{ _id, slug, name, kind, accentColor }
}`;

export const ALL_SEASONS_QUERY = groq`*[_type == "season"] | order(order asc, name.en asc){
	_id,
	slug,
	name,
	kind,
	recurringMonth,
	description,
	coverImage,
	accentColor,
	order
}`;

export const SEASON_WITH_EVENTS_QUERY = groq`*[_type == "season" && slug.current == $slug][0]{
	_id,
	slug,
	name,
	kind,
	recurringMonth,
	description,
	coverImage,
	accentColor,
	"events": *[_type == "event" && references(^._id) && status != "draft"]
		| order(startDate desc)${EVENT_PROJECTION}
}`;

export const ALL_SERVICES_QUERY = groq`*[_type == "service"] | order(order asc){
	_id,
	slug,
	title,
	description,
	bannerImage,
	order,
	layout
}`;

export const SERVICE_BY_SLUG_QUERY = groq`*[_type == "service" && slug.current == $slug][0]{
	_id,
	slug,
	title,
	description,
	bannerImage,
	order,
	layout,
	// small
	programmeTitle,
	programmeItems,
	duration,
	artists,
	planRosters[]{
		variant,
		name,
		price,
		"artists": artists[]->{ _id, name, role, photo }
	},
	gallery,
	disclaimer,
	tips{
		title,
		items
	},
	// medium
	plans,
	// big
	priceRange,
	parts[]{
		partId,
		kind,
		title,
		body,
		subsections[]{
			name,
			duration,
			options[]{
				label,
				title,
				image,
				programmeItems,
				artistTags
			},
			artists[]{
				songs,
				"artist": artist->{ _id, name, role, photo }
			}
		}
	}
}`;

export const ALL_ARTISTS_QUERY = groq`*[_type == "artist"] | order(order asc, name.en asc){
	_id,
	name,
	role,
	photo,
	bio,
	order
}`;

export const ARTIST_BY_ID_QUERY = groq`*[_type == "artist" && _id == $id][0]{
	_id,
	name,
	role,
	photo,
	bio
}`;

export const FAQ_QUERY = groq`*[_type == "faqItem" && published == true]
	| order(order asc){ _id, question, answer, order }`;

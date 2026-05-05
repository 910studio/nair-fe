import { error } from '@sveltejs/kit';
import { safeFetch } from '$lib/sanity/client';
import { SERVICE_BY_SLUG_QUERY } from '$lib/sanity/queries';
import { urlFor } from '$lib/sanity/image';
import type { Service as SanityService, SanityImage } from '$lib/sanity/types';
import type { Service as LocalService, ServiceArtist, Localized } from '$lib/types';
import type { PageServerLoad } from './$types';

/**
 * Convert a Sanity service doc to the local Service shape the existing
 * <ServiceSmall/Medium/Big/> components already render.
 */
function imgUrl(img: SanityImage | undefined, w = 1600): string {
	if (!img) return '';
	try {
		return urlFor(img).width(w).url();
	} catch {
		return '';
	}
}

function toLocalShape(s: SanityService): LocalService {
	const base = {
		slug: s.slug.current,
		title: s.title,
		bannerImage: imgUrl(s.bannerImage, 1920),
		description: s.description ?? ({ en: '', mn: '' } as Localized)
	};

	if (s.layout === 'medium') {
		return {
			...base,
			layout: 'medium',
			plans: (s.plans ?? []).map((p) => ({
				name: p.name,
				price: p.price,
				duration: p.duration,
				programmeItems: (p.programmeItems ?? []).map((i) => ({
					label: i.label,
					active: i.active ?? true
				})),
				artistTags: p.artistTags ?? []
			})),
			...(s.gallery && s.gallery.length > 0 && {
				gallery: s.gallery.map((img) => imgUrl(img, 1600)).filter(Boolean)
			}),
			...(s.tips?.title &&
				s.tips?.items?.length && {
					tips: { title: s.tips.title, items: s.tips.items }
				})
		};
	}

	if (s.layout === 'big') {
		return {
			...base,
			layout: 'big',
			...(s.priceRange && { priceRange: s.priceRange }),
			parts: (s.parts ?? []).map((p) => ({
				id: p.partId,
				...(p.kind && { kind: p.kind }),
				title: p.title,
				...(p.body && { body: p.body }),
				...(p.subsections && p.subsections.length > 0 && {
					subsections: p.subsections.map((sub) => ({
						name: sub.name,
						duration: sub.duration,
						options: (sub.options ?? []).map((opt) => ({
							label: opt.label,
							title: opt.title,
							image: imgUrl(opt.image, 600),
							programmeItems: (opt.programmeItems ?? []).map((i) => ({
								label: i.label,
								active: i.active ?? true
							})),
							artistTags: opt.artistTags ?? []
						})),
						artists: (sub.artists ?? [])
							.filter((entry) => entry.artist)
							.map<ServiceArtist>((entry) => ({
								name: entry.artist!.name,
								role: entry.artist!.role,
								image: imgUrl(entry.artist!.photo, 400),
								songs: entry.songs
							}))
					}))
				})
			})),
			...(s.gallery && s.gallery.length > 0 && {
				gallery: s.gallery.map((img) => imgUrl(img, 1600)).filter(Boolean)
			}),
			...(s.tips?.title &&
				s.tips?.items?.length && {
					tips: { title: s.tips.title, items: s.tips.items }
				})
		};
	}

	// small
	const planRosters = (s.planRosters ?? []).map((r) => ({
		variant: r.variant,
		name: r.name,
		price: r.price,
		artists: (r.artists ?? []).map<ServiceArtist>((a) => ({
			name: a.name,
			role: a.role,
			image: imgUrl(a.photo, 400)
		}))
	}));

	return {
		...base,
		layout: 'small',
		program: {
			title: s.programmeTitle ?? { en: 'Programme', mn: 'Хөтөлбөр' },
			items: (s.programmeItems ?? []).map((i) => ({
				label: i.label,
				active: i.active
			}))
		},
		duration: s.duration ?? ({ en: '', mn: '' } as Localized),
		artists: s.artists ?? ({ en: '', mn: '' } as Localized),
		...(planRosters.length > 0 && { plans: planRosters }),
		...(s.gallery && s.gallery.length > 0 && {
			gallery: s.gallery.map((img) => imgUrl(img, 1600)).filter(Boolean)
		}),
		...(s.disclaimer && { disclaimer: s.disclaimer }),
		...(s.tips?.title &&
			s.tips?.items?.length && {
				tips: { title: s.tips.title, items: s.tips.items }
			})
	};
}

export const load: PageServerLoad = async ({ params }) => {
	const fromSanity = await safeFetch<SanityService | null>(
		SERVICE_BY_SLUG_QUERY,
		{ slug: params.slug },
		null
	);
	if (!fromSanity) error(404, 'Service not found');
	return { service: toLocalShape(fromSanity) };
};

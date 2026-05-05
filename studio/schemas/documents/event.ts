import { defineType, defineField } from 'sanity';
import { StarIcon } from '@sanity/icons';

export const event = defineType({
	name: 'event',
	title: 'Арга хэмжээ',
	type: 'document',
	icon: StarIcon,
	groups: [
		{ name: 'core', title: 'Үндсэн', default: true },
		{ name: 'when', title: 'Хэзээ ба хаана' },
		{ name: 'media', title: 'Медиа' },
		{ name: 'meta', title: 'Тохиргоо' }
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Гарчиг',
			type: 'localizedString',
			group: 'core',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'slug',
			title: 'Slug (URL)',
			type: 'slug',
			group: 'core',
			options: {
				source: (doc) => (doc.title as { en?: string })?.en || ''
			},
			validation: (r) => r.required()
		}),
		defineField({
			name: 'summary',
			title: 'Товч тайлбар',
			type: 'localizedText',
			group: 'core',
			description: 'Картан дээр харагдах богино бичвэр.'
		}),
		defineField({
			name: 'body',
			title: 'Үндсэн агуулга',
			type: 'localizedRichText',
			group: 'core'
		}),
		defineField({
			name: 'season',
			title: 'Улирал / Ангилал',
			type: 'reference',
			to: [{ type: 'season' }],
			group: 'when',
			description: 'Уламжлалт баяр эсвэл арга хэмжээний улирлыг сонгоно.'
		}),
		defineField({
			name: 'startDate',
			title: 'Эхлэх огноо',
			type: 'datetime',
			group: 'when'
		}),
		defineField({
			name: 'endDate',
			title: 'Дуусах огноо',
			type: 'datetime',
			group: 'when'
		}),
		defineField({
			name: 'recurring',
			title: 'Жил бүр давтагдах',
			type: 'boolean',
			group: 'when',
			description: 'Огнооноос үл хамаараад жил бүр болдог бол тэмдэглэнэ.',
			initialValue: false
		}),
		defineField({
			name: 'location',
			title: 'Байршил',
			type: 'localizedString',
			group: 'when'
		}),
		defineField({
			name: 'banner',
			title: 'Толгой зураг',
			type: 'image',
			group: 'media',
			options: { hotspot: true }
		}),
		defineField({
			name: 'gallery',
			title: 'Зургийн цомог',
			type: 'array',
			group: 'media',
			of: [{ type: 'image', options: { hotspot: true } }]
		}),
		defineField({
			name: 'featured',
			title: 'Онцлох',
			type: 'boolean',
			group: 'meta',
			description: 'Нүүр хуудсанд харуулна.',
			initialValue: false
		}),
		defineField({
			name: 'status',
			title: 'Төлөв',
			type: 'string',
			group: 'meta',
			options: {
				list: [
					{ title: 'Ноорог', value: 'draft' },
					{ title: 'Удахгүй', value: 'upcoming' },
					{ title: 'Өнгөрсөн', value: 'past' },
					{ title: 'Цуцалсан', value: 'cancelled' }
				]
			},
			initialValue: 'upcoming'
		})
	],
	orderings: [
		{
			title: 'Эхлэх огноо — шинэ нь эхэнд',
			name: 'startDateDesc',
			by: [{ field: 'startDate', direction: 'desc' }]
		},
		{
			title: 'Эхлэх огноо — хуучин нь эхэнд',
			name: 'startDateAsc',
			by: [{ field: 'startDate', direction: 'asc' }]
		}
	],
	preview: {
		select: {
			title: 'title.mn',
			seasonName: 'season.name.mn',
			startDate: 'startDate',
			featured: 'featured',
			media: 'banner'
		},
		prepare: ({ title, seasonName, startDate, featured, media }) => ({
			title: `${featured ? '★ ' : ''}${title || '(нэргүй)'}`,
			subtitle: [seasonName, startDate?.split('T')[0]].filter(Boolean).join(' · '),
			media
		})
	}
});

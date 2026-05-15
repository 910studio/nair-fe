import { defineType, defineField } from 'sanity';
import { CalendarIcon } from '@sanity/icons';
import { maxImageSize } from '../lib/maxFileSize';

export const season = defineType({
	name: 'season',
	title: 'Улирал / Ангилал',
	type: 'document',
	icon: CalendarIcon,
	description: 'Уламжлалт баяр (Цагаан сар, Наадам) эсвэл арга хэмжээний улирал.',
	fields: [
		defineField({
			name: 'name',
			title: 'Нэр',
			type: 'localizedString',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'slug',
			title: 'Slug (URL)',
			type: 'slug',
			options: {
				source: (doc) => (doc.name as { en?: string })?.en || ''
			},
			validation: (r) => r.required()
		}),
		defineField({
			name: 'kind',
			title: 'Төрөл',
			type: 'string',
			options: {
				list: [
					{ title: 'Уламжлалт (жил бүр)', value: 'recurring' },
					{ title: 'Цагийн улирал (өвөл, зун, гэх мэт)', value: 'calendar' },
					{ title: 'Нэг удаагийн кампанит ажил', value: 'campaign' }
				],
				layout: 'radio'
			},
			initialValue: 'recurring',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'recurringMonth',
			title: 'Тохиолдох сар',
			type: 'string',
			description: "жишээ: 'Хоёрдугаар сар (билгийн тооллоор)', '7-р сарын 11–13'.",
			hidden: ({ parent }) => parent?.kind !== 'recurring'
		}),
		defineField({
			name: 'description',
			title: 'Тайлбар',
			type: 'localizedText'
		}),
		defineField({
			name: 'coverImage',
			title: 'Толгой зураг',
			type: 'image',
			description: '16:9, ~1920×1080. <4MB.',
			options: { hotspot: true },
			validation: maxImageSize(4)
		}),
		defineField({
			name: 'accentColor',
			title: 'Өнгөний өргөлт',
			type: 'string',
			description: 'Hex код жишээ: #36F. Улирлын картууд дээр өнгө орохоор хэрэглэгдэнэ.'
		}),
		defineField({
			name: 'order',
			title: 'Эрэмбэ',
			type: 'number',
			description: 'Бага тоо нь эхэнд харагдана.',
			initialValue: 100
		})
	],
	orderings: [
		{
			title: 'Эрэмбээр',
			name: 'displayOrder',
			by: [{ field: 'order', direction: 'asc' }]
		}
	],
	preview: {
		select: { title: 'name.mn', subtitle: 'kind', media: 'coverImage' },
		prepare: ({ title, subtitle, media }) => ({
			title: title || '(нэргүй)',
			subtitle,
			media
		})
	}
});

import { defineType, defineField } from 'sanity';
import { HelpCircleIcon } from '@sanity/icons';

export const faqItem = defineType({
	name: 'faqItem',
	title: 'Түгээмэл асуулт',
	type: 'document',
	icon: HelpCircleIcon,
	fields: [
		defineField({
			name: 'question',
			title: 'Асуулт',
			type: 'localizedString',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'answer',
			title: 'Хариулт',
			type: 'localizedText',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'order',
			title: 'Эрэмбэ',
			type: 'number',
			description: 'Бага тоо нь эхэнд харагдана.',
			initialValue: 100
		}),
		defineField({
			name: 'published',
			title: 'Нийтлэх',
			type: 'boolean',
			description: 'Унтраавал сайт дээр харагдахгүй.',
			initialValue: true
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
		select: { title: 'question.mn', published: 'published' },
		prepare: ({ title, published }) => ({
			title: title || '(асуултгүй)',
			subtitle: published ? '● нийтлэгдсэн' : '○ нуугдсан'
		})
	}
});

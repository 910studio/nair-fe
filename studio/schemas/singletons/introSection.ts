import { defineType, defineField } from 'sanity';
import { TextIcon } from '@sanity/icons';

export const introSection = defineType({
	name: 'introSection',
	title: 'Танилцуулга хэсэг',
	type: 'document',
	icon: TextIcon,
	groups: [
		{ name: 'copy', title: 'Бичвэр' },
		{ name: 'cta', title: 'Үйлдлийн товч' },
		{ name: 'media', title: 'Медиа' }
	],
	fields: [
		defineField({
			name: 'bodySegments',
			title: 'Бичвэр — хэсгүүд',
			type: 'array',
			group: 'copy',
			description:
				'Догол мөрийг хэсэг хэсгээр нь хуваан бичнэ. Тодорхой харагдуулах хэсэгт "Онцлох" гэсэн товчийг идэвхжүүлнэ. Зайг яг бичсэн ёсоор нь авна.',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'text', title: 'Бичвэр', type: 'localizedString' }),
						defineField({
							name: 'emphasized',
							title: 'Онцлох',
							type: 'boolean',
							initialValue: false
						})
					],
					preview: {
						select: { title: 'text.mn', emphasized: 'emphasized' },
						prepare({ title, emphasized }) {
							return {
								title: title || '(хоосон)',
								subtitle: emphasized ? '★ онцолсон' : 'жирийн'
							};
						}
					}
				}
			]
		}),
		defineField({
			name: 'ctaLabel',
			title: 'Товчны нэр',
			type: 'localizedString',
			group: 'cta'
		}),
		defineField({
			name: 'ctaHref',
			title: 'Товчны холбоос',
			type: 'string',
			group: 'cta',
			description: "жишээ: '/services'",
			initialValue: '/services'
		}),
		defineField({
			name: 'image',
			title: 'Зураг',
			type: 'image',
			group: 'media',
			options: { hotspot: true }
		})
	],
	preview: {
		prepare: () => ({ title: 'Танилцуулга хэсэг' })
	}
});

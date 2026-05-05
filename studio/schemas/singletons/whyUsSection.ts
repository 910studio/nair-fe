import { defineType, defineField } from 'sanity';
import { StarIcon } from '@sanity/icons';

export const whyUsSection = defineType({
	name: 'whyUsSection',
	title: 'Яагаад бид хэсэг',
	type: 'document',
	icon: StarIcon,
	groups: [
		{ name: 'intro', title: 'Танилцуулга' },
		{ name: 'pills', title: 'Шошго' }
	],
	fields: [
		defineField({
			name: 'badge',
			title: 'Тэмдэглэгээ',
			type: 'localizedString',
			group: 'intro',
			description: 'Гарчгийн дээр харагдах жижиг таних тэмдэг.'
		}),
		defineField({
			name: 'title',
			title: 'Гарчиг',
			type: 'localizedString',
			group: 'intro'
		}),
		defineField({
			name: 'description',
			title: 'Тайлбар',
			type: 'localizedText',
			group: 'intro'
		}),
		defineField({
			name: 'leftPills',
			title: 'Зүүн талын шошгууд',
			type: 'array',
			group: 'pills',
			description: '4 шошго. 2-р ба 3-р шошго нь дотогшоо илүү ороосон харагдана.',
			of: [{ type: 'localizedString' }],
			validation: (r) => r.max(4)
		}),
		defineField({
			name: 'rightPills',
			title: 'Баруун талын шошгууд',
			type: 'array',
			group: 'pills',
			description: '4 шошго. 2-р ба 3-р шошго нь дотогшоо илүү ороосон харагдана.',
			of: [{ type: 'localizedString' }],
			validation: (r) => r.max(4)
		})
	],
	preview: {
		prepare: () => ({ title: 'Яагаад бид хэсэг' })
	}
});

import { defineType, defineField } from 'sanity';
import { ThListIcon } from '@sanity/icons';

export const disciplinesSection = defineType({
	name: 'disciplinesSection',
	title: 'Уран бүтээл хэсэг',
	type: 'document',
	icon: ThListIcon,
	fields: [
		defineField({
			name: 'title',
			title: 'Хэсгийн гарчиг',
			type: 'localizedString'
		}),
		defineField({
			name: 'cards',
			title: 'Уран бүтээлийн картууд',
			type: 'array',
			description:
				'9 карт оруулна. Эхний 4 нь дээд эгнээнд, дараагийн 3 нь дунд эгнээнд, сүүлчийн 2 нь доод эгнээнд харагдана.',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'title', title: 'Гарчиг', type: 'localizedString' }),
						defineField({
							name: 'image',
							title: 'Зураг',
							type: 'image',
							options: { hotspot: true }
						})
					],
					preview: {
						select: { title: 'title.mn', media: 'image' }
					}
				}
			]
		})
	],
	preview: {
		prepare: () => ({ title: 'Уран бүтээл хэсэг' })
	}
});

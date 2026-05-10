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
				'9 карт оруулна. Эхний 4 нь дээд эгнээнд, дараагийн 3 нь дунд эгнээнд, сүүлчийн 2 нь доод эгнээнд харагдана. Карт бүр дэлгэрэнгүй хуудастай.',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'title', title: 'Гарчиг', type: 'localizedString' }),
						defineField({
							name: 'slug',
							title: 'Slug (URL)',
							description:
								'Дэлгэрэнгүй хуудсын URL. Англи гарчигнаас автоматаар үүсгэж болно.',
							type: 'slug',
							options: {
								source: (_doc, ctx) => {
									const parent = ctx.parent as { title?: { en?: string; mn?: string } };
									return parent?.title?.en || parent?.title?.mn || '';
								},
								maxLength: 96
							}
						}),
						defineField({
							name: 'image',
							title: 'Карт зураг',
							type: 'image',
							options: { hotspot: true }
						}),
						defineField({
							name: 'heroImage',
							title: 'Дэлгэрэнгүй хуудасны том зураг (сонголтоор)',
							description:
								'Хоосон бол карт зургийг ашиглана. Илүү өндөр нягтралтай эсвэл өөр кадр хэрэгтэй бол энд оруулна.',
							type: 'image',
							options: { hotspot: true }
						}),
						defineField({
							name: 'tagline',
							title: 'Дэлгэрэнгүй — товч (сонголтоор)',
							description: 'Гарчгийн дээр харагдах товч мөр.',
							type: 'localizedString'
						}),
						defineField({
							name: 'description',
							title: 'Дэлгэрэнгүй — бичвэр',
							type: 'localizedText'
						}),
						defineField({
							name: 'gallery',
							title: 'Дэлгэрэнгүй — зургийн цомог (сонголтоор)',
							type: 'array',
							of: [{ type: 'image', options: { hotspot: true } }]
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

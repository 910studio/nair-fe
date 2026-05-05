import { defineType, defineField } from 'sanity';
import { UsersIcon } from '@sanity/icons';

export const collabsSection = defineType({
	name: 'collabsSection',
	title: 'Хамтрагчид хэсэг',
	type: 'document',
	icon: UsersIcon,
	fields: [
		defineField({
			name: 'title',
			title: 'Хэсгийн гарчиг',
			type: 'localizedString'
		}),
		defineField({
			name: 'partners',
			title: 'Хамтрагчдын лого',
			type: 'array',
			description: 'Хэвтээ чиглэлд автоматаар гүйх форматтай.',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'name',
							title: 'Нэр',
							type: 'string',
							description: 'Дотоод нэр. Зургийн alt текстэд хэрэглэгдэнэ.'
						}),
						defineField({
							name: 'logo',
							title: 'Лого (тунгалаг дэвсгэр дээр цагаан)',
							type: 'image',
							description:
								'Тэмдэг ба нэрийг агуулсан бүтэн лого. ~48px өндөртэй харагдана.',
							options: { hotspot: true, accept: 'image/svg+xml,image/png' }
						})
					],
					preview: {
						select: { title: 'name', media: 'logo' }
					}
				}
			]
		})
	],
	preview: {
		prepare: () => ({ title: 'Хамтрагчид хэсэг' })
	}
});

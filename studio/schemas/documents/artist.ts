import { defineType, defineField } from 'sanity';
import { UserIcon } from '@sanity/icons';

export const artist = defineType({
	name: 'artist',
	title: 'Уран бүтээлч',
	type: 'document',
	icon: UserIcon,
	description:
		'Дахин ашиглагдах уран бүтээлч. Үйлчилгээний багцуудаас энд reference хийнэ.',
	fields: [
		defineField({
			name: 'name',
			title: 'Нэр',
			type: 'localizedString',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'role',
			title: 'Үүрэг / Цол',
			type: 'localizedString',
			description: "жишээ: 'Морин хуурч' / 'МУГЖ'"
		}),
		defineField({
			name: 'photo',
			title: 'Зураг',
			type: 'image',
			options: { hotspot: true }
		}),
		defineField({
			name: 'bio',
			title: 'Намтар',
			type: 'localizedText',
			description: 'Сонголтоор. Уран бүтээлчийн дэлгэрэнгүй хуудсанд (одоохондоо холбогдоогүй).'
		}),
		defineField({
			name: 'order',
			title: 'Эрэмбэ',
			type: 'number',
			initialValue: 100
		})
	],
	orderings: [
		{
			title: 'Эрэмбээр',
			name: 'displayOrder',
			by: [{ field: 'order', direction: 'asc' }]
		},
		{
			title: 'Нэрээр (en)',
			name: 'nameAsc',
			by: [{ field: 'name.en', direction: 'asc' }]
		}
	],
	preview: {
		select: { title: 'name.mn', subtitle: 'role.mn', media: 'photo' },
		prepare: ({ title, subtitle, media }) => ({
			title: title || '(нэргүй)',
			subtitle: subtitle || '',
			media
		})
	}
});

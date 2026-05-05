import { defineType, defineField } from 'sanity';

export const localizedString = defineType({
	name: 'localizedString',
	title: 'Олон хэлтэй текст',
	type: 'object',
	fields: [
		defineField({ name: 'en', title: 'Англи (EN)', type: 'string' }),
		defineField({ name: 'mn', title: 'Монгол (MN)', type: 'string' })
	],
	options: { columns: 2 }
});

export const localizedText = defineType({
	name: 'localizedText',
	title: 'Олон хэлтэй урт текст',
	type: 'object',
	fields: [
		defineField({ name: 'en', title: 'Англи (EN)', type: 'text', rows: 4 }),
		defineField({ name: 'mn', title: 'Монгол (MN)', type: 'text', rows: 4 })
	],
	options: { columns: 2 }
});

export const localizedRichText = defineType({
	name: 'localizedRichText',
	title: 'Олон хэлтэй баялаг текст',
	type: 'object',
	fields: [
		defineField({
			name: 'en',
			title: 'Англи (EN)',
			type: 'array',
			of: [{ type: 'block' }]
		}),
		defineField({
			name: 'mn',
			title: 'Монгол (MN)',
			type: 'array',
			of: [{ type: 'block' }]
		})
	]
});

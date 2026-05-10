import { defineType, defineField } from 'sanity';
import { CogIcon } from '@sanity/icons';

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Сайтын тохиргоо',
	type: 'document',
	icon: CogIcon,
	groups: [
		{ name: 'contact', title: 'Холбоо барих', default: true },
		{ name: 'serviceLabels', title: 'Үйлчилгээний хуудасны шошго' },
		{ name: 'social', title: 'Сошиал' },
		{ name: 'footer', title: 'Хөлийн хэсэг' }
	],
	fields: [
		defineField({
			name: 'phone',
			title: 'Утасны дугаар',
			type: 'string',
			group: 'contact',
			description: 'Сайт даяар "Холбогдох" товчинд хэрэглэгдэнэ.'
		}),
		defineField({
			name: 'socials',
			title: 'Сошиал холбоосууд',
			type: 'array',
			group: 'social',
			description: 'Хөлийн хэсэгт facebook, instagram, youtube гурвыг харуулна.',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'platform',
							title: 'Платформ',
							type: 'string',
							options: {
								list: [
									{ title: 'Facebook', value: 'facebook' },
									{ title: 'Instagram', value: 'instagram' },
									{ title: 'YouTube', value: 'youtube' },
									{ title: 'TikTok', value: 'tiktok' },
									{ title: 'Бусад', value: 'other' }
								]
							}
						},
						{ name: 'url', title: 'Холбоос (URL)', type: 'url' }
					],
					preview: {
						select: { title: 'platform', subtitle: 'url' }
					}
				}
			]
		}),
		defineField({
			name: 'serviceLabelPrice',
			title: 'Үнийн шошго',
			type: 'localizedString',
			group: 'serviceLabels',
			description: "Үйлчилгээний хуудасны үнийн хайрцаг (жишээ: 'Хөтөлбөрийн үнэ')."
		}),
		defineField({
			name: 'serviceContactLabel',
			title: 'Холбоо барих шошго',
			type: 'localizedString',
			group: 'serviceLabels',
			description: "Холбоо барих хайрцгийн дээрх жижиг текст (жишээ: 'Бидэнтэй холбогдох')."
		}),
		defineField({
			name: 'serviceContactCta',
			title: 'Холбоо барих товчийн текст',
			type: 'localizedString',
			group: 'serviceLabels',
			description: "Утас руу залгах товчны бичвэр (жишээ: 'Утсаар холбогдох')."
		}),
		defineField({
			name: 'footerCopyright',
			title: 'Хөлийн зохиогчийн эрх',
			type: 'localizedString',
			description: "{year} placeholder ашиглана. Жишээ: '© {year} Nair Entertainment.'",
			group: 'footer'
		})
	],
	preview: {
		prepare: () => ({ title: 'Сайтын тохиргоо' })
	}
});

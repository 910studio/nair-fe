import { defineType, defineField } from 'sanity';
import { ComponentIcon } from '@sanity/icons';

export const service = defineType({
	name: 'service',
	title: 'Үйлчилгээ',
	type: 'document',
	icon: ComponentIcon,
	groups: [
		{ name: 'core', title: 'Үндсэн', default: true },
		{ name: 'layout', title: 'Загварын агуулга' }
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Гарчиг',
			type: 'localizedString',
			group: 'core',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'slug',
			title: 'Slug (URL)',
			type: 'slug',
			group: 'core',
			options: {
				source: (doc) => (doc.title as { en?: string })?.en || ''
			},
			validation: (r) => r.required()
		}),
		defineField({
			name: 'description',
			title: 'Тайлбар',
			type: 'localizedText',
			group: 'core'
		}),
		defineField({
			name: 'bannerImage',
			title: 'Толгой зураг',
			type: 'image',
			group: 'core',
			options: { hotspot: true }
		}),
		defineField({
			name: 'order',
			title: 'Эрэмбэ',
			type: 'number',
			group: 'core',
			initialValue: 100
		}),
		defineField({
			name: 'layout',
			title: 'Загвар',
			type: 'string',
			group: 'layout',
			options: {
				list: [
					{ title: 'Жижиг (хөтөлбөр + үргэлжлэх хугацаа + уран бүтээлчид)', value: 'small' },
					{ title: 'Дунд (үнийн багцууд)', value: 'medium' },
					{ title: 'Том (олон үе шат)', value: 'big' }
				],
				layout: 'radio'
			},
			validation: (r) => r.required(),
			initialValue: 'small'
		}),

		// ── small layout ──────────────────────────────────
		defineField({
			name: 'programmeTitle',
			title: 'Хөтөлбөрийн гарчиг',
			type: 'localizedString',
			group: 'layout',
			hidden: ({ document }) => document?.layout !== 'small'
		}),
		defineField({
			name: 'programmeItems',
			title: 'Хөтөлбөрийн жагсаалт',
			type: 'array',
			group: 'layout',
			hidden: ({ document }) => document?.layout !== 'small',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'label', title: 'Нэр', type: 'localizedString' },
						{ name: 'active', title: 'Идэвхтэй', type: 'boolean', initialValue: true }
					],
					preview: {
						select: { title: 'label.en', active: 'active' },
						prepare: ({ title, active }) => ({
							title: title || '(нэргүй)',
							subtitle: active ? '● идэвхтэй' : '○ идэвхгүй'
						})
					}
				}
			]
		}),
		defineField({
			name: 'duration',
			title: 'Үргэлжлэх хугацаа',
			type: 'localizedString',
			group: 'layout',
			hidden: ({ document }) => document?.layout !== 'small'
		}),
		defineField({
			name: 'artists',
			title: 'Уран бүтээлчид (товч бичвэр)',
			type: 'localizedString',
			group: 'layout',
			description: "Тоог нь дурдсан товч бичвэр. жишээ: 'Морин хуурч — 1   Дуучин — 1'",
			hidden: ({ document }) => document?.layout !== 'small'
		}),
		defineField({
			name: 'planRosters',
			title: 'Багцын төлөвлөгөө',
			type: 'array',
			group: 'layout',
			hidden: ({ document }) => document?.layout !== 'small',
			description:
				'Сонголтоор. Багцын нэр + үнэ + уран бүтээлчдийн жагсаалттай хүснэгт болон харагдана.',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'variant',
							type: 'string',
							title: 'Харагдах хувилбар',
							options: {
								list: [
									{ title: 'Үндсэн', value: 'default' },
									{ title: 'Plus (онцлох)', value: 'plus' }
								]
							},
							initialValue: 'default'
						}),
						defineField({
							name: 'name',
							type: 'localizedString',
							title: 'Багцын нэр',
							validation: (r) => r.required()
						}),
						defineField({
							name: 'price',
							type: 'localizedString',
							title: 'Үнэ',
							validation: (r) => r.required()
						}),
						defineField({
							name: 'artists',
							type: 'array',
							title: 'Энэ багцын уран бүтээлчид',
							of: [{ type: 'reference', to: [{ type: 'artist' }] }]
						})
					],
					preview: {
						select: { title: 'name.mn', subtitle: 'price.mn', variant: 'variant' },
						prepare: ({ title, subtitle, variant }) => ({
							title: `${variant === 'plus' ? '★ ' : ''}${title || '(нэргүй багц)'}`,
							subtitle: subtitle || ''
						})
					}
				}
			]
		}),
		defineField({
			name: 'gallery',
			title: 'Зургийн цомог',
			type: 'array',
			group: 'layout',
			description: 'Сонголтоор. Багцуудын доор слайдер хэлбэрээр харагдана.',
			of: [{ type: 'image', options: { hotspot: true } }]
		}),
		defineField({
			name: 'disclaimer',
			title: 'Тэмдэглэл / анхааруулга',
			type: 'localizedText',
			group: 'layout',
			hidden: ({ document }) => document?.layout !== 'small',
			description: 'Сонголтоор. Жижиг анхааруулах хайрцаг (жишээ: цуцлалтын нөхцөл).'
		}),
		defineField({
			name: 'tips',
			title: 'Зөвлөмж хэсэг',
			type: 'object',
			group: 'layout',
			description: 'Сонголтоор. "Анхаарах зүйл" жагсаалт харуулна.',
			fields: [
				defineField({ name: 'title', type: 'localizedString', title: 'Хэсгийн гарчиг' }),
				defineField({
					name: 'items',
					type: 'array',
					title: 'Зөвлөмжүүд',
					of: [{ type: 'localizedString' }]
				})
			]
		}),

		// ── medium layout ─────────────────────────────────
		defineField({
			name: 'plans',
			title: 'Багцууд',
			type: 'array',
			group: 'layout',
			hidden: ({ document }) => document?.layout !== 'medium',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'name', title: 'Багцын нэр', type: 'localizedString' },
						{ name: 'price', title: 'Үнэ', type: 'localizedString' },
						{ name: 'duration', title: 'Үргэлжлэх хугацаа', type: 'localizedString' },
						{
							name: 'programmeItems',
							title: 'Хөтөлбөрийн жагсаалт',
							type: 'array',
							of: [
								{
									type: 'object',
									fields: [
										{ name: 'label', title: 'Нэр', type: 'localizedString' },
										{
											name: 'active',
											title: 'Идэвхтэй',
											type: 'boolean',
											initialValue: true
										}
									],
									preview: {
										select: { title: 'label.mn', active: 'active' },
										prepare: ({ title, active }) => ({
											title: title || '(нэргүй)',
											subtitle: active ? '● идэвхтэй' : '○ идэвхгүй'
										})
									}
								}
							]
						},
						{
							name: 'artistTags',
							title: 'Уран бүтээлчдийн шошго',
							description: 'Жижиг шошго болон харагдана. Жишээ: "1 морин хуурч", "5 хөгжимчид"',
							type: 'array',
							of: [{ type: 'localizedString' }]
						}
					],
					preview: {
						select: { title: 'name.mn', subtitle: 'price.mn' }
					}
				}
			]
		}),

		// ── big layout ────────────────────────────────────
		defineField({
			name: 'priceRange',
			title: 'Үнийн хязгаар',
			type: 'localizedString',
			group: 'layout',
			description: "жишээ: '10,000,000₮ - 18,000,000₮'",
			hidden: ({ document }) => document?.layout !== 'big'
		}),
		defineField({
			name: 'parts',
			title: 'Үе шатууд',
			type: 'array',
			group: 'layout',
			hidden: ({ document }) => document?.layout !== 'big',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'partId', type: 'string', title: 'Үе шатны ID', description: 'жишээ: part-1' },
						{
							name: 'kind',
							title: 'Төрөл',
							type: 'string',
							description: 'CTA сонговол сайдбар-аас алгасна, дунд завсрын карт болгоно.',
							options: {
								list: [
									{ title: 'Стандарт хэсэг', value: 'section' },
									{ title: 'Завсрын CTA карт', value: 'cta' }
								],
								layout: 'radio'
							},
							initialValue: 'section'
						},
						{ name: 'title', title: 'Гарчиг', type: 'localizedString' },
						{
							name: 'body',
							title: 'Бичвэр (нэмэлт)',
							type: 'localizedText',
							description: 'Дэд хэсэг ашиглахгүй бол энд бичнэ үү.'
						},
						{
							name: 'subsections',
							title: 'Дэд хэсгүүд',
							type: 'array',
							description:
								'Үе шатанд багтах дэд блокууд. Тус бүрд нэр, үргэлжлэх хугацаа, 3 хүртэл сонголтын карт.',
							of: [
								{
									type: 'object',
									fields: [
										{
											name: 'name',
											title: 'Дэд хэсгийн нэр',
											type: 'localizedString'
										},
										{
											name: 'duration',
											title: 'Үргэлжлэх хугацаа',
											type: 'localizedString'
										},
										{
											name: 'options',
											title: 'Сонголтууд',
											type: 'array',
											of: [
												{
													type: 'object',
													fields: [
														{
															name: 'label',
															title: 'Шошго (жишээ: "Сонголт 1")',
															type: 'localizedString'
														},
														{
															name: 'title',
															title: 'Сонголтын нэр',
															type: 'localizedString'
														},
														{
															name: 'image',
															title: 'Зураг',
															type: 'image',
															options: { hotspot: true }
														},
														{
															name: 'programmeItems',
															title: 'Хөтөлбөрийн жагсаалт',
															type: 'array',
															of: [
																{
																	type: 'object',
																	fields: [
																		{ name: 'label', title: 'Нэр', type: 'localizedString' },
																		{
																			name: 'active',
																			title: 'Идэвхтэй',
																			type: 'boolean',
																			initialValue: true
																		}
																	],
																	preview: {
																		select: { title: 'label.mn', active: 'active' },
																		prepare: ({ title, active }) => ({
																			title: title || '(нэргүй)',
																			subtitle: active ? '● идэвхтэй' : '○ идэвхгүй'
																		})
																	}
																}
															]
														},
														{
															name: 'artistTags',
															title: 'Уран бүтээлчдийн шошго',
															description: 'жишээ: "3 морин хуур", "1 их хуур"',
															type: 'array',
															of: [{ type: 'localizedString' }]
														}
													],
													preview: {
														select: {
															title: 'title.mn',
															subtitle: 'label.mn',
															media: 'image'
														}
													}
												}
											]
										},
										{
											name: 'artists',
											title: 'Уран бүтээлчдийн жагсаалт',
											description:
												'Дэд хэсэгт уран бүтээлчдийн карт. Тус бүрд reference + дуулах дуунууд (сонголтоор).',
											type: 'array',
											of: [
												{
													type: 'object',
													fields: [
														{
															name: 'artist',
															title: 'Уран бүтээлч',
															type: 'reference',
															to: [{ type: 'artist' }]
														},
														{
															name: 'songs',
															title: 'Дуулах дуунууд (мөр бүрд нэг дуу)',
															type: 'localizedText'
														}
													],
													preview: {
														select: {
															title: 'artist.name.mn',
															subtitle: 'artist.role.mn',
															media: 'artist.photo'
														}
													}
												}
											]
										}
									],
									preview: {
										select: { title: 'name.mn', subtitle: 'duration.mn' }
									}
								}
							]
						}
					],
					preview: {
						select: { title: 'title.mn', subtitle: 'partId' }
					}
				}
			]
		}),

		// ── Logo belt (optional, per-service) ─────────────
		defineField({
			name: 'logoBeltTitle',
			title: 'Лого хаяган дээрх гарчиг',
			type: 'localizedString',
			group: 'core',
			description: 'Хоосон бол хуудсанд лого хаяг харагдахгүй.'
		}),
		defineField({
			name: 'logoBeltPartners',
			title: 'Лого хаяг (хамтрагчид)',
			type: 'array',
			group: 'core',
			description: 'Энэ үйлчилгээний хуудсанд харуулах хамтрагчдын лого.',
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
							description: 'Тэмдэг ба нэрийг агуулсан бүтэн лого. ~48px өндөртэй харагдана.',
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
	orderings: [
		{
			title: 'Эрэмбээр',
			name: 'displayOrder',
			by: [{ field: 'order', direction: 'asc' }]
		}
	],
	preview: {
		select: { title: 'title.mn', subtitle: 'layout', media: 'bannerImage' },
		prepare: ({ title, subtitle, media }) => ({
			title: title || '(нэргүй)',
			subtitle: `загвар: ${subtitle}`,
			media
		})
	}
});

import type { StructureResolver } from 'sanity/structure';
import {
	CogIcon,
	PlayIcon,
	StarIcon,
	CalendarIcon,
	ComponentIcon,
	HelpCircleIcon,
	TextIcon,
	ThListIcon,
	UsersIcon,
	UserIcon
} from '@sanity/icons';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

export const structure: StructureResolver = (S, context) =>
	S.list()
		.title('Nair Entertainment CMS')
		.items([
			S.listItem()
				.title('Сайтын тохиргоо')
				.icon(CogIcon)
				.child(S.document().schemaType('siteSettings').documentId('siteSettings')),
			S.listItem()
				.title('Нүүр — Толгой')
				.icon(PlayIcon)
				.child(S.document().schemaType('heroSection').documentId('heroSection')),
			S.listItem()
				.title('Нүүр — Танилцуулга')
				.icon(TextIcon)
				.child(S.document().schemaType('introSection').documentId('introSection')),
			S.listItem()
				.title('Нүүр — Уран бүтээлүүд')
				.icon(ThListIcon)
				.child(S.document().schemaType('disciplinesSection').documentId('disciplinesSection')),
			S.listItem()
				.title('Нүүр — Хамтрагчид')
				.icon(UsersIcon)
				.child(S.document().schemaType('collabsSection').documentId('collabsSection')),
			S.listItem()
				.title('Нүүр — Яагаад бид')
				.icon(StarIcon)
				.child(S.document().schemaType('whyUsSection').documentId('whyUsSection')),
			S.divider(),

			S.listItem()
				.title('Арга хэмжээ')
				.icon(StarIcon)
				.child(
					S.list()
						.title('Арга хэмжээ')
						.items([
							S.listItem()
								.title('★ Онцлох')
								.child(
									S.documentList()
										.title('Онцлох арга хэмжээ')
										.filter('_type == "event" && featured == true')
										.defaultOrdering([{ field: 'startDate', direction: 'desc' }])
								),
							S.listItem()
								.title('Удахгүй болох')
								.child(
									S.documentList()
										.title('Удахгүй болох')
										.filter('_type == "event" && status == "upcoming"')
										.defaultOrdering([{ field: 'startDate', direction: 'asc' }])
								),
							S.listItem()
								.title('Өнгөрсөн')
								.child(
									S.documentList()
										.title('Өнгөрсөн')
										.filter('_type == "event" && status == "past"')
										.defaultOrdering([{ field: 'startDate', direction: 'desc' }])
								),
							S.divider(),
							S.listItem()
								.title('Бүх арга хэмжээ')
								.child(
									S.documentTypeList('event')
										.title('Бүх арга хэмжээ')
										.defaultOrdering([{ field: 'startDate', direction: 'desc' }])
								)
						])
				),

			S.listItem()
				.title('Улирал / Ангилал')
				.icon(CalendarIcon)
				.child(
					S.documentTypeList('season')
						.title('Улирал')
						.defaultOrdering([{ field: 'order', direction: 'asc' }])
				),

			S.divider(),

			orderableDocumentListDeskItem({
				type: 'service',
				title: 'Үйлчилгээ',
				icon: ComponentIcon,
				S,
				context
			}),

			S.listItem()
				.title('Уран бүтээлчид')
				.icon(UserIcon)
				.child(
					S.documentTypeList('artist')
						.title('Уран бүтээлчид')
						.defaultOrdering([{ field: 'order', direction: 'asc' }])
				),

			S.listItem()
				.title('Түгээмэл асуултууд')
				.icon(HelpCircleIcon)
				.child(
					S.documentTypeList('faqItem')
						.title('Түгээмэл асуултууд')
						.defaultOrdering([{ field: 'order', direction: 'asc' }])
				)
		]);

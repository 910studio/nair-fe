import { defineType, defineField } from 'sanity';
import { PlayIcon } from '@sanity/icons';

export const heroSection = defineType({
	name: 'heroSection',
	title: 'Толгой хэсэг',
	type: 'document',
	icon: PlayIcon,
	groups: [
		{ name: 'video', title: 'Видео' },
		{ name: 'copy', title: 'Бичвэр' },
		{ name: 'cta', title: 'Үйлдлийн товч' }
	],
	fields: [
		defineField({
			name: 'videoWebm',
			title: 'Видео — WebM',
			type: 'file',
			group: 'video',
			options: { accept: 'video/webm' },
			description: 'Орчин үеийн хөтчид зориулсан хувилбар. Файлын хэмжээ багатай.'
		}),
		defineField({
			name: 'videoMp4',
			title: 'Видео — MP4',
			type: 'file',
			group: 'video',
			options: { accept: 'video/mp4' },
			description: 'Safari хөтөчид зориулсан нэмэлт. Үргэлж байршуулна уу.'
		}),
		defineField({
			name: 'videoPoster',
			title: 'Постер зураг',
			type: 'image',
			group: 'video',
			description: 'Видео ачааллах хүртэл буюу амжилтгүй болсон үед харагдана.',
			options: { hotspot: true }
		}),
		defineField({
			name: 'eyebrow',
			title: 'Жижиг тэмдэглэгээ',
			type: 'localizedString',
			group: 'copy',
			description: 'Толгой бичвэрийн дээр харагдах жижиг текст.'
		}),
		defineField({
			name: 'headline',
			title: 'Толгой бичвэр',
			type: 'localizedText',
			group: 'copy'
		}),
		defineField({
			name: 'subheadline',
			title: 'Дэд бичвэр',
			type: 'localizedText',
			group: 'copy'
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
			description: "жишээ: '/services' эсвэл 'mailto:hi@nair.mn'"
		})
	],
	preview: {
		prepare: () => ({ title: 'Толгой хэсэг' })
	}
});

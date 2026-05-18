import { defineType, defineField } from 'sanity';
import { PlayIcon } from '@sanity/icons';
import { maxFileSize, maxImageSize } from '../lib/maxFileSize';

export const heroSection = defineType({
	name: 'heroSection',
	title: 'Толгой хэсэг',
	type: 'document',
	icon: PlayIcon,
	groups: [
		{ name: 'video', title: 'Видео — Desktop' },
		{ name: 'videoMobile', title: 'Видео — Mobile' },
		{ name: 'copy', title: 'Бичвэр' },
		{ name: 'cta', title: 'Үйлдлийн товч' }
	],
	fields: [
		defineField({
			name: 'videoWebm',
			title: 'Desktop — WebM',
			type: 'file',
			group: 'video',
			options: { accept: 'video/webm' },
			description: 'Орчин үеийн хөтчид зориулсан хувилбар. 16:9, 1920×1080, <20MB.',
			validation: maxFileSize(20)
		}),
		defineField({
			name: 'videoMp4',
			title: 'Desktop — MP4',
			type: 'file',
			group: 'video',
			options: { accept: 'video/mp4' },
			description: 'Safari хөтөчид зориулсан нэмэлт. 16:9, 1920×1080, <20MB. Үргэлж байршуулна уу.',
			validation: maxFileSize(20)
		}),
		defineField({
			name: 'videoPoster',
			title: 'Desktop постер зураг',
			type: 'image',
			group: 'video',
			description: 'Видео ачааллах хүртэл буюу амжилтгүй болсон үед харагдана. <2MB.',
			options: { hotspot: true },
			validation: maxImageSize(2)
		}),
		defineField({
			name: 'videoMobileWebm',
			title: 'Mobile — WebM',
			type: 'file',
			group: 'videoMobile',
			options: { accept: 'video/webm' },
			description: 'Гар утсанд зориулсан босоо хувилбар. 9:16, 1080×1920, <10MB.',
			validation: maxFileSize(10)
		}),
		defineField({
			name: 'videoMobileMp4',
			title: 'Mobile — MP4',
			type: 'file',
			group: 'videoMobile',
			options: { accept: 'video/mp4' },
			description: 'Гар утсанд зориулсан босоо хувилбар. 9:16, 1080×1920, <10MB. Хоосон үлдвэл desktop видео ашиглана.',
			validation: maxFileSize(10)
		}),
		defineField({
			name: 'videoMobilePoster',
			title: 'Mobile постер зураг',
			type: 'image',
			group: 'videoMobile',
			description: 'Mobile видео ачааллах хүртэл харагдана. Хоосон үлдвэл desktop постер ашиглана. <2MB.',
			options: { hotspot: true },
			validation: maxImageSize(2)
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

/**
 * One-shot seed: pushes the existing static services + a few starter docs into Sanity.
 *
 * Usage:
 *   1. Fill studio/.env with SANITY_STUDIO_PROJECT_ID and SANITY_WRITE_TOKEN
 *      (write token from manage.sanity.io → API → Tokens → "Editor")
 *   2. From studio/: pnpm seed
 *
 * Idempotent: uses `createOrReplace` so you can re-run safely.
 */

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { createClient } from '@sanity/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATIC = join(__dirname, '..', '..', 'static');

// Sanity requires unique `_key` on every array item (objects and references).
const k = () => randomBytes(6).toString('hex');

function addKeysDeep<T>(value: T): T {
	if (Array.isArray(value)) {
		return value.map((item) => {
			if (item && typeof item === 'object') {
				const keyed = { ...(item as Record<string, unknown>) };
				if (!('_key' in keyed)) keyed._key = k();
				return addKeysDeep(keyed);
			}
			return item;
		}) as unknown as T;
	}
	if (value && typeof value === 'object') {
		const out: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
			out[key] = addKeysDeep(val);
		}
		return out as T;
	}
	return value;
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error('SANITY_STUDIO_PROJECT_ID missing in studio/.env');
if (!token) throw new Error('SANITY_WRITE_TOKEN missing in studio/.env');

const client = createClient({
	projectId,
	dataset,
	token,
	apiVersion: '2024-10-01',
	useCdn: false
});

// ── starter site settings ─────────────────────────────────────────────
const siteSettings = {
	_id: 'siteSettings',
	_type: 'siteSettings',
	phone: '76004455',
	socials: [
		{ platform: 'facebook', url: 'https://facebook.com/nairentertainment' },
		{ platform: 'instagram', url: 'https://instagram.com/nairentertainment' },
		{ platform: 'youtube', url: 'https://youtube.com/@nairentertainment' }
	],
	footerCopyright: {
		en: '© {year} Nair Entertainment. All rights reserved.',
		mn: '© {year} Nair Entertainment. Бүх эрх хуулиар хамгаалагдсан.'
	}
};

// ── home: hero (figma s1) ─────────────────────────────────────────────
const hero = {
	_id: 'heroSection',
	_type: 'heroSection',
	eyebrow: { en: 'Nair Entertainment', mn: 'Nair Entertainment' },
	headline: {
		en: 'Дэлгэр жаргалтай\nнайрлаарай',
		mn: 'Дэлгэр жаргалтай\nнайрлаарай'
	},
	ctaLabel: { en: 'Book us', mn: 'Захиалах' },
	ctaHref: '/inquiry'
};

// ── home: intro (figma s2) ────────────────────────────────────────────
// Body broken into 7 segments with alternating emphasis to match the figma layout.
const intro = {
	_id: 'introSection',
	_type: 'introSection',
	bodySegments: [
		{
			text: { en: 'Бид ардын ', mn: 'Бид ардын ' },
			emphasized: false
		},
		{
			text: {
				en: 'язгуур өв, орчин үеийн хэв маяг',
				mn: 'язгуур өв, орчин үеийн хэв маяг'
			},
			emphasized: true
		},
		{ text: { en: ' болон ', mn: ' болон ' }, emphasized: false },
		{
			text: { en: 'мэргэжлийн найруулгыг', mn: 'мэргэжлийн найруулгыг' },
			emphasized: true
		},
		{
			text: {
				en: ' нэгтгэн, аливаа баяр наадмыг ',
				mn: ' нэгтгэн, аливаа баяр наадмыг '
			},
			emphasized: false
		},
		{
			text: { en: 'урлагийн цогц шийдлээр', mn: 'урлагийн цогц шийдлээр' },
			emphasized: true
		},
		{ text: { en: ' амилуулдаг.', mn: ' амилуулдаг.' }, emphasized: false }
	],
	ctaLabel: { en: 'Our services', mn: 'Бидний үйлчилгээ' },
	ctaHref: '/services'
};

// ── home: disciplines (figma s3) ──────────────────────────────────────
// Cards order matches the 4 / 3 / 2 row split in figma.
const disciplineCardsSeed = [
	{ id: 'urtin-duu', title: { en: 'Long song', mn: 'Уртын дуу' } },
	{ id: 'ardiin-duu', title: { en: 'Folk song', mn: 'Ардын дуу' } },
	{ id: 'khoomii', title: { en: 'Khoomii', mn: 'Хөөмий' } },
	{ id: 'yurool', title: { en: 'Blessings & eulogies', mn: 'Ерөөл магтаал' } },
	{ id: 'mongol-bujig', title: { en: 'Mongolian dance', mn: 'Монгол бүжиг' } },
	{ id: 'uran-nugaralt', title: { en: 'Contortion', mn: 'Уран нугаралт' } },
	{ id: 'tsam-bujig', title: { en: 'Tsam dance', mn: 'Цамын бүжиг' } },
	{
		id: 'morin-khuur-quartet',
		title: { en: 'Morin khuur quartet', mn: 'Морин хуурын дөрвөл' }
	},
	{
		id: 'undesnii-khugjim',
		title: { en: 'National music ensemble', mn: 'Үндэсний хөгжмийн цөөхүүл' }
	}
];

// ── home: why us (figma s4) ───────────────────────────────────────────
const whyUs = {
	_id: 'whyUsSection',
	_type: 'whyUsSection',
	badge: { en: 'Why us?', mn: 'Яагаад бид гэж?' },
	title: {
		en: 'Найр бүр өөрийн аялгуутай',
		mn: 'Найр бүр өөрийн аялгуутай'
	},
	description: {
		en: 'Мэргэжлийн ур чадвар, нарийн төлөвлөлтийг урлагийн арвин сантай нэгтгэж, арга хэмжээ бүрт чанар, итгэлийг бүрдүүлнэ.',
		mn: 'Мэргэжлийн ур чадвар, нарийн төлөвлөлтийг урлагийн арвин сантай нэгтгэж, арга хэмжээ бүрт чанар, итгэлийг бүрдүүлнэ.'
	},
	leftPills: [
		{ en: 'Ур чадварын нэгдэл', mn: 'Ур чадварын нэгдэл' },
		{ en: 'Мэргэжлийн найруулга', mn: 'Мэргэжлийн найруулга' },
		{ en: 'Нарийн зохион байгуулалт', mn: 'Нарийн зохион байгуулалт' },
		{ en: 'Итгэлт түншлэл, итгэлцэл', mn: 'Итгэлт түншлэл, итгэлцэл' }
	],
	rightPills: [
		{ en: 'Хариуцлагатай байдал', mn: 'Хариуцлагатай байдал' },
		{ en: 'Туршлагатай хамт олон', mn: 'Туршлагатай хамт олон' },
		{ en: 'Мартагдашгүй дурсамж', mn: 'Мартагдашгүй дурсамж' },
		{ en: 'Сэтгэл ханамж', mn: 'Сэтгэл ханамж' }
	]
};

// ── home: collabs (figma s3b) ─────────────────────────────────────────
const collabs = {
	_id: 'collabsSection',
	_type: 'collabsSection',
	title: {
		en: 'Хамтран ажилласан байгууллагууд',
		mn: 'Хамтран ажилласан байгууллагууд'
	},
	partners: []
};

// ── starter seasons ───────────────────────────────────────────────────
const seasons = [
	{
		_id: 'season-tsagaan-sar',
		_type: 'season',
		name: { en: 'Tsagaan Sar', mn: 'Цагаан сар' },
		slug: { _type: 'slug', current: 'tsagaan-sar' },
		kind: 'recurring',
		recurringMonth: 'February (lunar)',
		description: {
			en: 'Lunar new year celebrations — family-rooted, ritual-rich.',
			mn: 'Цагаан сарын баяр — гэр бүлийн уламжлал, зан үйлээр баялаг.'
		},
		accentColor: '#F2C94C',
		order: 10
	},
	{
		_id: 'season-naadam',
		_type: 'season',
		name: { en: 'Naadam', mn: 'Наадам' },
		slug: { _type: 'slug', current: 'naadam' },
		kind: 'recurring',
		recurringMonth: 'July 11–13',
		description: {
			en: 'Three manly games — wrestling, archery, horse racing.',
			mn: 'Эрийн гурван наадам — бөх, сур, морин уралдаан.'
		},
		accentColor: '#3366FF',
		order: 20
	}
];

// ── starter artists ───────────────────────────────────────────────────
// Reusable performers — referenced from service plan rosters.
// Each `photoFile` resolves at upload time to a Sanity asset reference.

const artistsSeed = [
	{
		_id: 'artist-uuganbayar',
		name: { en: 'B. Uuganbayar', mn: 'Б. Ууганбаяр' },
		photoFile: 'client-materials/aritists/Image.png',
		order: 10
	},
	{
		_id: 'artist-sumiyaabat',
		name: { en: 'B. Sumiyaabat', mn: 'Б. Сумьяабат' },
		photoFile: 'client-materials/aritists/Image-1.png',
		order: 20
	},
	{
		_id: 'artist-otgonzul',
		name: { en: 'G. Otgonzul', mn: 'Г. Отгонзул' },
		photoFile: 'client-materials/aritists/Image-2.png',
		order: 30
	},
	{
		_id: 'artist-erdene-ochir',
		name: { en: 'Z. Erdene-Ochir', mn: 'З. Эрдэнэ-Очир' },
		photoFile: 'client-materials/aritists/Image-3.png',
		order: 40
	},
	{
		_id: 'artist-myagmardorj',
		name: { en: 'B. Myagmardorj', mn: 'Б. Мягмардорж' },
		photoFile: 'client-materials/aritists/Image-4.png',
		order: 50
	},
	{
		_id: 'artist-batmend',
		name: { en: 'B. Batmend', mn: 'Б. Батмэнд' },
		role: { en: "People's Artist", mn: 'МУГЖ' },
		photoFile: 'client-materials/aritists/grid-2/Image-1.png',
		order: 60
	},
	{
		_id: 'artist-byambadorj',
		name: { en: 'B. Byambadorj', mn: 'Б. Бямбадорж' },
		role: { en: 'Honored Artist', mn: 'СТА' },
		photoFile: 'client-materials/aritists/grid-2/Image.png',
		order: 70
	}
] as const;

const ref = (id: string) => ({ _type: 'reference', _ref: id });

type AssetRef = { _type: 'image'; asset: { _type: 'reference'; _ref: string } };

async function uploadImage(relPath: string): Promise<AssetRef> {
	const abs = join(STATIC, relPath);
	const buffer = readFileSync(abs);
	const filename = relPath.split('/').pop() || 'image.png';
	const asset = await client.assets.upload('image', buffer, { filename });
	return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

// ── service registry ──────────────────────────────────────────────────
// 4 small (single-programme rituals) · 2 medium (tiered packages) · 2 big (multi-stage productions)

const SMALL_PROG_TITLE = { en: 'Programme', mn: 'Хөтөлбөр' };

// Default plan rosters — every small service gets the same 2-plan setup
// (Jargaltain Delger + Plus). Each service's plans are independently
// editable in Studio after seed.
const SMALL_PLAN_ROSTERS = [
	{
		variant: 'default',
		name: { en: 'Jargaltain Delger', mn: 'Жаргалтайн дэлгэр' },
		price: { en: '600,000₮', mn: '600,000₮' },
		artists: [
			ref('artist-uuganbayar'),
			ref('artist-sumiyaabat'),
			ref('artist-otgonzul'),
			ref('artist-erdene-ochir'),
			ref('artist-myagmardorj')
		]
	},
	{
		variant: 'plus',
		name: { en: 'Jargaltain Delger Plus+', mn: 'Жаргалтайн дэлгэр Plus+' },
		price: { en: '1,000,000₮', mn: '1,000,000₮' },
		artists: [ref('artist-batmend'), ref('artist-byambadorj')]
	}
];

const SMALL_DISCLAIMER = {
	en: 'Уран бүтээлчдээс шалтгаалж хөтөлбөрийн үнэ өөр ба уран бүтээлчийг Найр энтертайнмент томилно.',
	mn: 'Уран бүтээлчдээс шалтгаалж хөтөлбөрийн үнэ өөр ба уран бүтээлчийг Найр энтертайнмент томилно.'
};

const services = [
	// ── SMALL ─────────────────────────────────────────────────────────
	{
		_id: 'service-sevleg-urgeeh',
		_type: 'service',
		slug: { _type: 'slug', current: 'sevleg-urgeeh' },
		layout: 'small',
		order: 10,
		title: { en: 'Hair-cutting ceremony', mn: 'Сэвлэг үргээх найр' },
		description: {
			en: 'We enrich the traditional hair-cutting rite with horsehead-fiddle music, blessings and folk performances — crafting an unforgettable memory for your family and guests at a professional level.',
			mn: 'Сэвлэг үргээх ёслолыг уламжлалт зан үйл, морин хуур, ерөөл магтаалаар баяжуулж, язгуур урлагийн үзүүлбэрүүдээр чимнэ. Бид гэр бүл, зочдын тань сэтгэлд хоногших мартагдашгүй дурсамжийг мэргэжлийн түвшинд бүтээнэ.'
		},
		programmeTitle: SMALL_PROG_TITLE,
		programmeItems: [
			{ active: true, label: { en: 'Opening MC', mn: 'Нээлтийн хөтлөлт' } },
			{ active: true, label: { en: 'Morin khuur melody', mn: 'Морин хуурын аяз' } },
			{ active: false, label: { en: 'Words from head of household', mn: 'Өрхийн тэргүүн үг хэлэх' } },
			{ active: true, label: { en: 'Long song', mn: 'Уртын дуу' } },
			{ active: true, label: { en: 'Festive blessing', mn: 'Найрын ерөөл' } },
			{ active: false, label: { en: 'Hair-cutting rite', mn: 'Сэвлэг үргээх ёслол' } },
			{ active: true, label: { en: 'Folk song', mn: 'Ардын дуу' } },
			{ active: true, label: { en: 'Hair-cutting song', mn: 'Сэвлэг үргээх дуу' } },
			{ active: false, label: { en: 'Inviting guests to the feast', mn: 'Зочдыг зоогонд урих' } }
		],
		duration: { en: '25–30 minutes', mn: '25–30 минут' },
		artists: {
			en: 'Morin khuur player — 1   Singer / eulogist — 1',
			mn: 'Морин хуурч — 1   Дуучин, ерөөлч — 1'
		},
		planRosters: SMALL_PLAN_ROSTERS,
		disclaimer: SMALL_DISCLAIMER,
		tips: {
			title: { en: 'Things to know', mn: 'Анхаарах зүйлс' },
			items: [
				{ en: 'Indoor venue with min. 4m ceiling.', mn: 'Дотор танхим, 4 метрээс дээш таазтай.' },
				{ en: 'Power outlet within 10m of the stage.', mn: 'Тайзнаас 10м-ийн дотор цахилгаан залгуур.' },
				{ en: 'Programme can be customised to your guest list.', mn: 'Хөтөлбөрийг зочдын тоонд тохируулан өөрчилж болно.' }
			]
		}
	},
	{
		_id: 'service-shine-geriin-nair',
		_type: 'service',
		slug: { _type: 'slug', current: 'shine-geriin-nair' },
		layout: 'small',
		order: 20,
		title: { en: 'Housewarming feast', mn: 'Шинэ гэрийн найр' },
		description: {
			en: "We bless the new home with the fire-tending rite, horsehead-fiddle music, long songs and praise — opening the doors to fortune, family and good guests.",
			mn: 'Шинэ гэрийг гал тахих ёслол, морин хуур, уртын дуу, магтаалаар адислаж — аз жаргал, гэр бүл, сайн зочдыг угтах хаалгыг нээнэ.'
		},
		programmeTitle: SMALL_PROG_TITLE,
		programmeItems: [
			{ active: true, label: { en: 'Greeting MC', mn: 'Угтах хөтлөлт' } },
			{ active: true, label: { en: 'Fire-tending rite', mn: 'Гал тахих ёслол' } },
			{ active: true, label: { en: 'Morin khuur melody', mn: 'Морин хуурын аяз' } },
			{ active: true, label: { en: 'Long song', mn: 'Уртын дуу' } },
			{ active: false, label: { en: 'Words from head of household', mn: 'Өрхийн тэргүүн үг хэлэх' } },
			{ active: true, label: { en: 'Housewarming blessing', mn: 'Гэр оршуулах ерөөл' } },
			{ active: true, label: { en: 'Folk song', mn: 'Ардын дуу' } },
			{ active: false, label: { en: 'Closing toast', mn: 'Хаалтын ерөөл' } }
		],
		duration: { en: '25–30 minutes', mn: '25–30 минут' },
		artists: {
			en: 'Morin khuur player — 1   Singer / eulogist — 1',
			mn: 'Морин хуурч — 1   Дуучин, ерөөлч — 1'
		},
		planRosters: SMALL_PLAN_ROSTERS,
		disclaimer: SMALL_DISCLAIMER
	},
	{
		_id: 'service-nasnii-nair',
		_type: 'service',
		slug: { _type: 'slug', current: 'nasnii-nair' },
		layout: 'small',
		order: 30,
		title: { en: 'Milestone birthday celebration', mn: 'Насны найр' },
		description: {
			en: "A traditional celebration honoring an elder's milestone year (60, 73, 85) — with blessings, songs and family addresses that mark the occasion.",
			mn: 'Ахмадын насны ой (60, 73, 85)-г уламжлалт ёсоор тэмдэглэж, ерөөл, дуу, гэр бүлийн үг сэтгэлд хоногших баяр болгоно.'
		},
		programmeTitle: SMALL_PROG_TITLE,
		programmeItems: [
			{ active: true, label: { en: 'Opening MC', mn: 'Нээлтийн хөтлөлт' } },
			{ active: true, label: { en: 'Birthday blessing', mn: 'Насны ерөөл' } },
			{ active: true, label: { en: 'Long song', mn: 'Уртын дуу' } },
			{ active: true, label: { en: 'Khoomii', mn: 'Хөөмий' } },
			{ active: false, label: { en: 'Family addresses', mn: 'Гэр бүлийн үг' } },
			{ active: true, label: { en: 'Folk song', mn: 'Ардын дуу' } },
			{ active: false, label: { en: 'Cake & toast', mn: 'Бялуу, хундага' } },
			{ active: true, label: { en: 'Closing', mn: 'Хаалт' } }
		],
		duration: { en: '30–40 minutes', mn: '30–40 минут' },
		artists: {
			en: 'MC — 1   Eulogist — 1   Singer — 2   Khoomii — 1',
			mn: 'Хөтлөгч — 1   Ерөөлч — 1   Дуучин — 2   Хөөмийч — 1'
		},
		planRosters: SMALL_PLAN_ROSTERS,
		disclaimer: SMALL_DISCLAIMER
	},
	{
		_id: 'service-ber-guikh-nair',
		_type: 'service',
		slug: { _type: 'slug', current: 'ber-guikh-nair' },
		layout: 'small',
		order: 40,
		title: { en: 'Bride-asking ceremony', mn: 'Бэр гуйх найр' },
		description: {
			en: 'The traditional ceremony of asking for the bride — performed with khadag, blessings and songs that honor both families and seal the bond.',
			mn: 'Хоёр айлыг тэгш хүндэтгэн, бэрийг хадаг, ерөөл, дуу хуурын ёслолоор гуйх уламжлалт зан үйл.'
		},
		programmeTitle: SMALL_PROG_TITLE,
		programmeItems: [
			{ active: true, label: { en: 'Welcome ritual', mn: 'Угтах ёслол' } },
			{ active: true, label: { en: 'Morin khuur welcome', mn: 'Морин хуурын угтаа' } },
			{ active: true, label: { en: 'Bride-asking blessing', mn: 'Бэр гуйх ерөөл' } },
			{ active: true, label: { en: 'Long song', mn: 'Уртын дуу' } },
			{ active: false, label: { en: 'Khadag exchange', mn: 'Хадаг солилцох' } },
			{ active: true, label: { en: 'Family blessing', mn: 'Гэр бүлийн ерөөл' } },
			{ active: false, label: { en: 'Closing', mn: 'Хаалт' } }
		],
		duration: { en: '25–30 minutes', mn: '25–30 минут' },
		artists: {
			en: 'Morin khuur player — 1   Eulogist — 1   Singer — 1',
			mn: 'Морин хуурч — 1   Ерөөлч — 1   Дуучин — 1'
		},
		planRosters: SMALL_PLAN_ROSTERS,
		disclaimer: SMALL_DISCLAIMER
	},

	// ── MEDIUM ────────────────────────────────────────────────────────
	{
		_id: 'service-juulchdiin-toglolt',
		_type: 'service',
		slug: { _type: 'slug', current: 'juulchdiin-toglolt' },
		layout: 'medium',
		order: 50,
		title: { en: 'Tourist performance', mn: 'Жуулчдын тоглолт' },
		description: {
			en: 'A curated showcase of Mongolian heritage arts for international guests — three formats, from intimate to full ensemble.',
			mn: 'Гадаад зочдод зориулсан монгол уран бүтээлийн онцлох тоглолт — гурван хувилбар: дотно бүрдэлээс бүрэн чуулга хүртэл.'
		},
		plans: [
			{
				name: { en: 'Бэсрэг хөтөлбөр', mn: 'Бэсрэг хөтөлбөр' },
				price: { en: '1,200,000₮', mn: '1,200,000₮' },
				duration: { en: '15 минут', mn: '15 минут' },
				programmeItems: [
					{ active: true, label: { en: 'Монгол ардын уртын дуу', mn: 'Монгол ардын уртын дуу' } },
					{ active: true, label: { en: 'Морин хуурын аяз', mn: 'Морин хуурын аяз' } },
					{ active: true, label: { en: 'Монгол ардын богино дуу', mn: 'Монгол ардын богино дуу' } },
					{ active: true, label: { en: 'Хөөмийн түрлэг', mn: 'Хөөмийн түрлэг' } },
					{ active: true, label: { en: 'Аягат бүжиг', mn: 'Аягат бүжиг' } }
				],
				artistTags: [
					{ en: '1 морин хуурч', mn: '1 морин хуурч' },
					{ en: '1 уртын дуучин', mn: '1 уртын дуучин' },
					{ en: '1 хөөмийч', mn: '1 хөөмийч' },
					{ en: '1 бүжигчин', mn: '1 бүжигчин' }
				]
			},
			{
				name: { en: 'Дэлгэр хөтөлбөр', mn: 'Дэлгэр хөтөлбөр' },
				price: { en: '2,000,000₮', mn: '2,000,000₮' },
				duration: { en: '20-25 минут', mn: '20-25 минут' },
				programmeItems: [
					{ active: true, label: { en: 'Монгол аялгуу - Н.Жанцанноров /хамтлаг/', mn: 'Монгол аялгуу - Н.Жанцанноров /хамтлаг/' } },
					{ active: true, label: { en: 'Үндэсний урлагийн танилцуулга', mn: 'Үндэсний урлагийн танилцуулга' } },
					{ active: true, label: { en: 'Уяхан замбуу тивийн наран - МАУД', mn: 'Уяхан замбуу тивийн наран - МАУД' } },
					{ active: true, label: { en: 'Алтайн магтаал /Нийт уран бүтээлчид/', mn: 'Алтайн магтаал /Нийт уран бүтээлчид/' } },
					{ active: true, label: { en: '/Хөтөлбөр Монгол тайлбартай/', mn: '/Хөтөлбөр Монгол тайлбартай/' } }
				],
				artistTags: [
					{ en: '5 хөгжимчид', mn: '5 хөгжимчид' },
					{ en: '1 уртын дуучин', mn: '1 уртын дуучин' },
					{ en: '1 хөөмийч', mn: '1 хөөмийч' },
					{ en: '1 бүжигчин', mn: '1 бүжигчин' }
				]
			},
			{
				name: { en: 'Их хөтөлбөр', mn: 'Их хөтөлбөр' },
				price: { en: '3,000,000₮', mn: '3,000,000₮' },
				duration: { en: '30-35 минут', mn: '30-35 минут' },
				programmeItems: [
					{ active: true, label: { en: 'Түмэн агтны төвөргөөн /хамтлаг/', mn: 'Түмэн агтны төвөргөөн /хамтлаг/' } },
					{ active: true, label: { en: 'Морьтон монгол /хамтлаг/', mn: 'Морьтон монгол /хамтлаг/' } },
					{ active: true, label: { en: 'Бөөгийн бүжиг', mn: 'Бөөгийн бүжиг' } },
					{ active: true, label: { en: 'Уран нугаралт', mn: 'Уран нугаралт' } },
					{ active: true, label: { en: 'Алтайн магтаал /Нийт уран бүтээлчид/', mn: 'Алтайн магтаал /Нийт уран бүтээлчид/' } },
					{ active: true, label: { en: '/Хөтөлбөр Монгол тайлбартай/', mn: '/Хөтөлбөр Монгол тайлбартай/' } }
				],
				artistTags: [
					{ en: '5 хөгжимчид', mn: '5 хөгжимчид' },
					{ en: '1 уртын дуучин', mn: '1 уртын дуучин' },
					{ en: '1 хөөмийч', mn: '1 хөөмийч' },
					{ en: '2 бүжигчин', mn: '2 бүжигчин' },
					{ en: '1 уран нугараач', mn: '1 уран нугараач' }
				]
			}
		],
		tips: {
			title: { en: 'Зөвлөмж', mn: 'Зөвлөмж' },
			items: [
				{
					en: 'Тоглолт эхлэхээс 30 минутын өмнө уран бүтээлчдийг угтах.',
					mn: 'Тоглолт эхлэхээс 30 минутын өмнө уран бүтээлчдийг угтах.'
				},
				{
					en: 'Тайз болон дуу авианы тоног төхөөрөмжийн байршлыг урьдчилж тохирох.',
					mn: 'Тайз болон дуу авианы тоног төхөөрөмжийн байршлыг урьдчилж тохирох.'
				},
				{
					en: 'Гадаад зочдод зориулсан тайлбар хэлийг урьдчилж сонгох.',
					mn: 'Гадаад зочдод зориулсан тайлбар хэлийг урьдчилж сонгох.'
				},
				{
					en: 'Тоглолтын өмнөх өдөр захиалгаа эцэслэн нягтлах.',
					mn: 'Тоглолтын өмнөх өдөр захиалгаа эцэслэн нягтлах.'
				}
			]
		}
	},
	{
		_id: 'service-tusul-neelt',
		_type: 'service',
		slug: { _type: 'slug', current: 'tusul-neelt' },
		layout: 'medium',
		order: 60,
		title: { en: 'Project / programme launch', mn: 'Төсөл, хөтөлбөрийн нээлт' },
		description: {
			en: 'Open your project, brand or programme with a culturally-rooted ceremony — three scales for any audience.',
			mn: 'Төсөл, брэнд, хөтөлбөрийнхөө нээлтийг үндэсний өнгө аястай ёслолоор эхлүүл — гурван цар хүрээ.'
		},
		plans: [
			{
				name: { en: 'Opening', mn: 'Нээлт' },
				price: { en: 'From 1,500,000₮', mn: '1,500,000₮-өөс' },
				duration: { en: '20 минут', mn: '20 минут' },
				programmeItems: [
					{ active: true, label: { en: 'Opening MC', mn: 'Нээлтийн хөтлөлт' } },
					{ active: true, label: { en: 'Morin khuur melody', mn: 'Морин хуурын аяз' } },
					{ active: true, label: { en: 'Long song', mn: 'Уртын дуу' } },
					{ active: true, label: { en: 'Closing toast', mn: 'Хаалтын ерөөл' } }
				],
				artistTags: [
					{ en: '2 уран бүтээлч', mn: '2 уран бүтээлч' },
					{ en: 'Дуу авианы систем', mn: 'Дуу авианы систем' }
				]
			},
			{
				name: { en: 'Full event', mn: 'Бүрэн арга хэмжээ' },
				price: { en: 'From 5,000,000₮', mn: '5,000,000₮-өөс' },
				duration: { en: '60 минут', mn: '60 минут' },
				programmeItems: [
					{ active: true, label: { en: 'Greeting MC', mn: 'Угтах хөтлөлт' } },
					{ active: true, label: { en: 'Ensemble performance', mn: 'Чуулгын тоглолт' } },
					{ active: true, label: { en: 'Custom programme', mn: 'Тусгайлсан хөтөлбөр' } },
					{ active: true, label: { en: 'Closing', mn: 'Хаалт' } }
				],
				artistTags: [
					{ en: 'Чуулга + хөтлөгч', mn: 'Чуулга + хөтлөгч' },
					{ en: 'Дуу + гэрэлтүүлэг', mn: 'Дуу + гэрэлтүүлэг' }
				]
			},
			{
				name: { en: 'Premium', mn: 'Премиум' },
				price: { en: 'On request', mn: 'Хүсэлтээр' },
				duration: { en: 'Захиалгаар', mn: 'Захиалгаар' },
				programmeItems: [
					{ active: true, label: { en: 'Full ensemble production', mn: 'Бүрэн чуулгын продакшн' } },
					{ active: true, label: { en: 'Multi-stage event', mn: 'Олон үе шаттай арга хэмжээ' } },
					{ active: true, label: { en: 'Bespoke direction', mn: 'Захиалгат найруулга' } }
				],
				artistTags: [
					{ en: 'Бүрэн техникийн продакшн', mn: 'Бүрэн техникийн продакшн' }
				]
			}
		]
	},

	// ── BIG ───────────────────────────────────────────────────────────
	{
		_id: 'service-khurim',
		_type: 'service',
		slug: { _type: 'slug', current: 'khurim' },
		layout: 'big',
		order: 70,
		title: { en: 'Wedding', mn: 'Хурим' },
		description: {
			en: 'Хоёр биений амьдралаа холбох нандин мөчийг Монгол уламжлал, орчин үеийн найруулгаар чимж, зохион байгуулна. Бид хуримын ёслолыг морин хуур, хайрын дуу аялгуу, ерөөлөөр цогцлоож, мартагдашгүй дурсамжийг бүтээнэ.',
			mn: 'Хоёр биений амьдралаа холбох нандин мөчийг Монгол уламжлал, орчин үеийн найруулгаар чимж, зохион байгуулна. Бид хуримын ёслолыг морин хуур, хайрын дуу аялгуу, ерөөлөөр цогцлоож, мартагдашгүй дурсамжийг бүтээнэ.'
		},
		priceRange: {
			en: '10,000,000₮ - 18,000,000₮',
			mn: '10,000,000₮ - 18,000,000₮'
		},
		parts: [
			{
				partId: 'part-welcome',
				title: { en: 'Угталтын хэсэг', mn: 'Угталтын хэсэг' },
				subsections: [
					{
						name: { en: 'Угталтын хөгжим', mn: 'Угталтын хөгжим' },
						duration: { en: '35-40 минут', mn: '35-40 минут' },
						options: [
							{
								label: { en: 'Сонголт 1', mn: 'Сонголт 1' },
								title: { en: 'Үндэсний хөгжмийн дөрвөл', mn: 'Үндэсний хөгжмийн дөрвөл' }
							},
							{
								label: { en: 'Сонголт 2', mn: 'Сонголт 2' },
								title: { en: 'Саксафон', mn: 'Саксафон' }
							},
							{
								label: { en: 'Сонголт 3', mn: 'Сонголт 3' },
								title: { en: 'Хийлийн дөрвөл', mn: 'Хийлийн дөрвөл' }
							}
						]
					}
				]
			},
			{
				partId: 'part-1',
				title: { en: 'I хэсэг', mn: 'I хэсэг' },
				subsections: [
					{
						name: { en: 'Үндэсний хөгжим', mn: 'Үндэсний хөгжим' },
						duration: { en: '35-40 минут', mn: '35-40 минут' },
						options: [
							{
								label: { en: 'Сонголт 1', mn: 'Сонголт 1' },
								title: { en: 'Морин хуурын дөрвөл', mn: 'Морин хуурын дөрвөл' },
								programmeItems: [
									{ active: true, label: { en: 'Монгол аялгуу', mn: 'Монгол аялгуу' } },
									{ active: true, label: { en: 'Уртын дуутай хамсрах', mn: 'Уртын дуутай хамсрах' } },
									{ active: true, label: { en: 'Ерөөлтэй хамсрах', mn: 'Ерөөлтэй хамсрах' } },
									{ active: true, label: { en: 'Үүлэн бор', mn: 'Үүлэн бор' } }
								],
								artistTags: [
									{ en: '3 морин хуур', mn: '3 морин хуур' },
									{ en: '1 их хуур', mn: '1 их хуур' }
								]
							},
							{
								label: { en: 'Сонголт 2', mn: 'Сонголт 2' },
								title: { en: 'Үндэсний хөгжмийн хамтлаг', mn: 'Үндэсний хөгжмийн хамтлаг' },
								programmeItems: [
									{ active: true, label: { en: 'Монгол аялгуу', mn: 'Монгол аялгуу' } },
									{ active: true, label: { en: 'Уртын дуутай хамсрах', mn: 'Уртын дуутай хамсрах' } },
									{ active: true, label: { en: 'Ерөөлтэй хамсрах', mn: 'Ерөөлтэй хамсрах' } },
									{ active: true, label: { en: 'Алтайн магтаал', mn: 'Алтайн магтаал' } }
								],
								artistTags: [
									{ en: '1 лимбэ', mn: '1 лимбэ' },
									{ en: '1 ятга', mn: '1 ятга' },
									{ en: '1 хөөмийч', mn: '1 хөөмийч' },
									{ en: '2 морин хуур', mn: '2 морин хуур' },
									{ en: '1 их хуур', mn: '1 их хуур' }
								]
							},
							{
								label: { en: 'Сонголт 3', mn: 'Сонголт 3' },
								title: { en: 'Үндэсний хөгжмийн цөөхүүл чуулга', mn: 'Үндэсний хөгжмийн цөөхүүл чуулга' },
								programmeItems: [
									{ active: true, label: { en: 'Сэрсэн тал', mn: 'Сэрсэн тал' } },
									{ active: true, label: { en: 'Уртын дуутай хамсрах', mn: 'Уртын дуутай хамсрах' } },
									{ active: true, label: { en: 'Ерөөлтэй хамсрах', mn: 'Ерөөлтэй хамсрах' } },
									{ active: true, label: { en: 'Үүлэн бор', mn: 'Үүлэн бор' } }
								],
								artistTags: [
									{ en: '4 морин хуур', mn: '4 морин хуур' },
									{ en: '1 лимбэ', mn: '1 лимбэ' },
									{ en: '1 ятга', mn: '1 ятга' },
									{ en: '1 ёочин', mn: '1 ёочин' },
									{ en: '1 их хуур', mn: '1 их хуур' },
									{ en: '1 шанз', mn: '1 шанз' },
									{ en: '1 цохивор', mn: '1 цохивор' }
								]
							}
						]
					},
					{
						name: { en: 'Монгол бүжиг', mn: 'Монгол бүжиг' },
						duration: { en: '35-40 минут', mn: '35-40 минут' },
						options: [
							{
								label: { en: 'Сонголт 1', mn: 'Сонголт 1' },
								title: { en: 'Бидэн хоёр', mn: 'Бидэн хоёр' },
								programmeItems: [
									{ active: true, label: { en: 'Бие чинь болъё', mn: 'Бие чинь болъё' } }
								]
							},
							{
								label: { en: 'Сонголт 2', mn: 'Сонголт 2' },
								title: { en: 'Хослон жаргая', mn: 'Хослон жаргая' },
								programmeItems: [
									{ active: true, label: { en: 'Хадагтай бүжиг', mn: 'Хадагтай бүжиг' } },
									{ active: true, label: { en: 'Бие чинь болъё', mn: 'Бие чинь болъё' } }
								]
							},
							{
								label: { en: 'Сонголт 3', mn: 'Сонголт 3' },
								title: { en: 'Хатад ноёдын цэнгүүн', mn: 'Хатад ноёдын цэнгүүн' },
								programmeItems: [
									{ active: true, label: { en: 'Ноёд хатад бүжиг', mn: 'Ноёд хатад бүжиг' } },
									{ active: true, label: { en: 'Цэнгэлийн бүжиг', mn: 'Цэнгэлийн бүжиг' } }
								]
							}
						]
					},
					{
						name: { en: 'Уртын дууч, Ерөөлчид', mn: 'Уртын дууч, Ерөөлчид' },
						duration: { en: '35-40 минут', mn: '35-40 минут' },
						artists: [
							{ artist: ref('artist-batmend') },
							{ artist: ref('artist-byambadorj') },
							{ artist: ref('artist-uuganbayar') },
							{ artist: ref('artist-myagmardorj') },
							{ artist: ref('artist-otgonzul') },
							{ artist: ref('artist-sumiyaabat') },
							{ artist: ref('artist-erdene-ochir') }
						]
					}
				]
			},
			{
				partId: 'part-2',
				title: { en: 'II хэсэг', mn: 'II хэсэг' },
				subsections: [
					{
						name: { en: 'Дуучид', mn: 'Дуучид' },
						duration: { en: '35-40 минут', mn: '35-40 минут' },
						artists: [
							{
								artist: ref('artist-byambadorj'),
								songs: {
									en: 'Сүү цагаан сэтгэл\nУрангоо\nХунгийн дэгдээхэй',
									mn: 'Сүү цагаан сэтгэл\nУрангоо\nХунгийн дэгдээхэй'
								}
							},
							{
								artist: ref('artist-uuganbayar'),
								songs: {
									en: 'Аав ээж хоёр минь\nХүний заяа',
									mn: 'Аав ээж хоёр минь\nХүний заяа'
								}
							},
							{
								artist: ref('artist-erdene-ochir'),
								songs: {
									en: 'Баярлана даа\nДээдлэн гоёорой',
									mn: 'Баярлана даа\nДээдлэн гоёорой'
								}
							},
							{
								artist: ref('artist-myagmardorj'),
								songs: {
									en: 'Магнаг цэнхэр дэлхий\nХүний заяа',
									mn: 'Магнаг цэнхэр дэлхий\nХүний заяа'
								}
							},
							{
								artist: ref('artist-otgonzul'),
								songs: {
									en: 'Сэтгэлд хоногшсон дуунуудын цоморлог',
									mn: 'Сэтгэлд хоногшсон дуунуудын цоморлог'
								}
							},
							{
								artist: ref('artist-sumiyaabat'),
								songs: {
									en: 'Орчлонг хайрлаарай\nНасны хань',
									mn: 'Орчлонг хайрлаарай\nНасны хань'
								}
							}
						]
					},
					{
						name: { en: 'Хамтлаг, Дуучид', mn: 'Хамтлаг, Дуучид' },
						duration: { en: '35-40 минут', mn: '35-40 минут' },
						artists: [
							{
								artist: ref('artist-batmend'),
								songs: {
									en: 'Амин үргэлжлэл\nҮлэмжийн чанар',
									mn: 'Амин үргэлжлэл\nҮлэмжийн чанар'
								}
							},
							{
								artist: ref('artist-byambadorj'),
								songs: {
									en: 'Мөнх тэнгэрийн хурай\nТаминээ',
									mn: 'Мөнх тэнгэрийн хурай\nТаминээ'
								}
							},
							{
								artist: ref('artist-uuganbayar'),
								songs: {
									en: 'Сэтгэлийн булаг\nБи чамд хайртай',
									mn: 'Сэтгэлийн булаг\nБи чамд хайртай'
								}
							},
							{
								artist: ref('artist-myagmardorj'),
								songs: { en: 'Найр\nМойлхон', mn: 'Найр\nМойлхон' }
							},
							{
								artist: ref('artist-otgonzul'),
								songs: { en: 'Баярлалаа\nХань минь', mn: 'Баярлалаа\nХань минь' }
							},
							{
								artist: ref('artist-erdene-ochir'),
								songs: {
									en: 'Хүмүүний сайхан хайрыг\nЗаллага',
									mn: 'Хүмүүний сайхан хайрыг\nЗаллага'
								}
							}
						]
					}
				]
			},
			{
				partId: 'part-cta-1',
				kind: 'cta',
				title: {
					en: 'Танд тусгайлан зориулсан хөтөлбөр',
					mn: 'Танд тусгайлан зориулсан хөтөлбөр'
				},
				body: {
					en: 'Багцад өөрчлөлт оруулж, өөрийн төсөв болон хүсэлдээ нийцсэн шилдэг үзүүлбэрүүдийг сонгохыг хүсвэл бидэнтэй холбогдоорой. Бид таны баярыг илүү үнэ цэнтэй болгох шийдлийг зөвлөх болно.',
					mn: 'Багцад өөрчлөлт оруулж, өөрийн төсөв болон хүсэлдээ нийцсэн шилдэг үзүүлбэрүүдийг сонгохыг хүсвэл бидэнтэй холбогдоорой. Бид таны баярыг илүү үнэ цэнтэй болгох шийдлийг зөвлөх болно.'
				}
			},
			{
				partId: 'part-3',
				title: { en: 'III хэсэг', mn: 'III хэсэг' },
				subsections: [
					{
						name: { en: 'Хамтлаг, Дуучид', mn: 'Хамтлаг, Дуучид' },
						duration: { en: '35-40 минут', mn: '35-40 минут' },
						artists: [
							{ artist: ref('artist-batmend'), songs: { en: 'Мэндбаяр\nТогооны хүн', mn: 'Мэндбаяр\nТогооны хүн' } },
							{ artist: ref('artist-byambadorj'), songs: { en: 'Ерөөе өө\nНайрын дуу', mn: 'Ерөөе өө\nНайрын дуу' } },
							{ artist: ref('artist-uuganbayar'), songs: { en: 'Завгүй\nГарагийн өдөр', mn: 'Завгүй\nГарагийн өдөр' } },
							{ artist: ref('artist-myagmardorj'), songs: { en: 'Young forever\nLet me down', mn: 'Young forever\nLet me down' } },
							{ artist: ref('artist-otgonzul'), songs: { en: 'Чамдаа\nЧамайгаа санасаар', mn: 'Чамдаа\nЧамайгаа санасаар' } },
							{ artist: ref('artist-sumiyaabat'), songs: { en: 'Мөнхийн ус\nЖаргал зовлон', mn: 'Мөнхийн ус\nЖаргал зовлон' } }
						]
					},
					{
						name: { en: 'Хамтлаг, Дуучид', mn: 'Хамтлаг, Дуучид' },
						duration: { en: '35-40 минут', mn: '35-40 минут' },
						artists: [
							{ artist: ref('artist-erdene-ochir'), songs: { en: 'Үзэсгэлэнт минь\nХайртай', mn: 'Үзэсгэлэнт минь\nХайртай' } },
							{ artist: ref('artist-batmend'), songs: { en: 'Сархад\nНандин төрх', mn: 'Сархад\nНандин төрх' } },
							{ artist: ref('artist-byambadorj'), songs: { en: '2 дуу', mn: '2 дуу' } },
							{ artist: ref('artist-uuganbayar'), songs: { en: 'Шүрэн бугуйвч\nГанцхан тэвэрье', mn: 'Шүрэн бугуйвч\nГанцхан тэвэрье' } },
							{ artist: ref('artist-myagmardorj'), songs: { en: 'Саран\nИтгэл', mn: 'Саран\nИтгэл' } },
							{ artist: ref('artist-otgonzul'), songs: { en: 'Нутаг минь сайн байна уу?\nНамайг сонго', mn: 'Нутаг минь сайн байна уу?\nНамайг сонго' } }
						]
					},
					{
						name: { en: 'Амьд хөгжмийн хамтлаг', mn: 'Амьд хөгжмийн хамтлаг' },
						duration: { en: '35-40 минут', mn: '35-40 минут' },
						options: [
							{
								label: { en: 'Сонголт 1', mn: 'Сонголт 1' },
								title: { en: 'Royal Arte', mn: 'Royal Arte' }
							},
							{
								label: { en: 'Сонголт 2', mn: 'Сонголт 2' },
								title: { en: 'Jam house', mn: 'Jam house' }
							},
							{
								label: { en: 'Сонголт 3', mn: 'Сонголт 3' },
								title: { en: 'The Moon Band', mn: 'The Moon Band' }
							}
						]
					}
				]
			},
			{
				partId: 'part-mc',
				title: { en: 'Хөтлөгч', mn: 'Хөтлөгч' },
				subsections: [
					{
						name: { en: 'Хөтлөгч', mn: 'Хөтлөгч' },
						duration: { en: '35-40 минут', mn: '35-40 минут' },
						artists: [
							{
								artist: ref('artist-batmend'),
								songs: {
									en: 'Ажлын туршлага: 12 жил',
									mn: 'Ажлын туршлага: 12 жил'
								}
							},
							{
								artist: ref('artist-byambadorj'),
								songs: {
									en: 'Ажлын туршлага: 15 жил',
									mn: 'Ажлын туршлага: 15 жил'
								}
							},
							{
								artist: ref('artist-uuganbayar'),
								songs: {
									en: 'Ажлын туршлага: 20 жил',
									mn: 'Ажлын туршлага: 20 жил'
								}
							},
							{
								artist: ref('artist-myagmardorj'),
								songs: {
									en: 'Ажлын туршлага: 10 жил',
									mn: 'Ажлын туршлага: 10 жил'
								}
							},
							{
								artist: ref('artist-otgonzul'),
								songs: {
									en: 'Ажлын туршлага: 8 жил',
									mn: 'Ажлын туршлага: 8 жил'
								}
							},
							{
								artist: ref('artist-sumiyaabat'),
								songs: {
									en: 'Ажлын туршлага: 10 жил',
									mn: 'Ажлын туршлага: 10 жил'
								}
							}
						]
					}
				]
			}
		],
		tips: {
			title: { en: 'Зөвлөмж', mn: 'Зөвлөмж' },
			items: [
				{
					en: 'Хөтөлбөр эхлэхээс 60 минутын өмнө уран бүтээлчдийг угтах байр бэлтгэх.',
					mn: 'Хөтөлбөр эхлэхээс 60 минутын өмнө уран бүтээлчдийг угтах байр бэлтгэх.'
				},
				{
					en: 'Тайз болон дуу авианы тоног төхөөрөмжийн байршлыг урьдчилж тохирох.',
					mn: 'Тайз болон дуу авианы тоног төхөөрөмжийн байршлыг урьдчилж тохирох.'
				},
				{
					en: 'Хөтлөгчтэй хөтөлбөрийн дарааллыг 1 өдрийн өмнө баталгаажуулах.',
					mn: 'Хөтлөгчтэй хөтөлбөрийн дарааллыг 1 өдрийн өмнө баталгаажуулах.'
				},
				{
					en: 'Гадаад зочдод зориулсан тайлбар хэлийг урьдчилж сонгох.',
					mn: 'Гадаад зочдод зориулсан тайлбар хэлийг урьдчилж сонгох.'
				}
			]
		}
	},
	{
		_id: 'service-odon-tsolnii-nair',
		_type: 'service',
		slug: { _type: 'slug', current: 'odon-tsolnii-nair' },
		layout: 'big',
		order: 80,
		title: { en: 'Honors & titles celebration', mn: 'Одон цолны найр' },
		description: {
			en: 'A ceremonial celebration honoring state awards, titles or career milestones — produced with the gravity the moment deserves.',
			mn: 'Төрийн шагнал, цол, мэргэжлийн ойн хүрээнд зохион байгуулах хүндэт ёслол — мөч тус бүрд нь хүндэтгэл хүргэх цар хэмжээгээр.'
		},
		priceRange: {
			en: '8,000,000₮ - 14,000,000₮',
			mn: '8,000,000₮ - 14,000,000₮'
		},
		parts: [
			{
				partId: 'part-1',
				title: { en: 'Part 1 — Honoree consultation', mn: 'Хэсэг 1 — Танилцал' },
				body: {
					en: 'We meet the honoree and family, learn the story, the colleagues, and the moments to highlight.',
					mn: 'Цол хүртэгч, гэр бүлтэй уулзаж, түүх, хамт олон, онцлох мөчүүдийг ойлгоно.'
				}
			},
			{
				partId: 'part-2',
				title: { en: 'Part 2 — Programme design', mn: 'Хэсэг 2 — Хөтөлбөр зохиомж' },
				body: {
					en: 'Speeches, blessings and performances — sequenced for impact.',
					mn: 'Үг, ерөөл, тоглолтыг нөлөөтэй дараалалаар зохиомжилно.'
				}
			},
			{
				partId: 'part-3',
				title: { en: 'Part 3 — Production', mn: 'Хэсэг 3 — Продакшн' },
				body: {
					en: 'Stage, sound, lighting and ensemble fitted to the venue and audience size.',
					mn: 'Тайз, дуу, гэрэлтүүлэг, чуулгыг танхим, зочдын тоонд нийцүүлэн бэлдэнэ.'
				}
			},
			{
				partId: 'part-4',
				title: { en: 'Part 4 — Execution', mn: 'Хэсэг 4 — Гүйцэтгэл' },
				body: {
					en: 'Live ceremony with MC, performances, blessings and full coordination.',
					mn: 'Хөтлөгч, тоглолт, ерөөл, бүрэн зохицуулалттай шууд ёслол.'
				}
			}
		]
	}
];

// ── starter FAQs (figma s5) ───────────────────────────────────────────
// Figma showed one repeated booking question; we extend to 5 distinct entries
// using the same booking-themed copy as the canonical first one.
const faqAnswerBooking = {
	en: 'Найр наадмын тань хойморт аялгуу нэмж, зочдод тань амьд урлагийн гайхамшгийг мэдрүүлэх нь бидний эрхэм зорилго юм. Та өөрийн хүсэлтээ ирүүлснээр бид таны баярын хөтөлбөрт нийцэх шилдэг уран бүтээлчдийн нэгдсэн саналыг түргэн шуурхай хүргэх болно.',
	mn: 'Найр наадмын тань хойморт аялгуу нэмж, зочдод тань амьд урлагийн гайхамшгийг мэдрүүлэх нь бидний эрхэм зорилго юм. Та өөрийн хүсэлтээ ирүүлснээр бид таны баярын хөтөлбөрт нийцэх шилдэг уран бүтээлчдийн нэгдсэн саналыг түргэн шуурхай хүргэх болно.'
};

const faqs = [
	{
		_id: 'faq-1',
		_type: 'faqItem',
		published: true,
		order: 10,
		question: {
			en: 'Би захиалгаа ямар хугацааны өмнөөс өгөх ёстой вэ?',
			mn: 'Би захиалгаа ямар хугацааны өмнөөс өгөх ёстой вэ?'
		},
		answer: faqAnswerBooking
	},
	{
		_id: 'faq-2',
		_type: 'faqItem',
		published: true,
		order: 20,
		question: {
			en: 'Хөтөлбөрөө өөрийн хүсэлтээр өөрчилж болох уу?',
			mn: 'Хөтөлбөрөө өөрийн хүсэлтээр өөрчилж болох уу?'
		},
		answer: faqAnswerBooking
	},
	{
		_id: 'faq-3',
		_type: 'faqItem',
		published: true,
		order: 30,
		question: {
			en: 'Цуцалбал төлбөр буцаагдах уу?',
			mn: 'Цуцалбал төлбөр буцаагдах уу?'
		},
		answer: faqAnswerBooking
	},
	{
		_id: 'faq-4',
		_type: 'faqItem',
		published: true,
		order: 40,
		question: {
			en: 'Гадаад зочдод зориулсан хувилбар бий юу?',
			mn: 'Гадаад зочдод зориулсан хувилбар бий юу?'
		},
		answer: faqAnswerBooking
	},
	{
		_id: 'faq-5',
		_type: 'faqItem',
		published: true,
		order: 50,
		question: {
			en: 'Дуу авианы тоног төхөөрөмж та нар бэлдэх үү?',
			mn: 'Дуу авианы тоног төхөөрөмж та нар бэлдэх үү?'
		},
		answer: faqAnswerBooking
	}
];

// ── push everything ───────────────────────────────────────────────────
async function seed() {
	type SeedDoc = { _id: string; _type: string; [k: string]: unknown };

	// 1. Upload artist photos and build artist documents.
	console.log(`Uploading ${artistsSeed.length} artist photos…`);
	const artists: SeedDoc[] = [];
	for (const a of artistsSeed) {
		const photo = await uploadImage(a.photoFile);
		artists.push({
			_id: a._id,
			_type: 'artist',
			name: a.name,
			...('role' in a && a.role ? { role: a.role } : {}),
			photo,
			order: a.order
		});
	}

	// 2. Upload shared banner + sevleg-urgeeh gallery, attach to all services.
	console.log('Uploading shared banner + sevleg-urgeeh gallery…');
	const sharedBanner = await uploadImage('client-materials/small-banner.png');
	const sevlegGallery = [
		await uploadImage('client-materials/s2-image.png'),
		await uploadImage('client-materials/source/image.png')
	];
	for (const svc of services) {
		(svc as SeedDoc).bannerImage = sharedBanner;
	}
	const sevleg = services.find((s) => s._id === 'service-sevleg-urgeeh');
	if (sevleg) {
		(sevleg as SeedDoc).gallery = [
			sevlegGallery[0],
			sevlegGallery[1],
			sevlegGallery[0],
			sevlegGallery[1]
		];
	}
	// Reuse same gallery for the tourist-performance medium so it has demo content.
	const juulchdiin = services.find((s) => s._id === 'service-juulchdiin-toglolt');
	if (juulchdiin) {
		(juulchdiin as SeedDoc).gallery = [
			sevlegGallery[0],
			sevlegGallery[1],
			sevlegGallery[0],
			sevlegGallery[1]
		];
	}
	// Reuse for the big khurim service so it shows gallery + tips.
	const khurimDoc = services.find((s) => s._id === 'service-khurim');
	if (khurimDoc) {
		(khurimDoc as SeedDoc).gallery = [
			sevlegGallery[0],
			sevlegGallery[1],
			sevlegGallery[0],
			sevlegGallery[1]
		];
	}

	// 3. Upload intro image (s2 home) + discipline card images (s3 home).
	console.log('Uploading home intro + discipline images…');
	const introImage = await uploadImage('client-materials/s2-image.png');
	const introWithImage: SeedDoc = { ...intro, image: introImage };

	const disciplineCards = [];
	for (const c of disciplineCardsSeed) {
		const image = await uploadImage(`client-materials/disciplines/${c.id}.png`);
		disciplineCards.push({ title: c.title, image });
	}
	const disciplinesDoc: SeedDoc = {
		_id: 'disciplinesSection',
		_type: 'disciplinesSection',
		title: {
			en: 'Уламжлалт урлаг, мэргэжлийн найруулга болон гүйцэтгэл',
			mn: 'Уламжлалт урлаг, мэргэжлийн найруулга болон гүйцэтгэл'
		},
		cards: disciplineCards
	};

	// 3b. Upload khurim part-1 option images + part-3 band images, attach.
	console.log('Uploading khurim part-1 + part-3 option images…');
	const part1Images: AssetRef[] = [];
	for (let i = 0; i < 9; i++) {
		const filename = i === 0 ? 'Image.png' : `Image-${i}.png`;
		part1Images.push(await uploadImage(`client-materials/part-1-images/${filename}`));
	}
	const khurim = services.find((s) => s._id === 'service-khurim');
	if (khurim) {
		type Plain = Record<string, unknown>;
		const parts = (khurim as { parts: Plain[] }).parts;
		const part1 = parts.find((p) => p.partId === 'part-1');
		if (part1) {
			const subs = part1.subsections as Plain[];
			// music subsection (index 0): 3 options → images 0,1,2
			const musicOptions = subs[0].options as Plain[];
			musicOptions[0].image = part1Images[0];
			musicOptions[1].image = part1Images[1];
			musicOptions[2].image = part1Images[2];
			// dance subsection (index 1): 3 options → images 3,4,5
			const danceOptions = subs[1].options as Plain[];
			danceOptions[0].image = part1Images[3];
			danceOptions[1].image = part1Images[4];
			danceOptions[2].image = part1Images[5];
		}
		const part3 = parts.find((p) => p.partId === 'part-3');
		if (part3) {
			const subs = part3.subsections as Plain[];
			// live-band subsection (index 2): 3 options → images 6,7,8
			const bandOptions = subs[2].options as Plain[];
			bandOptions[0].image = part1Images[6];
			bandOptions[1].image = part1Images[7];
			bandOptions[2].image = part1Images[8];
		}
	}

	// 4. Commit all docs.
	const docs: SeedDoc[] = [
		siteSettings,
		hero,
		introWithImage,
		disciplinesDoc,
		whyUs,
		collabs,
		...artists,
		...seasons,
		...(services as unknown as SeedDoc[]),
		...faqs
	];
	console.log(`Seeding ${docs.length} documents into ${projectId}/${dataset}…`);

	const tx = client.transaction();
	for (const doc of docs) tx.createOrReplace(addKeysDeep(doc));
	const result = await tx.commit();

	console.log(`✓ committed ${result.results.length} docs`);
	console.log('Open the Studio: pnpm dev');
}

seed().catch((err) => {
	console.error('Seed failed:', err);
	process.exit(1);
});

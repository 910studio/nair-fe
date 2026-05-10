/**
 * Author tagline + description (bilingual MN/EN) onto each discipline card,
 * matched by English title. Sets slug if missing. Image / heroImage / gallery
 * are left untouched.
 *
 * Usage (from studio/):
 *   pnpm dlx tsx scripts/seed-disciplines-content.ts            # dry-run
 *   pnpm dlx tsx scripts/seed-disciplines-content.ts --apply    # commit
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production';
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const API_VERSION = '2024-10-01';

if (!PROJECT_ID || !TOKEN) {
	console.error('Missing SANITY_STUDIO_PROJECT_ID or SANITY_WRITE_TOKEN in studio/.env');
	process.exit(1);
}

const apply = process.argv.includes('--apply');
const DOC_ID = 'disciplinesSection';

const client = createClient({
	projectId: PROJECT_ID,
	dataset: DATASET,
	token: TOKEN,
	apiVersion: API_VERSION,
	useCdn: false
});

interface Localized {
	mn?: string;
	en?: string;
}

interface CardContent {
	matchEn: string; // english title to match the card by
	slug: string;
	tagline: Localized;
	description: Localized;
}

const CONTENT: CardContent[] = [
	{
		matchEn: 'Long song',
		slug: 'long-song',
		tagline: { mn: 'Уран дуу', en: 'Vocal art' },
		description: {
			mn: 'Уртын дуу нь Монгол ардын дуулах урлагийн хамгийн өвөрмөц төрөл. Удаан, чөлөөтэй хэмнэлээр хэлбэржсэн уртасгасан үе, баялаг чимэглэлийн гангинуур нь дуучнаас хүчтэй амьсгал болон уран чадварыг шаарддаг. ЮНЕСКО-гийн соёлын өвд бүртгэгдсэн.',
			en: 'Long song is the most distinctive vocal art in the Mongolian tradition. Slow, free-rhythm phrasing with extended vowels and rich ornamentation demands powerful breath control and refined technique from the singer. Inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity.'
		}
	},
	{
		matchEn: 'Folk song',
		slug: 'folk-song',
		tagline: { mn: 'Ардын аман зохиол', en: 'Oral tradition' },
		description: {
			mn: 'Ардын дуу бол Монгол улсын газар орон, эх орон, эхийн хайр, нутгийн уудам байдал зэргийг дуулсан хамгийн ойр дотно дуулах төрөл. Энгийн аялгуу, мэдрэмжтэй үг найруулга, төрөлх хэмнэл нь олон үеийн дамжуулсан хүний амьдралын баялгийг тусгаж өгдөг.',
			en: 'Folk song is the most intimate vocal tradition in Mongolia — songs of homeland, motherly love, and the openness of the steppe. Simple melodies, sensitive lyrics and native rhythms carry the lived experience of generations.'
		}
	},
	{
		matchEn: 'Khoomii',
		slug: 'khoomii',
		tagline: { mn: 'Хоолойн уран чадвар', en: 'Throat singing' },
		description: {
			mn: 'Хөөмий бол нэг дуучин нэгэн зэрэг хоёроос дээш аялгуу үүсгэдэг өвөрмөц урлаг. Гүнзгий бас өнгө дээр нийлүүлж тусгайлан үүсгэсэн өндөр гармониктай аялгуу нь Монгол хоолойн уран чадварыг харуулдаг. ЮНЕСКО-гийн соёлын өвд бүртгэгдсэн.',
			en: 'Khoomei is the art of producing two or more pitches simultaneously from a single voice. A deep fundamental drone is layered with a precisely shaped harmonic melody — a hallmark of Mongolian throat singing. Inscribed on the UNESCO Representative List of Intangible Cultural Heritage.'
		}
	},
	{
		matchEn: 'Blessings & eulogies',
		slug: 'blessings-eulogies',
		tagline: { mn: 'Ёслолын үг', en: 'Ceremonial verse' },
		description: {
			mn: 'Ерөөл магтаал бол Монголын уламжлалт ёслолын үг. Хурим, найр, шинэ гэр буусан, насны зэрэг чухал үед уламжлалт айзамтай хэлдэг хүндэтгэлийн ерөөл нь арга хэмжээний агуулгыг өргөж, оролцогчдод сайн сайхныг үлдээдэг.',
			en: 'Blessings and eulogies are the ceremonial verse of Mongolia. Recited in traditional cadence at weddings, feasts, housewarmings and milestone celebrations, they elevate the moment and leave guests with a memorable, well-wishing close.'
		}
	},
	{
		matchEn: 'Mongolian dance',
		slug: 'mongolian-dance',
		tagline: { mn: 'Биелгээ', en: 'Biyelgee' },
		description: {
			mn: 'Монгол бүжиг гэдэгт биелгээ, эрийн гурван наадмын бүжиг болон угсаатны олон бүжиг багтдаг. Хол ойрын ястан тус бүрийн өвөрмөц хөдөлгөөн, хувцас, хөгжмийн өнгө аяс нь Монголын олон талт соёлыг тайзан дээр амилуулдаг.',
			en: 'Mongolian dance spans biyelgee, ethnic dances of the steppe and Three Manly Skills celebrations. Each region’s distinct movement vocabulary, costume and musical accent brings Mongolia’s many cultures to life on stage.'
		}
	},
	{
		matchEn: 'Contortion',
		slug: 'contortion',
		tagline: { mn: 'Уран чадвар', en: 'Acrobatic art' },
		description: {
			mn: 'Уран нугаралт бол Монголоос үүссэн дэлхийд алдартай тайзны урлаг. Биеийн уян чанар, хүч, тэнцвэрийн нэгдэл нь үзэгчдийг гайхшруулж, уран бүтээлчдийн жилийн жилийн сургалтын үр дүн биелэгддэг.',
			en: 'Mongolian contortion is a stage art that has earned worldwide acclaim. Flexibility, strength and balance combine into compositions that astonish audiences and showcase the years of disciplined training behind every performer.'
		}
	},
	{
		matchEn: 'Tsam dance',
		slug: 'tsam-dance',
		tagline: { mn: 'Сахилт бөмбөгийн ёслол', en: 'Buddhist ritual' },
		description: {
			mn: 'Цамын бүжиг бол Монгол Буддын шашны баяр ёслолын маск зүүсэн ариун бүжиг. Тэнгэр сахиус, газрын эзэн, гай зайлуулагч дүрүүдийн хувирлыг ёс заншлаар тайзнаас үзүүлж, үзэгчдийг өвөрмөц соёлын ертөнцөд аваачдаг.',
			en: 'Tsam is the masked sacred dance of Mongolian Buddhism. Performers embody guardian deities, earth spirits and ward-off figures in ritual choreography, transporting audiences into a singular cultural world.'
		}
	},
	{
		matchEn: 'Morin khuur quartet',
		slug: 'morin-khuur-quartet',
		tagline: { mn: 'Морин хуурын чуулга', en: 'Strings ensemble' },
		description: {
			mn: 'Морин хуурын дөрвөл бол Монголын бэлгэдэл болсон морин хуурыг хамтлагт нэгтгэсэн чуулга. Гүн өнгө, баялаг гармоник, орчин үеийн найруулгын боломжтой бөгөөд эстрад, сонгодог, ардын аль ч хөтөлбөрт тохирно.',
			en: 'A morin khuur quartet ensembles the iconic horse-head fiddle into a four-part chamber group. Deep tone, rich harmonics and modern arrangements make it a fit for classical, folk and contemporary concert programmes alike.'
		}
	},
	{
		matchEn: 'National music ensemble',
		slug: 'national-music-ensemble',
		tagline: { mn: 'Үндэсний хөгжим', en: 'Folk instruments' },
		description: {
			mn: 'Үндэсний хөгжмийн цөөхүүл нь морин хуур, ятга, шанз, ёочин, цуур, лимбэ зэрэг Монголын уламжлалт хөгжмүүдийг нэгтгэсэн чуулга. Хамтын аялгуу нь арга хэмжээний агуулгыг гүн гүнзгий, дотно болгож, олон үеийг холбосон үндэсний өнгө аясыг бий болгодог.',
			en: 'The national music ensemble brings together morin khuur, yatga, shanz, yoochin, tsuur, limbe and other traditional Mongolian instruments. The collective sound deepens the atmosphere of any event and threads a national voice across generations.'
		}
	}
];

interface CardObject {
	_key?: string;
	title?: Localized;
	slug?: { _type: 'slug'; current?: string } | string;
	tagline?: Localized;
	description?: Localized;
	image?: unknown;
	heroImage?: unknown;
	gallery?: unknown;
}

interface DisciplinesDoc {
	_id: string;
	_rev: string;
	cards?: CardObject[];
}

async function main() {
	const doc = (await client.getDocument<DisciplinesDoc>(DOC_ID)) as DisciplinesDoc | null;
	if (!doc) {
		console.error(`Document ${DOC_ID} not found.`);
		process.exit(1);
	}
	if (!doc.cards?.length) {
		console.error(`No cards in ${DOC_ID}. Author or seed cards first.`);
		process.exit(1);
	}

	const patch = client.patch(DOC_ID);
	const ops: Array<{ key: string; en: string; matchedTitle: string }> = [];

	for (const c of doc.cards) {
		const cardEn = c.title?.en?.trim().toLowerCase();
		if (!c._key || !cardEn) continue;
		const content = CONTENT.find((x) => x.matchEn.toLowerCase() === cardEn);
		if (!content) continue;

		const path = (field: string) => `cards[_key=="${c._key}"].${field}`;
		patch.set({
			[path('slug')]: { _type: 'slug', current: content.slug },
			[path('tagline')]: content.tagline,
			[path('description')]: content.description
		});
		ops.push({ key: c._key, en: content.matchEn, matchedTitle: c.title?.mn || cardEn });
	}

	console.log(`\nMatched ${ops.length} of ${doc.cards.length} cards`);
	for (const op of ops) {
		console.log(`  · ${op.en.padEnd(28)} → ${op.matchedTitle}  (key: ${op.key.slice(0, 8)})`);
	}

	const unmatched = doc.cards.filter((c) => {
		const en = c.title?.en?.trim().toLowerCase();
		return en && !CONTENT.some((x) => x.matchEn.toLowerCase() === en);
	});
	if (unmatched.length) {
		console.log(`\nNot in CONTENT map (skipped):`);
		for (const c of unmatched) console.log(`  · ${c.title?.en} / ${c.title?.mn}`);
	}

	if (!apply) {
		console.log(`\nDry run only. Re-run with --apply to commit.`);
		return;
	}

	if (ops.length === 0) {
		console.log(`\nNothing to write.`);
		return;
	}

	console.log(`\n→ Committing patch…`);
	const result = await patch.commit();
	console.log(`✓ Patched. New _rev: ${result._rev}`);
	console.log(`  Open https://cms.nair.mn → Нүүр — Уран бүтээлүүд and verify.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

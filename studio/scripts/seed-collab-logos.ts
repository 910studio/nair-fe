/**
 * Upload partner logos from a local folder to Sanity assets, then replace
 * collabsSection.partners[] with references to them.
 *
 * Usage (from studio/):
 *   pnpm dlx tsx scripts/seed-collab-logos.ts                            # dry-run, default folder
 *   pnpm dlx tsx scripts/seed-collab-logos.ts --apply                    # commit
 *   pnpm dlx tsx scripts/seed-collab-logos.ts --dir "/path/to/PNG"       # override folder
 */

import 'dotenv/config';
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { randomBytes } from 'node:crypto';
import { createClient } from '@sanity/client';

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production';
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const API_VERSION = '2024-10-01';

if (!PROJECT_ID || !TOKEN) {
	console.error('Missing SANITY_STUDIO_PROJECT_ID or SANITY_WRITE_TOKEN in studio/.env');
	process.exit(1);
}

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const dirIdx = args.indexOf('--dir');
const DEFAULT_DIR = '/Users/graychillin/Downloads/Ulzii tur/PNG';
const DIR = dirIdx >= 0 ? args[dirIdx + 1] : DEFAULT_DIR;
const DOC_ID = 'collabsSection';

const client = createClient({
	projectId: PROJECT_ID,
	dataset: DATASET,
	token: TOKEN,
	apiVersion: API_VERSION,
	useCdn: false
});

const k = () => randomBytes(6).toString('hex');

// Filename → display name. Falls back to title-case of the filename stem.
const NAME_MAP: Record<string, string> = {
	ASTORY: 'Astory',
	BEETTIVE: 'Beettive',
	'CAFE DE KIDDO': 'Cafe de Kiddo',
	DREAMCASTLE: 'DreamCastle',
	HANEUL: 'Haneul',
	HAPPYKIDS: 'Happy Kids',
	JUULCHIN: 'Juulchin',
	KOKO: 'Koko',
	MAK: 'MAK',
	MN: 'MN',
	NAYAD: 'Nayad',
	'PANDORA KIDS CENTER': 'Pandora Kids Center',
	QUARTZ: 'Quartz',
	'SEA KIDS': 'Sea Kids',
	SILA: 'Sila',
	STARKIDZ: 'StarKidz',
	'SUNNY KIDS CAFE': 'Sunny Kids Cafe',
	'TREE HOUSE': 'Tree House',
	WONDERKIDS: 'WonderKids'
};

function displayName(stem: string): string {
	const upper = stem.toUpperCase();
	if (NAME_MAP[upper]) return NAME_MAP[upper];
	return stem
		.toLowerCase()
		.split(/[\s_-]+/)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');
}

interface PartnerOut {
	_key: string;
	_type: 'object';
	name: string;
	logo: {
		_type: 'image';
		asset: { _type: 'reference'; _ref: string };
	};
}

async function main() {
	const files = readdirSync(DIR)
		.filter((f) => /\.(png|jpe?g|svg|webp)$/i.test(f))
		.sort();

	console.log(`Found ${files.length} logo files in ${DIR}\n`);
	for (const f of files) console.log(`  · ${f}  →  ${displayName(basename(f, extname(f)))}`);

	if (!apply) {
		console.log(`\nDry run only. Re-run with --apply to upload + patch.`);
		return;
	}

	console.log(`\n→ Uploading ${files.length} files…`);
	const partners: PartnerOut[] = [];
	for (const file of files) {
		const stem = basename(file, extname(file));
		const filePath = join(DIR, file);
		const buf = readFileSync(filePath);
		const ext = extname(file).slice(1).toLowerCase();
		const asset = await client.assets.upload('image', buf, {
			filename: file,
			contentType: ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`
		});
		console.log(`  ✓ ${file}  →  ${asset._id}`);
		partners.push({
			_key: k(),
			_type: 'object',
			name: displayName(stem),
			logo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
		});
	}

	console.log(`\n→ Patching ${DOC_ID}…`);
	const result = await client.patch(DOC_ID).set({ partners }).commit();
	console.log(`✓ Patched. New _rev: ${result._rev}`);
	console.log(`  Open https://nair.mn — collab marquee should show all ${partners.length} logos.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

/**
 * Recover the deleted "Угталтын хэсэг" (part-welcome) part from service-khurim
 * by walking Sanity's history API.
 *
 * Usage:
 *   From studio/:
 *     pnpm dlx tsx scripts/restore-khurim-welcome.ts        # dry-run (default)
 *     pnpm dlx tsx scripts/restore-khurim-welcome.ts --apply  # actually patch
 */

import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { createClient } from '@sanity/client';

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production';
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const DOC_ID = 'service-khurim';
const PART_ID = 'part-welcome';
const API_VERSION = '2024-10-01';

if (!PROJECT_ID || !TOKEN) {
	console.error('Missing SANITY_STUDIO_PROJECT_ID or SANITY_WRITE_TOKEN in studio/.env');
	process.exit(1);
}

const apply = process.argv.includes('--apply');
const k = () => randomBytes(6).toString('hex');

const client = createClient({
	projectId: PROJECT_ID,
	dataset: DATASET,
	token: TOKEN,
	apiVersion: API_VERSION,
	useCdn: false
});

interface Part {
	_key?: string;
	partId?: string;
	[key: string]: unknown;
}

interface ServiceDoc {
	_id: string;
	_rev: string;
	parts?: Part[];
	[key: string]: unknown;
}

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
		return out as unknown as T;
	}
	return value;
}

async function fetchDocAtRevision(id: string, revision: string): Promise<ServiceDoc | null> {
	const url = `/data/history/${DATASET}/documents/${id}?revision=${revision}`;
	try {
		const res = await client.request<{ documents: ServiceDoc[] }>({ url });
		return res.documents?.[0] ?? null;
	} catch (err) {
		console.error(`failed to fetch revision ${revision}:`, (err as Error).message);
		return null;
	}
}

interface Transaction {
	id: string;
	timestamp: string;
	author?: string;
	documentIDs?: string[];
}

async function fetchTransactions(docId: string): Promise<Transaction[]> {
	// NDJSON stream
	const url = `/data/history/${DATASET}/transactions/${docId}?excludeContent=true`;
	const text = await client.request<string>({ url });
	const lines = typeof text === 'string' ? text.split('\n') : [];
	return lines
		.filter((l) => l.trim())
		.map((l) => JSON.parse(l) as Transaction);
}

async function main() {
	console.log(`\n→ Fetching current ${DOC_ID}...`);
	const current = await client.getDocument<ServiceDoc>(DOC_ID);
	if (!current) {
		console.error(`Document ${DOC_ID} not found.`);
		process.exit(1);
	}

	const currentParts = current.parts ?? [];
	const currentPartIds = currentParts.map((p) => p.partId);
	console.log(`  Current parts: ${currentPartIds.join(', ') || '(none)'}`);

	const alreadyHas = currentParts.some((p) => p.partId === PART_ID);
	if (alreadyHas) {
		console.log(`\n✓ ${PART_ID} already present. Nothing to restore.`);
		return;
	}

	console.log(`\n→ Walking transaction history for ${DOC_ID}...`);
	const txs = await fetchTransactions(DOC_ID);
	console.log(`  Found ${txs.length} transactions (most recent first)`);

	let restored: Part | null = null;
	let restoredFromRev: string | null = null;
	let restoredAt: string | null = null;

	for (const tx of txs) {
		const doc = await fetchDocAtRevision(DOC_ID, tx.id);
		if (!doc) continue;
		const found = (doc.parts ?? []).find((p) => p.partId === PART_ID);
		if (found) {
			restored = found;
			restoredFromRev = tx.id;
			restoredAt = tx.timestamp;
			console.log(`  ✓ Found ${PART_ID} in revision ${tx.id} (${tx.timestamp})`);
			break;
		} else {
			console.log(`  · revision ${tx.id} (${tx.timestamp}) — not present`);
		}
	}

	if (!restored) {
		console.error(`\n✗ Could not find ${PART_ID} in any historical revision.`);
		process.exit(2);
	}

	// Re-key the restored item so Sanity sees it as a fresh array entry.
	const cleaned = addKeysDeep(restored);

	console.log(`\n→ Restoration plan:`);
	console.log(`  Insert this part at parts[0] of ${DOC_ID}`);
	console.log(`  Source revision: ${restoredFromRev} (${restoredAt})`);
	console.log(`  --- restored part (preview) ---`);
	console.log(JSON.stringify(cleaned, null, 2).slice(0, 2000));
	console.log(`  --- end preview ---`);

	if (!apply) {
		console.log(`\nDry run only. Re-run with --apply to write the patch.`);
		return;
	}

	console.log(`\n→ Applying patch...`);
	const result = await client
		.patch(DOC_ID)
		.insert('before', 'parts[0]', [cleaned])
		.commit();
	console.log(`✓ Patched. New _rev: ${result._rev}`);
	console.log(`  Open https://cms.nair.mn and verify Хурим > Үе шатууд.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

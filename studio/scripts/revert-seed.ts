/**
 * Revert documents that the seed clobbered, by time-travelling each one to its
 * state immediately before a cutoff timestamp using Sanity's history API.
 *
 * Usage (from studio/):
 *   pnpm dlx tsx scripts/revert-seed.ts --before "2026-05-10T05:00:00Z"
 *   pnpm dlx tsx scripts/revert-seed.ts --before "2026-05-10T05:00:00Z" --apply
 *
 * Without --apply it dry-runs (prints diff summary, no writes).
 *
 * Doc IDs are parsed from scripts/seed.ts so this stays in sync if the seed
 * changes. Add a doc ID to the seed → it's automatically a revert candidate.
 */

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
const beforeIdx = args.indexOf('--before');
const beforeArg = beforeIdx >= 0 ? args[beforeIdx + 1] : undefined;

if (!beforeArg) {
	console.error(
		'Missing --before <ISO timestamp>. Pass the moment immediately BEFORE the bad seed ran.\n' +
			'Example: --before "2026-05-10T05:00:00Z"'
	);
	process.exit(1);
}

const cutoff = new Date(beforeArg);
if (Number.isNaN(cutoff.getTime())) {
	console.error(`--before "${beforeArg}" is not a valid ISO timestamp`);
	process.exit(1);
}
const cutoffIso = cutoff.toISOString();

const client = createClient({
	projectId: PROJECT_ID,
	dataset: DATASET,
	token: TOKEN,
	apiVersion: API_VERSION,
	useCdn: false
});

// Parse doc IDs out of seed.ts so this stays in sync automatically.
function parseSeedDocIds(): string[] {
	const seedPath = join(__dirname, 'seed.ts');
	const src = readFileSync(seedPath, 'utf8');
	const ids = new Set<string>();
	for (const m of src.matchAll(/_id:\s*['"]([^'"]+)['"]/g)) {
		ids.add(m[1]);
	}
	return Array.from(ids);
}

async function fetchAtTime(id: string, isoTime: string): Promise<Record<string, unknown> | null> {
	const url = `/data/history/${DATASET}/documents/${id}?time=${encodeURIComponent(isoTime)}`;
	try {
		const res = await client.request<{ documents: Array<Record<string, unknown>> }>({ url });
		return res.documents?.[0] ?? null;
	} catch (err) {
		const msg = (err as Error).message || '';
		// Doc didn't exist at that time → null
		if (/404|not found/i.test(msg)) return null;
		throw err;
	}
}

async function fetchCurrent(id: string): Promise<Record<string, unknown> | null> {
	return (await client.getDocument(id)) as Record<string, unknown> | null;
}

function summarizeDoc(doc: Record<string, unknown> | null): string {
	if (!doc) return '(absent)';
	const rev = (doc._rev as string | undefined) ?? '(no rev)';
	const updated = (doc._updatedAt as string | undefined) ?? '(no updated_at)';
	return `_rev=${rev.slice(0, 8)} updatedAt=${updated}`;
}

interface Plan {
	id: string;
	action: 'restore' | 'delete' | 'noop';
	current: Record<string, unknown> | null;
	historical: Record<string, unknown> | null;
}

async function buildPlan(): Promise<Plan[]> {
	const ids = parseSeedDocIds();
	console.log(`\nParsed ${ids.length} candidate doc IDs from seed.ts`);
	console.log(`Cutoff: ${cutoffIso}\n`);

	const plans: Plan[] = [];
	for (const id of ids) {
		const [current, historical] = await Promise.all([fetchCurrent(id), fetchAtTime(id, cutoffIso)]);
		const currentRev = (current?._rev as string | undefined) ?? null;
		const historicalRev = (historical?._rev as string | undefined) ?? null;

		let action: Plan['action'];
		if (!current && !historical) action = 'noop';
		else if (current && !historical) action = 'delete'; // seed-created junk
		else if (currentRev && historicalRev && currentRev === historicalRev) action = 'noop';
		else action = 'restore';

		plans.push({ id, action, current, historical });
	}
	return plans;
}

async function main() {
	const plans = await buildPlan();

	const restore = plans.filter((p) => p.action === 'restore');
	const del = plans.filter((p) => p.action === 'delete');
	const noop = plans.filter((p) => p.action === 'noop');

	console.log(`Plan summary:`);
	console.log(`  ${restore.length} to restore (was clobbered)`);
	console.log(`  ${del.length} to delete (created by seed, didn't exist before)`);
	console.log(`  ${noop.length} no-op (unchanged or never existed)\n`);

	for (const p of restore) {
		console.log(`  RESTORE  ${p.id}`);
		console.log(`           current:    ${summarizeDoc(p.current)}`);
		console.log(`           historical: ${summarizeDoc(p.historical)}`);
	}
	for (const p of del) {
		console.log(`  DELETE   ${p.id}  (current ${summarizeDoc(p.current)})`);
	}

	if (!apply) {
		console.log(`\nDry run only. Re-run with --apply to commit. Backup is automatic via Sanity history.`);
		return;
	}

	if (restore.length === 0 && del.length === 0) {
		console.log(`\nNothing to do.`);
		return;
	}

	console.log(`\nApplying in a single transaction…`);
	const tx = client.transaction();
	for (const p of restore) {
		if (!p.historical) continue;
		// Strip system fields so createOrReplace gives the doc a fresh _rev.
		const { _rev: _r, _updatedAt: _u, _createdAt: _c, ...rest } = p.historical as Record<
			string,
			unknown
		>;
		void _r;
		void _u;
		void _c;
		tx.createOrReplace(rest as { _id: string; _type: string });
	}
	for (const p of del) {
		tx.delete(p.id);
	}
	const result = await tx.commit();
	console.log(`✓ Committed. Transaction id: ${result.transactionId}`);
	console.log(`  Open https://cms.nair.mn and verify.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

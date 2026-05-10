/**
 * One-time migration: seed `orderRank` (LexoRank string) on every service doc
 * based on the current numeric `order` field, so the orderable-document-list
 * plugin has a stable starting point for drag-and-drop reordering.
 *
 * Idempotent — re-running just rewrites ranks in the same order. Safe.
 *
 * Usage (from studio/):
 *   pnpm dlx tsx scripts/migrate-service-orderrank.ts            # dry-run
 *   pnpm dlx tsx scripts/migrate-service-orderrank.ts --apply    # commit
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production';
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const API_VERSION = '2024-10-01';

if (!PROJECT_ID || !TOKEN) {
	console.error('Missing SANITY_STUDIO_PROJECT_ID or SANITY_WRITE_TOKEN in studio/.env');
	process.exit(1);
}

const apply = process.argv.includes('--apply');

const client = createClient({
	projectId: PROJECT_ID,
	dataset: DATASET,
	token: TOKEN,
	apiVersion: API_VERSION,
	useCdn: false
});

interface ServiceRow {
	_id: string;
	title?: { mn?: string; en?: string };
	order?: number;
	orderRank?: string;
}

async function main() {
	// Exclude drafts (drafts.* prefix). Drafts inherit on publish.
	const docs = await client.fetch<ServiceRow[]>(
		`*[_type == "service" && !(_id in path("drafts.**"))]{ _id, title, order, orderRank } | order(coalesce(order, 9999) asc, _id asc)`
	);

	let rank = LexoRank.middle();
	const ops: Array<{ id: string; title: string; from: string; to: string }> = [];
	for (const doc of docs) {
		const next = rank.toString();
		ops.push({
			id: doc._id,
			title: doc.title?.mn || doc.title?.en || doc._id,
			from: doc.orderRank ?? '(unset)',
			to: next
		});
		rank = rank.genNext();
	}

	console.log(`\nWill set orderRank on ${ops.length} service docs:\n`);
	for (const op of ops) {
		console.log(`  ${op.title.padEnd(36)} ${op.from.padEnd(12)} → ${op.to}`);
	}

	if (!apply) {
		console.log(`\nDry run only. Re-run with --apply to commit.`);
		return;
	}

	const tx = client.transaction();
	for (const op of ops) {
		tx.patch(op.id, (p) => p.set({ orderRank: op.to }));
	}
	const result = await tx.commit();
	console.log(`\n✓ Committed. Transaction id: ${result.transactionId}`);
	console.log(`  Open https://cms.nair.mn → Үйлчилгээ — drag rows to reorder.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

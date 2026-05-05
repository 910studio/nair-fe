import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { SANITY_DATASET, SANITY_PROJECT_ID } from './client';

const builder = SANITY_PROJECT_ID
	? imageUrlBuilder({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET })
	: null;

export function urlFor(source: SanityImageSource) {
	if (!builder) {
		throw new Error('Sanity not configured — set PUBLIC_SANITY_PROJECT_ID');
	}
	return builder.image(source);
}

export function fileUrl(
	asset: { _ref?: string; url?: string } | undefined | null
): string | null {
	if (!asset) return null;
	if (asset.url) return asset.url;
	if (!asset._ref || !SANITY_PROJECT_ID) return null;
	// file-{id}-{ext} → https://cdn.sanity.io/files/{projectId}/{dataset}/{id}.{ext}
	const [, id, ext] = asset._ref.split('-');
	if (!id || !ext) return null;
	return `https://cdn.sanity.io/files/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}.${ext}`;
}

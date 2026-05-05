import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { urlFor } from './image';

type Opts = {
	w: number;
	h?: number;
	q?: number;
	fit?: 'crop' | 'max' | 'fill' | 'min';
};

export function imgUrl(
	src: SanityImageSource | undefined | null,
	opts: Opts
): string {
	if (!src) return '';
	try {
		let b = urlFor(src).width(opts.w).quality(opts.q ?? 70).auto('format');
		if (opts.h) b = b.height(opts.h);
		if (opts.fit) b = b.fit(opts.fit);
		return b.url();
	} catch {
		return '';
	}
}

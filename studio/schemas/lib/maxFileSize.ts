import type { FileRule, ImageRule, ValidationContext } from 'sanity';

type AssetLike = { asset?: { _ref?: string } } | undefined;

function makeValidator(maxMB: number) {
	const maxBytes = maxMB * 1024 * 1024;
	return async (value: AssetLike, context: ValidationContext) => {
		const ref = value?.asset?._ref;
		if (!ref) return true;
		const client = context.getClient({ apiVersion: '2024-01-01' });
		const asset = await client.fetch<{ size?: number } | null>(
			'*[_id == $id][0]{size}',
			{ id: ref }
		);
		const size = asset?.size ?? 0;
		if (size > maxBytes) {
			const mb = (size / 1024 / 1024).toFixed(1);
			return `Файл хэт том байна (${mb}MB). Дээд хэмжээ: ${maxMB}MB. Жижигрүүлж дахин оруулна уу.`;
		}
		return true;
	};
}

export function maxFileSize(maxMB: number) {
	return (rule: FileRule) => rule.custom(makeValidator(maxMB));
}

export function maxImageSize(maxMB: number) {
	return (rule: ImageRule) => rule.custom(makeValidator(maxMB));
}

// For inline `{ type: 'image' }` members inside arrays — the validation
// type there is the generic Rule, not ImageRule. Same impl, looser typing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const maxInlineImageSize = (maxMB: number) => (rule: any) =>
	rule.custom(makeValidator(maxMB));

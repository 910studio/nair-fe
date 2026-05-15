import type { FileRule, ValidationContext } from 'sanity';

type FileLike = { asset?: { _ref?: string } } | undefined;

export function maxFileSize(maxMB: number) {
	const maxBytes = maxMB * 1024 * 1024;
	return (rule: FileRule) =>
		rule.custom(async (value: FileLike, context: ValidationContext) => {
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
		});
}

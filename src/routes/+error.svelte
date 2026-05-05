<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import StockScreen from '$lib/components/StockScreen.svelte';

	const status = $derived(page.status);
	const message = $derived(page.error?.message ?? '');

	const title = $derived(
		status === 404
			? m.error_404_title()
			: status >= 500
				? m.error_500_title()
				: m.error_generic_title()
	);

	const body = $derived(
		status === 404 ? m.error_404_body() : status >= 500 ? m.error_500_body() : message
	);
</script>

<StockScreen
	{status}
	{title}
	{body}
	cta={{ label: m.error_back_home(), href: localizeHref('/') }}
/>

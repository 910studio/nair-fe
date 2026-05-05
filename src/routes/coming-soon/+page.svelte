<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import StockScreen from '$lib/components/StockScreen.svelte';
</script>

<svelte:head>
	<title>{m.coming_soon_title()} · Nair Entertainment</title>
</svelte:head>

<StockScreen
	title={m.coming_soon_title()}
	body={m.coming_soon_body()}
	cta={{ label: m.error_back_home(), href: localizeHref('/') }}
/>

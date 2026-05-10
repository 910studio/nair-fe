<script lang="ts">
	import { SITE, type SeoOutput } from '$lib/seo';
	import type { Locale } from '$lib/paraglide/runtime';

	let {
		seo,
		locale,
		jsonLd
	}: {
		seo: SeoOutput;
		locale: Locale;
		/** Optional JSON-LD object(s) — Schema.org structured data. */
		jsonLd?: Record<string, unknown> | Record<string, unknown>[];
	} = $props();

	const ogLocale = $derived(locale === 'mn' ? 'mn_MN' : 'en_US');
	const jsonLdScripts = $derived.by(() => {
		if (!jsonLd) return [] as string[];
		const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
		return arr.map((obj) => JSON.stringify(obj));
	});
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={seo.canonical} />
	{#if seo.noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow, max-image-preview:large" />
	{/if}

	{#each seo.alternates as alt (alt.locale)}
		<link rel="alternate" hreflang={alt.locale} href={alt.href} />
	{/each}
	<link
		rel="alternate"
		hreflang="x-default"
		href={seo.alternates.find((a) => a.locale === SITE.baseLocale)?.href ?? seo.canonical}
	/>

	<!-- Open Graph -->
	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:type" content={seo.type} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:url" content={seo.canonical} />
	<meta property="og:image" content={seo.image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content={ogLocale} />
	{#each seo.alternates.filter((a) => a.locale !== locale) as alt (alt.locale)}
		<meta property="og:locale:alternate" content={alt.locale === 'mn' ? 'mn_MN' : 'en_US'} />
	{/each}

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.image} />

	{#each jsonLdScripts as json, i (i)}
		{@html `<script type="application/ld+json">${json}</` + `script>`}
	{/each}
</svelte:head>

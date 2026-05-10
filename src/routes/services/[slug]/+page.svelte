<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { t } from '$lib/sanity';
	import ServiceSmall from '$lib/components/service/ServiceSmall.svelte';
	import ServiceMedium from '$lib/components/service/ServiceMedium.svelte';
	import ServiceBig from '$lib/components/service/ServiceBig.svelte';
	import LogoBelt from '$lib/components/LogoBelt.svelte';

	let { data } = $props();
	const locale = $derived(getLocale());
	const service = $derived(data.service);
	const phone = $derived(data.siteSettings?.phone ?? '99994455');
	const labels = $derived({
		price: data.siteSettings?.serviceLabelPrice,
		contactLabel: data.siteSettings?.serviceContactLabel,
		contactCta: data.siteSettings?.serviceContactCta
	});

	const beltTitle = $derived(
		t(data.logoBelt?.title, locale) || m.home_collabs_title()
	);
</script>

{#if service.layout === 'small'}
	<ServiceSmall {service} {phone} {labels} />
{:else if service.layout === 'medium'}
	<ServiceMedium {service} {phone} {labels} />
{:else if service.layout === 'big'}
	<ServiceBig {service} {phone} {labels} />
{/if}

{#if data.logoBelt}
	<LogoBelt title={beltTitle} partners={data.logoBelt.partners} />
{/if}

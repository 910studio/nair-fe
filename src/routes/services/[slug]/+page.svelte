<script lang="ts">
	import ServiceSmall from '$lib/components/service/ServiceSmall.svelte';
	import ServiceMedium from '$lib/components/service/ServiceMedium.svelte';
	import ServiceBig from '$lib/components/service/ServiceBig.svelte';

	let { data } = $props();
	const service = $derived(data.service);
	const phone = $derived(data.siteSettings?.phone ?? '99994455');
	const labels = $derived({
		price: data.siteSettings?.serviceLabelPrice,
		contactLabel: data.siteSettings?.serviceContactLabel,
		contactCta: data.siteSettings?.serviceContactCta
	});
</script>

{#if service.layout === 'small'}
	<ServiceSmall {service} {phone} {labels} />
{:else if service.layout === 'medium'}
	<ServiceMedium {service} {phone} {labels} />
{:else if service.layout === 'big'}
	<ServiceBig {service} {phone} {labels} />
{/if}

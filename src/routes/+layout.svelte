<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';
	import { t } from '$lib/sanity';
	import Header from '$lib/components/Header.svelte';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import type { LayoutData } from './$types';
	import './layout.css';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const INTRO_KEY = 'nair:intro-seen';
	let showIntro = $state(false);

	onMount(() => {
		if (sessionStorage.getItem(INTRO_KEY)) return;
		showIntro = true;
	});

	function dismissIntro() {
		sessionStorage.setItem(INTRO_KEY, '1');
		showIntro = false;
	}

	const locale = $derived(getLocale());
	const phone = $derived(data.siteSettings?.phone ?? '76004455');
	const phoneHref = $derived(`tel:${phone.replace(/\s+/g, '')}`);

	const socials = $derived(data.siteSettings?.socials ?? []);
	const socialOf = (platform: string) =>
		socials.find((s) => s.platform === platform)?.url || '#';
	const fbHref = $derived(socialOf('facebook'));
	const igHref = $derived(socialOf('instagram'));
	const ytHref = $derived(socialOf('youtube'));

	const year = new Date().getFullYear();
	const copyright = $derived(
		t(data.siteSettings?.footerCopyright, locale).replace('{year}', String(year)) ||
			`@${year}. Nair Entertainment`
	);
</script>

<svelte:head><link rel="icon" type="image/svg+xml" href="/client-materials/Logo/symbol.svg" /></svelte:head>

{#if showIntro}
	<LoadingScreen onDismiss={dismissIntro} />
{/if}

<Header services={data.services ?? []} />

<main>
	{@render children()}
</main>

<footer class="site-footer" data-bg="light">
	<span class="site-footer__copy">{copyright}</span>

	<div class="site-footer__actions">
		<a class="ftbtn ftbtn--with-text" href={phoneHref} aria-label="Phone">
			<svg
				class="ftbtn__icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path
					d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"
				/>
			</svg>
			<span class="ftbtn__label">{phone}</span>
		</a>

		<a class="ftbtn ftbtn--icon" href={fbHref} aria-label="Facebook" target="_blank" rel="noopener">
			<svg class="ftbtn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path
					d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z"
				/>
			</svg>
		</a>

		<a class="ftbtn ftbtn--icon" href={igHref} aria-label="Instagram" target="_blank" rel="noopener">
			<svg
				class="ftbtn__icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<rect x="3" y="3" width="18" height="18" rx="5" />
				<circle cx="12" cy="12" r="4" />
				<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
			</svg>
		</a>

		<a class="ftbtn ftbtn--icon" href={ytHref} aria-label="YouTube" target="_blank" rel="noopener">
			<svg class="ftbtn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path
					d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"
				/>
			</svg>
		</a>
	</div>
</footer>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>

<style>
	.site-footer {
		width: 100%;
		padding: 64px;
		background: #fff;
		border-top: 1px solid rgba(6, 9, 12, 0.04);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 24px;
		font-family: 'Google Sans', 'Product Sans', 'Inter', system-ui, sans-serif;
	}
	.site-footer__copy {
		color: rgba(6, 9, 12, 0.48);
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.site-footer__actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.ftbtn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: rgba(6, 9, 12, 0.04);
		border-radius: 12px;
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		color: #06090c;
		text-decoration: none;
		transition:
			background-color 0.2s ease,
			outline-color 0.2s ease;
	}
	.ftbtn:hover {
		background: rgba(6, 9, 12, 0.08);
		outline-color: rgba(6, 9, 12, 0.16);
	}
	.ftbtn:focus-visible {
		outline: 3px solid #06090c;
		outline-offset: 3px;
	}
	.ftbtn__icon {
		width: 24px;
		height: 24px;
		flex: none;
	}
	.ftbtn__label {
		font-size: 18px;
		font-weight: 600;
		line-height: 24px;
		letter-spacing: 0.36px;
	}
	.ftbtn--with-text {
		gap: 12px;
		padding: 16px 24px 16px 20px;
	}
	.ftbtn--icon {
		padding: 16px;
	}

	@media (max-width: 768px) {
		.site-footer {
			padding: 32px 20px 24px;
			flex-direction: column;
			align-items: center;
			gap: 32px;
		}
		.site-footer__copy {
			order: 2;
			font-size: 14px;
			line-height: 20px;
			letter-spacing: 0.28px;
		}
		.site-footer__actions {
			order: 1;
			align-self: stretch;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 12px;
		}
		.ftbtn {
			border-radius: 8px;
		}
		.ftbtn--with-text {
			grid-column: 1 / -1;
			padding: 12px 20px 12px 16px;
			gap: 10px;
		}
		.ftbtn--with-text .ftbtn__icon {
			width: 20px;
			height: 20px;
		}
		.ftbtn--with-text .ftbtn__label {
			font-size: 16px;
			line-height: 24px;
			letter-spacing: 0.32px;
		}
		.ftbtn--icon {
			padding: 12px;
		}
	}
</style>

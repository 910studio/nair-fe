<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref, setLocale, type Locale } from '$lib/paraglide/runtime';
	import type { Service as SanityService } from '$lib/sanity/types';
	import ServicesDrawer from './ServicesDrawer.svelte';
	import { drawer } from '$lib/stores/drawer.svelte';

	let {
		services = [],
		phone
	}: {
		services?: SanityService[];
		phone?: string;
	} = $props();

	const otherLocale = $derived<Locale>(getLocale() === 'en' ? 'mn' : 'en');
	const otherLabel = $derived(otherLocale === 'mn' ? 'MN' : 'EN');

	let bgMode = $state<'light' | 'dark'>('light');
	let scrolled = $state(false);
	let headerEl: HTMLElement | undefined = $state();

	function update() {
		if (typeof window === 'undefined' || !headerEl) return;
		scrolled = window.scrollY > 8;
		const headerBottom = headerEl.getBoundingClientRect().bottom;
		const sections = document.querySelectorAll<HTMLElement>('[data-bg]');
		// Pick the DEEPEST matching section (so a child banner with data-bg="dark"
		// always beats a wrapper element with data-bg="light").
		let match: HTMLElement | null = null;
		for (const s of sections) {
			const r = s.getBoundingClientRect();
			if (r.top <= headerBottom && r.bottom > headerBottom) {
				if (!match || match.contains(s)) match = s;
			}
		}
		bgMode = match?.dataset.bg === 'dark' ? 'dark' : 'light';
	}

	// Re-evaluate bgMode whenever the route changes — the next page's [data-bg]
	// sections live in fresh DOM, so wait a tick before measuring.
	$effect(() => {
		// Track pathname for reactivity.
		void page.url.pathname;
		queueMicrotask(update);
	});

	onMount(() => {
		let raf = 0;

		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			cancelAnimationFrame(raf);
		};
	});
</script>

<header
	bind:this={headerEl}
	class="site-header"
	data-bg-mode={bgMode}
	data-scrolled={scrolled ? 'true' : undefined}
>
	<a class="brand" href={localizeHref('/')} aria-label="Nair Entertainment">
		<img src="/client-materials/Logo/logo-dark.svg" alt="" />
	</a>

	<div class="actions">
		<button
			type="button"
			class="btn btn--secondary actions__desktop"
			onclick={() => setLocale(otherLocale)}
			aria-label={m.common_language()}
		>
			<svg
				class="icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
				<path d="M2 12h20" />
			</svg>
			<span>{otherLabel}</span>
		</button>

		<button
			type="button"
			class="btn btn--primary actions__desktop"
			onclick={() => (drawer.open = true)}
			aria-haspopup="dialog"
			aria-expanded={drawer.open}
		>
			<svg
				class="icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<line x1="3" y1="6" x2="21" y2="6" />
				<line x1="3" y1="12" x2="21" y2="12" />
				<line x1="3" y1="18" x2="21" y2="18" />
			</svg>
			<span>{m.header_cta_services()}</span>
		</button>

		<button
			type="button"
			class="btn btn--secondary actions__mobile"
			onclick={() => (drawer.open = true)}
			aria-haspopup="dialog"
			aria-expanded={drawer.open}
			aria-label={m.header_cta_services()}
		>
			<svg
				class="icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<line x1="3" y1="7" x2="21" y2="7" />
				<line x1="3" y1="12" x2="21" y2="12" />
				<line x1="3" y1="17" x2="21" y2="17" />
			</svg>
		</button>
	</div>
</header>

<ServicesDrawer open={drawer.open} onClose={() => drawer.close()} {services} {phone} />

<style>
	.site-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		padding: 20px 64px;
		background: transparent;
		transition: color 0.3s ease;
	}
	/* Top-fading black gradient on dark sections (hero) so the header
	   stays readable without a solid bar. */
	.site-header[data-bg-mode='dark']::before {
		content: '';
		position: absolute;
		inset: 0;
		bottom: auto;
		height: calc(100% + 24px);
		background: linear-gradient(
			180deg,
			rgba(6, 9, 12, 0.65) 0%,
			rgba(6, 9, 12, 0.45) 40%,
			rgba(6, 9, 12, 0) 100%
		);
		pointer-events: none;
		z-index: -1;
	}
	/* Frosted white bar — any light page on scroll (includes service detail,
	   which is force-set to light mode). Top of page stays transparent. */
	.site-header[data-scrolled='true'][data-bg-mode='light'] {
		background: rgba(255, 255, 255, 0.8);
		border-bottom: 1px solid rgba(6, 9, 12, 0.04);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		color: inherit;
	}
	.brand img {
		display: block;
		height: 48px;
		width: auto;
		transition: filter 0.3s ease;
	}
	.site-header[data-bg-mode='dark'] .brand img {
		filter: invert(1);
	}

	.actions {
		display: inline-flex;
		align-items: center;
		gap: 12px;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 16px 12px 14px;
		font: inherit;
		font-size: 14px;
		font-weight: 600;
		line-height: 16px;
		letter-spacing: 0.28px;
		text-decoration: none;
		cursor: pointer;
		border: 0;
		border-radius: 8px;
		overflow: hidden;
		isolation: isolate;
		transition:
			background-color 0.2s ease,
			color 0.2s ease,
			outline-color 0.2s ease,
			box-shadow 0.2s ease;
	}
	.btn--secondary {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	.btn:focus-visible {
		outline: 3px solid currentColor;
		outline-offset: 3px;
	}
	.icon {
		width: 16px;
		height: 16px;
		flex: none;
	}

	/* ─── Over-dark hero (Figma data-dark="False" / Light variant) ─── */
	.site-header[data-bg-mode='dark'] .btn--secondary {
		background: rgba(255, 255, 255, 0.04);
		outline: 1px solid rgba(255, 255, 255, 0.04);
		outline-offset: -1px;
		color: #fff;
	}
	.site-header[data-bg-mode='dark'] .btn--secondary:hover {
		background: rgba(255, 255, 255, 0.12);
		outline-color: rgba(255, 255, 255, 0.18);
	}

	.site-header[data-bg-mode='dark'] .btn--primary {
		background: #fff;
		color: #06090c;
		outline: 1px solid rgba(6, 9, 12, 0.24);
		outline-offset: -1px;
		box-shadow: 0 2px 24px rgba(255, 255, 255, 0.32);
	}
	.site-header[data-bg-mode='dark'] .btn--primary:hover {
		background: #f5f5f5;
		box-shadow: 0 2px 32px rgba(255, 255, 255, 0.48);
	}

	/* ─── Over-light section (Figma data-dark="True" / Dark variant) ─── */
	.site-header[data-bg-mode='light'] .btn--secondary {
		background: rgba(6, 9, 12, 0.04);
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		color: #06090c;
	}
	.site-header[data-bg-mode='light'] .btn--secondary:hover {
		background: rgba(6, 9, 12, 0.08);
		outline-color: rgba(6, 9, 12, 0.16);
	}

	.site-header[data-bg-mode='light'] .btn--primary {
		background: #06090c;
		color: #fff;
		outline: 1px solid rgba(255, 255, 255, 0.24);
		outline-offset: -1px;
		box-shadow: 0 2px 24px rgba(6, 9, 12, 0.32);
	}
	.site-header[data-bg-mode='light'] .btn--primary:hover {
		background: #1a1f24;
		box-shadow: 0 2px 32px rgba(6, 9, 12, 0.48);
	}

	.actions__mobile {
		display: none;
	}

	@media (max-width: 768px) {
		.site-header {
			padding: 20px;
		}
		.brand img {
			height: 40px;
		}
		.actions__desktop {
			display: none;
		}
		.actions__mobile {
			display: inline-flex;
			padding: 10px;
		}
		.actions__mobile .icon {
			width: 20px;
			height: 20px;
		}
	}
</style>

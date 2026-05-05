<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, setLocale, type Locale } from '$lib/paraglide/runtime';
	import type { Service as SanityService } from '$lib/sanity/types';

	type Props = {
		open: boolean;
		onClose: () => void;
		services?: SanityService[];
	};
	let { open, onClose, services = [] }: Props = $props();

	const locale = $derived(getLocale());
	const items = $derived(
		services.map((s) => ({
			slug: s.slug.current,
			label: s.title?.[locale] ?? s.title?.en ?? s.slug.current
		}))
	);
	const otherLocale = $derived<Locale>(getLocale() === 'en' ? 'mn' : 'en');
	const otherLabel = $derived(otherLocale === 'mn' ? 'MN' : 'EN');

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && open) onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = '';
		};
	});
</script>

<div class="drawer-root" class:open aria-hidden={!open}>
	<button
		type="button"
		class="drawer-backdrop"
		onclick={onClose}
		aria-label="Close menu"
		tabindex={open ? 0 : -1}
	></button>

	<aside class="drawer" aria-modal="true" aria-hidden={!open}>
		<header class="drawer__head">
			<a class="drawer__brand" href={localizeHref('/')} onclick={onClose}>
				<img src="/client-materials/Logo/logo-dark.svg" alt="Nair Entertainment" />
			</a>
			<div class="drawer__head-actions">
				<button
					type="button"
					class="drawer__chip drawer__locale"
					onclick={() => setLocale(otherLocale)}
					tabindex={open ? 0 : -1}
					aria-label="Change language"
				>
					{otherLabel}
				</button>
				<button
					type="button"
					class="drawer__chip drawer__close"
					onclick={onClose}
					aria-label="Close"
					tabindex={open ? 0 : -1}
				>
					<svg
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						aria-hidden="true"
					>
						<path d="M5 5l10 10M15 5L5 15" />
					</svg>
				</button>
			</div>
		</header>

		<nav class="drawer__nav" aria-label="Services">
			<ul>
				{#each items as item (item.slug)}
					<li>
						<a href={localizeHref(`/services/${item.slug}`)} onclick={onClose} tabindex={open ? 0 : -1}>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<footer class="drawer__foot">
			<a class="drawer__phone" href="tel:99994455" tabindex={open ? 0 : -1}>
				<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path
						d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
					/>
					<path
						d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
						style="display:none"
					/>
					<path
						d="M3.654 1.328a.678.678 0 00-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 004.168 6.608 17.6 17.6 0 006.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 00-.063-1.015l-2.307-1.794a.678.678 0 00-.58-.122l-2.19.547a1.745 1.745 0 01-1.657-.459L5.482 8.062a1.745 1.745 0 01-.46-1.657l.548-2.19a.678.678 0 00-.122-.58L3.654 1.328z"
					/>
				</svg>
				<span>99994455</span>
			</a>

			<div class="drawer__socials">
				<a
					class="drawer__social"
					href="#"
					aria-label="Facebook"
					tabindex={open ? 0 : -1}
				>
					<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path
							d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z"
						/>
					</svg>
				</a>
				<a
					class="drawer__social"
					href="#"
					aria-label="Instagram"
					tabindex={open ? 0 : -1}
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<rect x="3" y="3" width="18" height="18" rx="5" />
						<circle cx="12" cy="12" r="4" />
						<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
					</svg>
				</a>
				<a
					class="drawer__social"
					href="#"
					aria-label="YouTube"
					tabindex={open ? 0 : -1}
				>
					<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path
							d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1c.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"
						/>
					</svg>
				</a>
			</div>
		</footer>
	</aside>
</div>

<style>
	.drawer-root {
		position: fixed;
		inset: 0;
		z-index: 100;
		pointer-events: none;
	}
	.drawer-root.open {
		pointer-events: auto;
	}

	.drawer-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(6, 9, 12, 0.4);
		border: 0;
		padding: 0;
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	.drawer-root.open .drawer-backdrop {
		opacity: 1;
	}

	.drawer {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		width: min(420px, 100%);
		background: #fff;
		display: flex;
		flex-direction: column;
		transform: translateX(100%);
		transition: transform 0.3s ease;
		font-family: 'Google Sans', 'Product Sans', 'Inter', system-ui, sans-serif;
	}
	.drawer-root.open .drawer {
		transform: translateX(0);
	}

	.drawer__head {
		padding: 20px 24px 20px 32px;
		border-bottom: 1px solid rgba(6, 9, 12, 0.08);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		flex: none;
	}
	.drawer__brand {
		display: inline-flex;
		align-items: center;
	}
	.drawer__brand img {
		height: 48px;
		width: auto;
		display: block;
	}

	.drawer__head-actions {
		display: inline-flex;
		gap: 8px;
		align-items: center;
	}
	.drawer__chip {
		appearance: none;
		width: 40px;
		height: 40px;
		padding: 10px;
		background: rgba(6, 9, 12, 0.04);
		border: 1px solid rgba(6, 9, 12, 0.04);
		border-radius: 8px;
		color: #06090c;
		cursor: pointer;
		display: grid;
		place-items: center;
		flex: none;
		font: 600 13px/1 'Google Sans', 'Product Sans', 'Inter', system-ui, sans-serif;
		letter-spacing: 0.06em;
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		isolation: isolate;
		overflow: hidden;
	}
	.drawer__chip:hover {
		background: rgba(6, 9, 12, 0.08);
	}
	.drawer__close svg {
		width: 20px;
		height: 20px;
	}

	.drawer__nav {
		flex: 1;
		padding: 24px;
		overflow-y: auto;
	}
	.drawer__nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.drawer__nav a {
		display: block;
		padding: 16px 20px;
		color: rgba(6, 9, 12, 0.8);
		font-size: 24px;
		font-weight: 600;
		line-height: 32px;
		letter-spacing: 0.24px;
		text-decoration: none;
		border-radius: 8px;
		transition: background 0.15s ease;
	}
	.drawer__nav a:hover {
		background: rgba(6, 9, 12, 0.04);
	}

	@media (max-width: 768px) {
		.drawer__head {
			padding: 20px;
			height: 80px;
		}
		.drawer__brand img {
			height: 40px;
		}
		.drawer__nav {
			padding: 20px 20px 40px;
		}
		.drawer__nav ul {
			gap: 8px;
		}
		.drawer__nav a {
			padding: 12px 16px;
			font-size: 20px;
			line-height: 28px;
			letter-spacing: 0.4px;
		}
	}

	.drawer__foot {
		padding: 20px 20px 40px;
		border-top: 1px solid rgba(6, 9, 12, 0.04);
		display: flex;
		flex-direction: column;
		gap: 12px;
		flex: none;
	}
	.drawer__phone {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 12px 20px 12px 16px;
		background: rgba(6, 9, 12, 0.04);
		border: 1px solid rgba(6, 9, 12, 0.04);
		border-radius: 8px;
		color: #06090c;
		text-decoration: none;
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.drawer__phone svg {
		width: 20px;
		height: 20px;
		flex: none;
	}
	.drawer__socials {
		display: flex;
		gap: 12px;
	}
	.drawer__social {
		flex: 1;
		display: grid;
		place-items: center;
		padding: 12px;
		background: rgba(6, 9, 12, 0.04);
		border: 1px solid rgba(6, 9, 12, 0.04);
		border-radius: 8px;
		color: #06090c;
	}
	.drawer__social svg {
		width: 24px;
		height: 24px;
	}
</style>

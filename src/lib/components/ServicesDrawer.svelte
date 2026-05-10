<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, setLocale, type Locale } from '$lib/paraglide/runtime';
	import type { Service as SanityService } from '$lib/sanity/types';

	type Props = {
		open: boolean;
		onClose: () => void;
		services?: SanityService[];
		phone?: string;
	};
	let { open, onClose, services = [], phone }: Props = $props();

	const locale = $derived(getLocale());
	const items = $derived(
		services.map((s) => ({
			slug: s.slug.current,
			label: s.title?.[locale] ?? s.title?.mn ?? s.slug.current
		}))
	);
	const otherLocale = $derived<Locale>(getLocale() === 'en' ? 'mn' : 'en');
	const otherLabel = $derived(otherLocale === 'mn' ? 'MN' : 'EN');

	const phoneText = $derived(phone || '76004455');
	const phoneHref = $derived(`tel:${phoneText.replace(/\s+/g, '')}`);

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

	<aside class="drawer" role="dialog" aria-modal="true" aria-hidden={!open}>
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
			<a class="drawer__phone" href={phoneHref} tabindex={open ? 0 : -1}>
				<svg
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
				<span>{phoneText}</span>
			</a>
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
</style>

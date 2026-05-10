<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import { t, imgUrl, SANITY_CONFIGURED } from '$lib/sanity';
	import { disciplineTransition } from '$lib/stores/disciplineTransition.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const locale = $derived(getLocale());

	$effect(() => {
		disciplineTransition.arm(data.slug);
	});

	function goBack(e: MouseEvent) {
		if (typeof window !== 'undefined' && window.history.length > 1) {
			e.preventDefault();
			window.history.back();
		}
	}

	const title = $derived.by(() => {
		if (data.cms?.title) return t(data.cms.title, locale);
		return data.fallback?.[locale === 'en' ? 'en' : 'mn'] ?? '';
	});

	const tagline = $derived(data.cms?.tagline ? t(data.cms.tagline, locale) : '');
	const description = $derived(data.cms?.description ? t(data.cms.description, locale) : '');

	const heroImage = $derived.by(() => {
		const cms = data.cms;
		if (SANITY_CONFIGURED && cms) {
			const src = cms.heroImage ?? cms.image;
			if (src) return imgUrl(src, { w: 2400, fit: 'max', q: 80 });
		}
		return `/client-materials/disciplines/${data.slug}.png`;
	});

	const gallery = $derived.by(() => {
		if (!SANITY_CONFIGURED || !data.cms?.gallery?.length) return [] as string[];
		return data.cms.gallery.map((img) => imgUrl(img, { w: 1600, fit: 'max', q: 75 }));
	});
</script>

<article class="discipline" data-bg="dark">
	<div class="discipline__hero">
		<img
			class="discipline__img"
			src={heroImage}
			alt=""
			style:view-transition-name={`discipline-${data.slug}`}
		/>
		<div class="discipline__scrim" aria-hidden="true"></div>
		<div class="discipline__cap">
			<a class="discipline__back" href="/" onclick={goBack} aria-label="Back">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
					stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<polyline points="15 18 9 12 15 6" />
				</svg>
				<span>Back</span>
			</a>
			<header class="discipline__head">
				{#if tagline}
					<span class="discipline__tagline">{tagline}</span>
				{/if}
				<h1 class="discipline__title">{title}</h1>
			</header>
		</div>
	</div>

	{#if description}
		<section class="discipline__body" data-bg="light">
			<p class="discipline__desc">{description}</p>
		</section>
	{/if}

	{#if gallery.length}
		<section class="discipline__gallery" data-bg="light">
			<div class="discipline__gallery-grid">
				{#each gallery as src, i (i)}
					<img class="discipline__gallery-img" {src} alt="" loading="lazy" />
				{/each}
			</div>
		</section>
	{/if}
</article>

<style>
	.discipline {
		background: #06090c;
		color: #fff;
		display: block;
	}
	.discipline__hero {
		position: relative;
		width: 100%;
		min-height: 100vh;
		overflow: hidden;
		isolation: isolate;
	}
	.discipline__img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
	}
	.discipline__scrim {
		position: absolute;
		inset: 0;
		z-index: 1;
		background: linear-gradient(
			180deg,
			rgba(6, 9, 12, 0.45) 0%,
			rgba(6, 9, 12, 0) 30%,
			rgba(6, 9, 12, 0.85) 100%
		);
		pointer-events: none;
	}
	.discipline__cap {
		position: relative;
		z-index: 2;
		min-height: 100vh;
		padding: 112px 64px 96px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		gap: 32px;
	}
	.discipline__back {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 16px 10px 12px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 999px;
		color: #fff;
		text-decoration: none;
		font-size: 14px;
		font-weight: 500;
		letter-spacing: 0.28px;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		transition: background-color 0.2s ease;
	}
	.discipline__back:hover {
		background: rgba(255, 255, 255, 0.16);
	}
	.discipline__back svg {
		width: 18px;
		height: 18px;
	}
	.discipline__head {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 22ch;
	}
	.discipline__tagline {
		display: inline-block;
		padding: 6px 14px;
		background: rgba(255, 255, 255, 0.12);
		border-radius: 999px;
		color: rgba(255, 255, 255, 0.92);
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		align-self: flex-start;
	}
	.discipline__title {
		margin: 0;
		color: #fff;
		font-size: clamp(48px, 8vw, 120px);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.01em;
	}

	.discipline__body {
		padding: 96px 64px;
		background: #f9f9fb;
		color: #06090c;
	}
	.discipline__desc {
		margin: 0 auto;
		max-width: 60ch;
		font-size: 22px;
		line-height: 1.55;
		font-weight: 400;
		letter-spacing: 0.005em;
		color: rgba(6, 9, 12, 0.78);
		white-space: pre-wrap;
	}

	.discipline__gallery {
		padding: 0 64px 96px;
		background: #f9f9fb;
	}
	.discipline__gallery-grid {
		max-width: 1312px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
	}
	.discipline__gallery-img {
		width: 100%;
		height: 100%;
		max-height: 540px;
		object-fit: cover;
		border-radius: 16px;
		display: block;
	}
	.discipline__gallery-img:nth-child(3n) {
		grid-column: 1 / -1;
		max-height: 720px;
	}

	@media (max-width: 768px) {
		.discipline__cap {
			padding: 96px 20px 48px;
		}
		.discipline__title {
			font-size: clamp(40px, 12vw, 72px);
		}
		.discipline__body {
			padding: 64px 20px;
		}
		.discipline__desc {
			font-size: 18px;
		}
		.discipline__gallery {
			padding: 0 20px 64px;
		}
		.discipline__gallery-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}
		.discipline__gallery-img:nth-child(3n) {
			grid-column: auto;
		}
	}
</style>

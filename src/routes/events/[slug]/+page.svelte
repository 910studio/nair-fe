<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import { t } from '$lib/sanity/i18n';
	import { urlFor } from '$lib/sanity/image';

	let { data } = $props();
	const locale = $derived(getLocale());
	const event = $derived(data.event);

	function fmtDate(iso?: string) {
		if (!iso) return '';
		try {
			return new Date(iso).toLocaleDateString(locale, {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return iso;
		}
	}
</script>

<article class="event">
	{#if event.banner}
		<div class="event__hero">
			<img src={urlFor(event.banner).width(1600).height(900).url()} alt={t(event.title, locale)} />
		</div>
	{/if}

	<header class="event__head">
		{#if event.season}
			<span class="event__season" style:--accent={event.season.accentColor || '#36F'}>
				{t(event.season.name, locale)}
			</span>
		{/if}
		<h1>{t(event.title, locale)}</h1>
		<dl class="event__meta">
			{#if event.startDate}
				<div><dt>Date</dt><dd>{fmtDate(event.startDate)}</dd></div>
			{/if}
			{#if event.location}
				<div><dt>Location</dt><dd>{t(event.location, locale)}</dd></div>
			{/if}
		</dl>
	</header>

	{#if event.summary}
		<p class="event__lead">{t(event.summary, locale)}</p>
	{/if}

	{#if event.gallery && event.gallery.length > 0}
		<section class="event__gallery">
			{#each event.gallery as img, i (i)}
				<img src={urlFor(img).width(1200).url()} alt="" loading="lazy" />
			{/each}
		</section>
	{/if}

	<a href="/events" class="event__back">← Back to all events</a>
</article>

<style>
	.event {
		padding: 64px;
		max-width: 960px;
		margin: 0 auto;
	}
	.event__hero {
		margin: -64px -64px 48px;
		border-bottom: 4px solid #000;
	}
	.event__hero img {
		width: 100%;
		display: block;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}
	.event__head {
		margin-bottom: 32px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.event__season {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
	}
	h1 {
		font-size: 56px;
		font-weight: 500;
		line-height: 1.1;
		margin: 0;
	}
	.event__meta {
		display: flex;
		gap: 32px;
		margin: 16px 0 0;
		padding: 16px 0;
		border-top: 1px dashed rgba(0, 0, 0, 0.32);
		border-bottom: 1px dashed rgba(0, 0, 0, 0.32);
	}
	.event__meta div {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.event__meta dt {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.5);
	}
	.event__meta dd {
		margin: 0;
		font-size: 16px;
	}
	.event__lead {
		font-size: 22px;
		line-height: 1.5;
		color: rgba(0, 0, 0, 0.78);
		margin-bottom: 48px;
	}
	.event__gallery {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 12px;
		margin-bottom: 48px;
	}
	.event__gallery img {
		width: 100%;
		display: block;
		border: 4px solid #000;
	}
	.event__back {
		display: inline-block;
		margin-top: 32px;
		padding: 12px 24px;
		border: 4px solid #000;
		color: #000;
		text-decoration: none;
		font-weight: 600;
	}
	.event__back:hover {
		background: #000;
		color: #fff;
	}
	@media (max-width: 768px) {
		.event {
			padding: 32px 20px;
		}
		.event__hero {
			margin: -32px -20px 32px;
		}
		h1 {
			font-size: 36px;
		}
	}
</style>

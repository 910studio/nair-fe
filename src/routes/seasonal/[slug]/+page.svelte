<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import { t } from '$lib/sanity/i18n';
	import { urlFor } from '$lib/sanity/image';

	let { data } = $props();
	const locale = $derived(getLocale());
	const season = $derived(data.season);

	function fmtDate(iso?: string) {
		if (!iso) return '';
		try {
			return new Date(iso).toLocaleDateString(locale, {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			});
		} catch {
			return iso;
		}
	}
</script>

<article class="season" style:--accent={season.accentColor || '#36F'}>
	{#if season.coverImage}
		<div class="season__cover">
			<img src={urlFor(season.coverImage).width(1800).height(900).url()} alt={t(season.name, locale)} />
		</div>
	{/if}

	<header class="season__head">
		<span class="season__kind">{season.kind}</span>
		<h1>{t(season.name, locale)}</h1>
		{#if season.recurringMonth}
			<p class="season__month">{season.recurringMonth}</p>
		{/if}
		{#if season.description}
			<p class="season__desc">{t(season.description, locale)}</p>
		{/if}
	</header>

	<section class="season__events">
		<h2>Events</h2>
		{#if season.events.length === 0}
			<p class="empty">No events under this season yet.</p>
		{:else}
			<ul>
				{#each season.events as event (event._id)}
					<li>
						<a href="/events/{event.slug.current}">
							<span class="ev__title">{t(event.title, locale)}</span>
							{#if event.startDate}
								<time>{fmtDate(event.startDate)}</time>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<a href="/seasonal" class="back">← All seasons</a>
</article>

<style>
	.season {
		padding: 64px;
		max-width: 1100px;
		margin: 0 auto;
	}
	.season__cover {
		margin: -64px -64px 48px;
		border-bottom: 8px solid var(--accent);
	}
	.season__cover img {
		width: 100%;
		display: block;
		aspect-ratio: 2 / 1;
		object-fit: cover;
	}
	.season__head {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 64px;
	}
	.season__kind {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
	}
	h1 {
		font-size: 72px;
		font-weight: 500;
		margin: 0;
		line-height: 1.05;
	}
	.season__month {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 14px;
		color: var(--accent);
		margin: 0;
	}
	.season__desc {
		font-size: 20px;
		line-height: 1.5;
		color: rgba(0, 0, 0, 0.78);
		max-width: 70ch;
		margin: 0;
	}
	.season__events h2 {
		font-size: 32px;
		font-weight: 500;
		border-bottom: 4px solid #000;
		padding-bottom: 12px;
		margin: 0 0 24px;
	}
	.season__events ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.season__events li {
		border-bottom: 1px dashed rgba(0, 0, 0, 0.3);
	}
	.season__events a {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 20px 0;
		color: inherit;
		text-decoration: none;
		font-size: 20px;
	}
	.season__events a:hover {
		color: var(--accent);
	}
	.ev__title {
		font-weight: 500;
	}
	.season__events time {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 12px;
		color: rgba(0, 0, 0, 0.5);
	}
	.empty {
		padding: 32px;
		border: 1px dashed rgba(0, 0, 0, 0.3);
		text-align: center;
		color: rgba(0, 0, 0, 0.5);
	}
	.back {
		display: inline-block;
		margin-top: 48px;
		padding: 12px 24px;
		border: 4px solid #000;
		color: #000;
		text-decoration: none;
		font-weight: 600;
	}
	.back:hover {
		background: #000;
		color: #fff;
	}
	@media (max-width: 768px) {
		.season {
			padding: 32px 20px;
		}
		.season__cover {
			margin: -32px -20px 32px;
		}
		h1 {
			font-size: 48px;
		}
	}
</style>

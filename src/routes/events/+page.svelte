<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import { t } from '$lib/sanity/i18n';
	import { urlFor } from '$lib/sanity/image';

	let { data } = $props();
	const locale = $derived(getLocale());

	function fmtDate(iso?: string) {
		if (!iso) return '';
		try {
			return new Date(iso).toLocaleDateString(locale, {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		} catch {
			return iso;
		}
	}
</script>

<section class="events-index">
	<header class="events-index__head">
		<span class="tag">events_index · cms</span>
		<h1>Events</h1>
	</header>

	{#if data.events.length === 0}
		<p class="empty">No events yet. The Nair team will publish them from the CMS.</p>
	{:else}
		<ul class="grid">
			{#each data.events as event (event._id)}
				<li class="card">
					<a href="/events/{event.slug.current}" class="card__link">
						{#if event.banner}
							<img
								class="card__img"
								src={urlFor(event.banner).width(800).height(500).url()}
								alt={t(event.title, locale)}
								loading="lazy"
							/>
						{:else}
							<div class="card__img card__img--empty"></div>
						{/if}
						<div class="card__body">
							{#if event.season}
								<span class="card__season" style:--accent={event.season.accentColor || '#36F'}>
									{t(event.season.name, locale)}
								</span>
							{/if}
							<h2 class="card__title">{t(event.title, locale)}</h2>
							{#if event.startDate}
								<time class="card__date" datetime={event.startDate}>{fmtDate(event.startDate)}</time>
							{/if}
							{#if event.summary}
								<p class="card__summary">{t(event.summary, locale)}</p>
							{/if}
						</div>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.events-index {
		padding: 64px;
		min-height: 100vh;
	}
	.events-index__head {
		margin-bottom: 48px;
		border-bottom: 4px solid #000;
		padding-bottom: 16px;
	}
	.tag {
		display: block;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.08em;
		color: rgba(0, 0, 0, 0.5);
		text-transform: uppercase;
		margin-bottom: 8px;
	}
	h1 {
		font-size: 64px;
		margin: 0;
		font-weight: 500;
	}
	.empty {
		padding: 64px;
		border: 1px dashed rgba(0, 0, 0, 0.32);
		text-align: center;
		color: rgba(0, 0, 0, 0.5);
	}
	.grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 24px;
	}
	.card {
		border: 4px solid #000;
		background: #fff;
		transition: transform 0.15s ease;
	}
	.card:hover {
		transform: translate(-4px, -4px);
		box-shadow: 8px 8px 0 0 #000;
	}
	.card__link {
		display: block;
		color: inherit;
		text-decoration: none;
	}
	.card__img {
		width: 100%;
		aspect-ratio: 8 / 5;
		object-fit: cover;
		display: block;
		border-bottom: 4px solid #000;
	}
	.card__img--empty {
		background: repeating-linear-gradient(
			45deg,
			rgba(0, 0, 0, 0.04) 0 12px,
			transparent 12px 24px
		);
	}
	.card__body {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.card__season {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
		align-self: flex-start;
	}
	.card__title {
		margin: 0;
		font-size: 22px;
		font-weight: 500;
		line-height: 1.2;
	}
	.card__date {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 12px;
		color: rgba(0, 0, 0, 0.6);
	}
	.card__summary {
		margin: 0;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.7);
		line-height: 1.5;
	}
	@media (max-width: 768px) {
		.events-index {
			padding: 32px 20px;
		}
		h1 {
			font-size: 40px;
		}
	}
</style>

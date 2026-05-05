<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import { t } from '$lib/sanity/i18n';
	import { urlFor } from '$lib/sanity/image';

	let { data } = $props();
	const locale = $derived(getLocale());
</script>

<section class="seasons">
	<header class="seasons__head">
		<span class="tag">seasonal_index · cms</span>
		<h1>Seasonal</h1>
	</header>

	{#if data.seasons.length === 0}
		<p class="empty">No seasons yet. Add Tsagaan Sar, Naadam, etc. from the CMS.</p>
	{:else}
		<ul class="grid">
			{#each data.seasons as season (season._id)}
				<li class="card" style:--accent={season.accentColor || '#36F'}>
					<a href="/seasonal/{season.slug.current}" class="card__link">
						{#if season.coverImage}
							<img
								class="card__img"
								src={urlFor(season.coverImage).width(800).height(600).url()}
								alt={t(season.name, locale)}
								loading="lazy"
							/>
						{/if}
						<div class="card__body">
							<span class="card__kind">{season.kind}</span>
							<h2 class="card__title">{t(season.name, locale)}</h2>
							{#if season.recurringMonth}
								<span class="card__month">{season.recurringMonth}</span>
							{/if}
							{#if season.description}
								<p class="card__desc">{t(season.description, locale)}</p>
							{/if}
						</div>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.seasons {
		padding: 64px;
		min-height: 100vh;
	}
	.seasons__head {
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
		grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
		gap: 24px;
	}
	.card {
		border: 4px solid #000;
		background: #fff;
		position: relative;
	}
	.card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-top: 8px solid var(--accent);
		pointer-events: none;
	}
	.card:hover {
		transform: translate(-4px, -4px);
		box-shadow: 8px 8px 0 0 var(--accent);
	}
	.card__link {
		display: block;
		color: inherit;
		text-decoration: none;
	}
	.card__img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		display: block;
		border-bottom: 4px solid #000;
	}
	.card__body {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.card__kind {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.5);
	}
	.card__title {
		margin: 0;
		font-size: 28px;
		font-weight: 500;
	}
	.card__month {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 12px;
		color: var(--accent);
	}
	.card__desc {
		margin: 0;
		font-size: 14px;
		line-height: 1.5;
		color: rgba(0, 0, 0, 0.7);
	}
	@media (max-width: 768px) {
		.seasons {
			padding: 32px 20px;
		}
		h1 {
			font-size: 40px;
		}
	}
</style>

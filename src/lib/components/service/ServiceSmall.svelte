<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import type { ServiceSmall, ServiceLabels } from '$lib/types';
	import type { Localized } from '$lib/types';
	import ServiceBanner from './ServiceBanner.svelte';
	import ServiceGallery from './ServiceGallery.svelte';
	import ProgramList from './ProgramList.svelte';
	import InfoCard from './InfoCard.svelte';

	let {
		service,
		phone = '99994455',
		labels = {}
	}: { service: ServiceSmall; phone?: string; labels?: ServiceLabels } = $props();
	const t = (v: Localized) => v[getLocale()];
	const phoneHref = $derived(`tel:${phone.replace(/\s+/g, '')}`);
	const contactLabel = $derived(labels.contactLabel?.[getLocale()] || m.service_contact_label());
	const contactCta = $derived(labels.contactCta?.[getLocale()] || m.service_contact_cta());
</script>

<ServiceBanner
	image={service.bannerImage || '/client-materials/small-banner.png'}
	title={t(service.title)}
	titleAlign="center"
/>

<section class="small" data-bg="light">
	<div class="small__frame">
		<div class="small__stack">
			<!-- ─── s1: description (overlaps banner) + bento ─── -->
			<div class="small__group small__group--first">
				<div class="small__description">
					<p>{t(service.description)}</p>
				</div>

				<div class="small__grid">
					<ProgramList title={t(service.program.title)} items={service.program.items} />

					<aside class="small__cards">
						<InfoCard
							label={m.service_label_duration()}
							value={t(service.duration)}
							illustration="/client-materials/duration-illustration.svg"
						/>
						<InfoCard
							label={m.service_label_artists()}
							value={t(service.artists).split(/(?<=\d)\s+(?=[A-ZА-Я])/).join('\n')}
							illustration="/client-materials/artists-illustration.svg"
						/>
					</aside>
				</div>
			</div>

			<!-- ─── s2: plans + notice + contact ─── -->
			<div class="small__group">
				{#if service.plans?.length}
				<div class="small__plans">
					{#each service.plans as plan, i (i)}
						<article
							class="plan-card"
							class:plan-card--plus={plan.variant === 'plus'}
						>
							<header class="plan-card__head">
								<h3 class="plan-card__name">{t(plan.name)}</h3>
								<p class="plan-card__price">{t(plan.price)}</p>
							</header>
							<div
								class="plan-card__body"
								class:plan-card__body--plus={plan.variant === 'plus'}
							>
								{#each plan.artists as artist, j (j)}
									<div
										class="artist-card"
										class:artist-card--plus={plan.variant === 'plus'}
									>
										<div class="artist-card__media">
											{#if artist.image}
												<img src={artist.image} alt="" loading="lazy" />
											{/if}
										</div>
										<div class="artist-card__meta">
											<p class="artist-card__name">{t(artist.name)}</p>
											{#if artist.role}
												<p class="artist-card__role">{t(artist.role)}</p>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</article>
					{/each}
				</div>
			{/if}

			<!-- Disclaimer notice -->
			{#if service.disclaimer}
				<div class="small__notice">
					<svg
						class="small__notice-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="16" x2="12" y2="12" />
						<line x1="12" y1="8" x2="12.01" y2="8" />
					</svg>
					<p class="small__notice-text">{t(service.disclaimer)}</p>
				</div>
			{/if}

				<div class="small__contact">
					<p class="small__contact-label">{contactLabel}</p>
					<a class="small__contact-cta" href={phoneHref}>
						<svg
							class="small__contact-icon"
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
						<span>{contactCta}</span>
					</a>
				</div>
			</div>

			<!-- ─── s3: gallery slider ─── -->
			{#if service.gallery?.length}
				<div class="small__group">
					<ServiceGallery images={service.gallery} />
				</div>
			{/if}

			<!-- ─── s4: tips ─── -->
			{#if service.tips}
				<div class="small__group">
					<section class="tips">
						<h3 class="tips__title">{t(service.tips.title)}</h3>
						<ol class="tips__list">
							{#each service.tips.items as item, i (i)}
								<li class="tips__item">
									<span class="tips__number">{i + 1}</span>
									<span class="tips__label">{t(item)}</span>
								</li>
							{/each}
						</ol>
					</section>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.small {
		padding: 0 20px 64px;
		background: #f9f9fb;
		display: flex;
		justify-content: center;
	}
	.small__frame {
		width: 100%;
		max-width: 920px;
	}
	.small__stack {
		display: flex;
		flex-direction: column;
		gap: 100px;
	}
	.small__group {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	/* First group lifts the description card up to overlap the banner. */
	.small__group--first {
		margin-top: -60px;
	}

	/* ─── Description card (overlaps banner bottom) ─── */
	.small__description {
		position: relative;
		z-index: 1;
		width: fit-content;
		max-width: min(100%, 720px);
		margin: 0 auto;
		padding: 20px 24px;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
	}
	.small__description p {
		margin: 0;
		text-align: center;
		color: #06090c;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}

	/* ─── Bento grid ─── */
	.small__grid {
		display: flex;
		gap: 20px;
		align-items: stretch;
	}
	.small__cards {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	/* ─── Plans ─── */
	.small__plans {
		display: flex;
		gap: 20px;
		align-items: stretch;
	}
	.plan-card {
		flex: 1 1 0;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.plan-card__head {
		padding: 20px 24px;
		border-bottom: 1px solid rgba(6, 9, 12, 0.04);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.plan-card__name {
		margin: 0;
		color: #9e1c21;
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		letter-spacing: 0.4px;
	}
	.plan-card__price {
		margin: 0;
		color: #06090c;
		font-size: 28px;
		font-weight: 700;
		line-height: 36px;
		letter-spacing: 0.28px;
	}
	.plan-card__body {
		flex: 1 1 0;
		padding: 24px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}
	.plan-card__body--plus {
		grid-template-columns: repeat(2, 1fr);
	}

	/* ─── Artist mini-card (default variant) ─── */
	.artist-card {
		background: #fff;
		border-radius: 12px;
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.artist-card__media {
		position: relative;
		width: 100%;
		aspect-ratio: 1 / 1;
		background: #eef0f4;
		flex: none;
	}
	.artist-card__media img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.artist-card__meta {
		flex: none;
		padding: 10px 8px;
		text-align: center;
	}
	.artist-card__name {
		margin: 0;
		color: #06090c;
		font-size: 13px;
		font-weight: 600;
		line-height: 18px;
		letter-spacing: 0.24px;
	}
	.artist-card__role {
		margin: 0;
		color: rgba(6, 9, 12, 0.48);
		font-size: 12px;
		font-weight: 500;
		line-height: 16px;
		letter-spacing: 0.24px;
	}

	/* ─── Artist big-card (plus variant) ─── */
	.artist-card--plus {
		flex: 1 1 0;
		height: auto;
	}
	.artist-card--plus .artist-card__media {
		aspect-ratio: 193 / 224;
	}
	.artist-card--plus .artist-card__meta {
		padding: 12px 8px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.artist-card--plus .artist-card__name {
		font-size: 16px;
		line-height: 24px;
		letter-spacing: 0.32px;
	}

	/* ─── Disclaimer notice ─── */
	.small__notice {
		padding: 24px;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.small__notice-icon {
		flex: none;
		width: 24px;
		height: 24px;
		color: rgba(6, 9, 12, 0.64);
	}
	.small__notice-text {
		flex: 1 1 0;
		margin: 0;
		color: rgba(6, 9, 12, 0.64);
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}

	/* ─── Contact card ─── */
	.small__contact {
		padding: 24px 24px 24px 32px;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 32px;
	}
	.small__contact-label {
		flex: 1 1 0;
		margin: 0;
		color: #06090c;
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		letter-spacing: 0.4px;
	}
	.small__contact-cta {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 12px 20px 12px 16px;
		background: #06090c;
		color: #fff;
		border-radius: 8px;
		outline: 1px solid rgba(255, 255, 255, 0.04);
		outline-offset: -1px;
		text-decoration: none;
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		letter-spacing: 0.32px;
		transition: background-color 0.2s ease;
	}
	.small__contact-cta:hover {
		background: #1a1f24;
	}
	.small__contact-icon {
		width: 20px;
		height: 20px;
		flex: none;
	}

	/* ─── Tips ─── */
	.tips {
		padding: 24px;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.tips__title {
		margin: 0;
		color: #9e1c21;
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		letter-spacing: 0.4px;
	}
	.tips__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.tips__item {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.tips__number {
		flex: none;
		width: 32px;
		height: 32px;
		display: grid;
		place-items: center;
		padding: 4px;
		background: rgba(6, 9, 12, 0.02);
		border-radius: 8px;
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		color: rgba(6, 9, 12, 0.64);
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.tips__label {
		flex: 1 1 0;
		color: #06090c;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}

	/* ─── Mobile ─── */
	@media (max-width: 768px) {
		.small {
			padding: 0 20px 32px;
		}
		.small__stack {
			gap: 64px;
		}
		.small__group--first {
			margin-top: -40px;
		}
		.small__grid {
			flex-direction: column;
		}

		/* Plans stack full-width vertically. */
		.small__plans {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}
		.plan-card {
			flex: none;
			width: 100%;
		}
		.plan-card__head {
			padding: 16px 20px;
			gap: 8px;
		}
		.plan-card__name {
			font-size: 16px;
			line-height: 24px;
			letter-spacing: 0.32px;
		}
		.plan-card__price {
			font-size: 24px;
			line-height: 32px;
			letter-spacing: 0.24px;
		}

		/* Default plan body: horizontal scroll of 120px artist cards. */
		.plan-card__body {
			flex: none;
			padding: 20px;
			display: flex;
			flex-direction: row;
			gap: 12px;
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			scrollbar-width: none;
		}
		.plan-card__body::-webkit-scrollbar {
			display: none;
		}
		.artist-card {
			flex: none;
			width: 120px;
		}
		.artist-card__media {
			aspect-ratio: 1 / 1;
		}

		/* Plus plan body: 2 cards side-by-side filling width. */
		.plan-card__body--plus {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 16px;
			overflow: visible;
		}
		.plan-card__body--plus .artist-card {
			flex: 1 1 0;
			width: auto;
			height: auto;
		}
		.plan-card__body--plus .artist-card__media {
			flex: none;
			height: auto;
		}

		.small__contact {
			flex-direction: column;
			align-items: stretch;
			gap: 16px;
			padding: 24px;
		}
		.small__contact-cta {
			width: 100%;
		}
	}
</style>

<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import type { ServiceMedium } from '$lib/types';
	import type { Localized } from '$lib/types';
	import ServiceBanner from './ServiceBanner.svelte';
	import ServiceGallery from './ServiceGallery.svelte';

	let {
		service,
		phone = '99994455'
	}: { service: ServiceMedium; phone?: string } = $props();
	const t = (v: Localized | undefined) => (v ? v[getLocale()] : '');
	const phoneHref = $derived(`tel:${phone.replace(/\s+/g, '')}`);
</script>

<ServiceBanner
	image={service.bannerImage || '/client-materials/small-banner.png'}
	title={t(service.title)}
	titleAlign="center"
/>

<section class="medium" data-bg="light">
	<div class="medium__frame">
		<!-- Description card (pulled up to overlap banner bottom) -->
		<div class="medium__description">
			<p>{t(service.description)}</p>
		</div>

		<!-- Plans grid -->
		<div class="medium__plans" data-block="plans">
			{#each service.plans as plan, i (i)}
				<article class="plan-card">
					<header class="plan-card__head">
						<h3 class="plan-card__name">{t(plan.name)}</h3>
						{#if plan.price}
							<p class="plan-card__price">{t(plan.price)}</p>
						{/if}
					</header>

					{#if plan.duration}
						<div class="plan-card__row">
							<span class="plan-card__row-label">{m.service_label_duration()}</span>
							<span class="plan-card__row-value">{t(plan.duration)}</span>
						</div>
					{/if}

					{#if plan.programmeItems && plan.programmeItems.length}
						<ul class="plan-card__programme">
							{#each plan.programmeItems as item, j (j)}
								<li class="plan-card__programme-item" class:plan-card__programme-item--inactive={item.active === false}>
									{#if item.active !== false}
										<svg
											class="plan-card__chevron"
											viewBox="0 0 20 20"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											aria-hidden="true"
										>
											<polyline points="7 5 13 10 7 15" />
										</svg>
									{/if}
									<span class="plan-card__programme-label">{t(item.label)}</span>
								</li>
							{/each}
						</ul>
					{/if}

					{#if plan.artistTags && plan.artistTags.length}
						<div class="plan-card__tags">
							{#each plan.artistTags as tag, k (k)}
								<span class="plan-card__tag">{t(tag)}</span>
							{/each}
						</div>
					{/if}
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- s2: contact CTA -->
<section class="medium-contact" data-bg="light">
	<div class="medium-contact__card">
		<p class="medium-contact__label">{m.service_contact_label()}</p>
		<a class="medium-contact__cta" href={phoneHref}>
			<svg
				class="medium-contact__icon"
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
			<span>{m.service_contact_cta()}</span>
		</a>
	</div>
</section>

<!-- s3: gallery slider -->
{#if service.gallery?.length}
	<section class="medium-gallery" data-bg="light">
		<ServiceGallery images={service.gallery} />
	</section>
{/if}

<!-- s4: tips -->
{#if service.tips}
	<section class="medium-tips" data-bg="light">
		<div class="tips">
			<h3 class="tips__title">{t(service.tips.title)}</h3>
			<ol class="tips__list">
				{#each service.tips.items as item, i (i)}
					<li class="tips__item">
						<span class="tips__number">{i + 1}</span>
						<span class="tips__label">{t(item)}</span>
					</li>
				{/each}
			</ol>
		</div>
	</section>
{/if}

<style>
	.medium {
		padding: 0 64px;
		background: #f9f9fb;
		display: flex;
		justify-content: center;
	}
	.medium__frame {
		width: 100%;
		max-width: 1312px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}

	/* ─── Description card (overlaps banner bottom) ─── */
	.medium__description {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 920px;
		margin-top: -60px;
		padding: 24px;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		display: flex;
		justify-content: center;
	}
	.medium__description p {
		margin: 0;
		max-width: 640px;
		text-align: center;
		color: #06090c;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}

	/* ─── Plans grid ─── */
	.medium__plans {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		align-items: stretch;
	}
	.plan-card {
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	/* head */
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

	/* duration row */
	.plan-card__row {
		padding: 16px 20px;
		border-bottom: 1px solid rgba(6, 9, 12, 0.04);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}
	.plan-card__row-label {
		color: rgba(6, 9, 12, 0.64);
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
		letter-spacing: 0.28px;
	}
	.plan-card__row-value {
		color: #06090c;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}

	/* programme list */
	.plan-card__programme {
		list-style: none;
		margin: 0;
		padding: 16px 20px;
		border-bottom: 1px solid rgba(6, 9, 12, 0.04);
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.plan-card__programme-item {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.plan-card__programme-item--inactive {
		padding-left: 32px;
	}
	.plan-card__programme-item--inactive .plan-card__programme-label {
		color: rgba(6, 9, 12, 0.64);
	}
	.plan-card__chevron {
		flex: none;
		width: 20px;
		height: 20px;
		color: rgba(6, 9, 12, 0.24);
	}
	.plan-card__programme-label {
		flex: 1 1 0;
		color: #06090c;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}

	/* tags */
	.plan-card__tags {
		padding: 16px 20px 20px;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 8px;
	}
	.plan-card__tag {
		padding: 4px 8px;
		background: rgba(6, 9, 12, 0.02);
		border-radius: 8px;
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		color: rgba(6, 9, 12, 0.64);
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
		letter-spacing: 0.28px;
	}

	/* ─── Gallery slider section ─── */
	.medium-gallery {
		padding: 100px 64px 0;
		background: #f9f9fb;
		display: flex;
		justify-content: center;
	}

	/* ─── Tips section ─── */
	.medium-tips {
		padding: 100px 64px;
		background: #f9f9fb;
		display: flex;
		justify-content: center;
	}
	.tips {
		width: 100%;
		max-width: 920px;
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

	/* ─── Contact CTA section ─── */
	.medium-contact {
		padding: 100px 64px 0;
		background: #f9f9fb;
		display: flex;
		justify-content: center;
	}
	.medium-contact__card {
		width: 100%;
		max-width: 920px;
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
	.medium-contact__label {
		flex: 1 1 0;
		margin: 0;
		color: #06090c;
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		letter-spacing: 0.4px;
	}
	.medium-contact__cta {
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
	.medium-contact__cta:hover {
		background: #1a1f24;
	}
	.medium-contact__icon {
		width: 20px;
		height: 20px;
		flex: none;
	}

	@media (max-width: 1024px) {
		.medium {
			padding: 0 24px;
		}
		.medium__plans {
			grid-template-columns: 1fr;
		}
		.medium-gallery,
		.medium-contact {
			padding: 80px 24px 0;
		}
		.medium-tips {
			padding: 80px 24px;
		}
	}
	@media (max-width: 768px) {
		.medium {
			padding: 0 20px;
		}
		.medium__description {
			margin-top: -40px;
		}
		.medium-gallery,
		.medium-contact {
			padding: 64px 20px 0;
		}
		.medium-tips {
			padding: 64px 20px;
		}
		.medium-contact__card {
			flex-direction: column;
			align-items: stretch;
			gap: 16px;
			padding: 24px;
		}
		.medium-contact__cta {
			width: 100%;
		}
	}
</style>

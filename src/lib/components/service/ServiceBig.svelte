<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import type { ServiceBig } from '$lib/types';
	import type { Localized } from '$lib/types';
	import ServiceBanner from './ServiceBanner.svelte';
	import ServiceGallery from './ServiceGallery.svelte';

	let {
		service,
		phone = '99994455'
	}: { service: ServiceBig; phone?: string } = $props();
	const t = (v: Localized | undefined) => (v ? v[getLocale()] : '');
	const phoneHref = $derived(`tel:${phone.replace(/\s+/g, '')}`);

	let activeId = $state('');

	const navParts = $derived(service.parts.filter((p) => p.kind !== 'cta'));

	function go(id: string) {
		const el = document.getElementById(id);
		if (!el) return;
		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	onMount(() => {
		activeId = navParts[0]?.id ?? '';
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (visible) activeId = visible.target.id;
			},
			{ rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
		);
		navParts.forEach((p) => {
			const el = document.getElementById(p.id);
			if (el) observer.observe(el);
		});
		return () => observer.disconnect();
	});
</script>

<div class="big-page">
	<aside class="big-sidebar" aria-label={m.service_label_parts()}>
		<nav class="big-sidebar__nav">
			{#each navParts as part (part.id)}
				<button
					type="button"
					class="big-sidebar__btn"
					class:big-sidebar__btn--active={activeId === part.id}
					onclick={() => go(part.id)}
				>
					{t(part.title)}
				</button>
			{/each}
		</nav>
	</aside>

	<main class="big-main">
		<ServiceBanner
			image={service.bannerImage || '/client-materials/small-banner.png'}
			title={t(service.title)}
			titleAlign="center"
		/>

		<section class="big-intro" data-bg="light">
			<div class="big-intro__card">
				<p>{t(service.description)}</p>
			</div>

			{#if service.priceRange || phone}
				<div class="big-intro__row">
					{#if service.priceRange}
						<div class="big-price">
							<p class="big-price__label">{m.service_label_price()}</p>
							<p class="big-price__value">{t(service.priceRange)}</p>
						</div>
					{/if}
					<div class="big-contact">
						<p class="big-contact__label">{m.service_contact_label()}</p>
						<a class="big-contact__cta" href={phoneHref}>
							<svg
								class="big-contact__icon"
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
				</div>
			{/if}
		</section>

		<section class="big-parts" data-bg="light">
			{#each service.parts as part (part.id)}
				{#if part.kind === 'cta'}
					<aside class="big-cta">
						<div class="big-cta__copy">
							<h3 class="big-cta__heading">{t(part.title)}</h3>
							{#if part.body}
								<p class="big-cta__body">{t(part.body)}</p>
							{/if}
						</div>
						<a class="big-cta__btn" href={phoneHref}>
							<svg
								class="big-cta__icon"
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
					</aside>
				{:else}
				<section id={part.id} class="big-part">
					<h2 class="big-part__title">{t(part.title)}</h2>

					{#if part.subsections?.length}
						{#each part.subsections as sub, sIdx (sIdx)}
							<article class="big-sub">
								<header class="big-sub__head">
									<h3 class="big-sub__name">{t(sub.name)}</h3>
									{#if sub.duration}
										<span class="big-sub__duration">
											<svg
												class="big-sub__clock"
												viewBox="0 0 20 20"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
												aria-hidden="true"
											>
												<circle cx="10" cy="10" r="8" />
												<polyline points="10 6 10 10 13 12" />
											</svg>
											<span>{t(sub.duration)}</span>
										</span>
									{/if}
								</header>

								{#if sub.options?.length}
									<div class="big-sub__options">
										{#each sub.options as opt, oIdx (oIdx)}
											<div class="big-option">
												{#if opt.image}
													<img
														class="big-option__img"
														src={opt.image}
														alt=""
														loading="lazy"
													/>
												{:else}
													<div class="big-option__img big-option__img--placeholder"></div>
												{/if}
												<div class="big-option__meta">
													{#if opt.label}
														<p class="big-option__label">{t(opt.label)}</p>
													{/if}
													<p class="big-option__title">{t(opt.title)}</p>
												</div>

												{#if opt.programmeItems?.length}
													<ul class="big-option__programme">
														{#each opt.programmeItems as item, pIdx (pIdx)}
															<li
																class="big-option__programme-item"
																class:big-option__programme-item--inactive={item.active === false}
															>
																{#if item.active !== false}
																	<svg
																		class="big-option__chevron"
																		viewBox="0 0 16 16"
																		fill="none"
																		stroke="currentColor"
																		stroke-width="2"
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		aria-hidden="true"
																	>
																		<polyline points="6 4 10 8 6 12" />
																	</svg>
																{/if}
																<span>{t(item.label)}</span>
															</li>
														{/each}
													</ul>
												{/if}

												{#if opt.artistTags?.length}
													<div class="big-option__tags">
														{#each opt.artistTags as tag, tIdx (tIdx)}
															<span class="big-option__tag">{t(tag)}</span>
														{/each}
													</div>
												{/if}
											</div>
										{/each}
									</div>
								{/if}

								{#if sub.artists?.length}
									<div class="big-sub__roster">
										{#each sub.artists as artist, aIdx (aIdx)}
											<div class="big-artist">
												{#if artist.image}
													<img
														class="big-artist__img"
														src={artist.image}
														alt=""
														loading="lazy"
													/>
												{:else}
													<div class="big-artist__img big-artist__img--placeholder"></div>
												{/if}
												<div class="big-artist__meta">
													<div class="big-artist__head">
														<p class="big-artist__name">{t(artist.name)}</p>
														{#if artist.role}
															<p class="big-artist__role">{t(artist.role)}</p>
														{/if}
													</div>
													{#if artist.songs}
														<p class="big-artist__songs">{t(artist.songs)}</p>
													{/if}
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</article>
						{/each}
					{:else if part.body}
						<p class="big-part__body">{t(part.body)}</p>
					{/if}
				</section>
				{/if}
			{/each}
		</section>

		{#if service.gallery?.length}
			<section class="big-gallery" data-bg="light">
				<ServiceGallery images={service.gallery} />
			</section>
		{/if}

		{#if service.tips}
			<section class="big-tips" data-bg="light">
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
	</main>
</div>

<style>
	.big-page {
		display: grid;
		grid-template-columns: 280px 1fr;
		background: #f9f9fb;
		min-height: 100vh;
	}

	/* ─── Sidebar ─── */
	.big-sidebar {
		background: #fff;
		border-right: 1px solid rgba(6, 9, 12, 0.08);
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
	}
	.big-sidebar__nav {
		position: sticky;
		top: 0;
		padding: 112px 24px 24px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}
	.big-sidebar__btn {
		appearance: none;
		width: 100%;
		padding: 12px 20px;
		border: 0;
		border-radius: 8px;
		font: inherit;
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		letter-spacing: 0.32px;
		text-align: left;
		cursor: pointer;
		background: rgba(6, 9, 12, 0.04);
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		color: #06090c;
		transition:
			background-color 0.15s ease,
			color 0.15s ease,
			outline-color 0.15s ease;
	}
	.big-sidebar__btn:hover {
		background: rgba(6, 9, 12, 0.08);
	}
	.big-sidebar__btn--active {
		background: #06090c;
		outline-color: rgba(255, 255, 255, 0.04);
		color: #fff;
	}
	.big-sidebar__btn--active:hover {
		background: #1a1f24;
	}

	/* ─── Main column ─── */
	.big-main {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	/* ─── Intro (description + price/contact row) ─── */
	.big-intro {
		padding: 0 64px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}
	.big-intro__card {
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
	.big-intro__card p {
		margin: 0;
		max-width: 640px;
		text-align: center;
		color: #06090c;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.big-intro__row {
		width: 100%;
		max-width: 920px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	/* Price card */
	.big-price {
		padding: 24px;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 32px;
	}
	.big-price__label {
		margin: 0;
		color: #9e1c21;
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		letter-spacing: 0.4px;
	}
	.big-price__value {
		margin: 0;
		color: #06090c;
		font-size: 24px;
		font-weight: 700;
		line-height: 32px;
		letter-spacing: 0.24px;
	}

	/* Contact card */
	.big-contact {
		padding: 24px;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 16px;
	}
	.big-contact__label {
		align-self: stretch;
		margin: 0;
		color: #06090c;
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		letter-spacing: 0.4px;
	}
	.big-contact__cta {
		align-self: stretch;
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
	.big-contact__cta:hover {
		background: #1a1f24;
	}
	.big-contact__icon {
		width: 20px;
		height: 20px;
		flex: none;
	}

	/* ─── Parts ─── */
	.big-parts {
		padding: 100px 64px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 64px;
	}
	.big-part {
		width: 100%;
		max-width: 920px;
		scroll-margin-top: 100px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.big-part {
		gap: 24px;
		align-items: center;
	}
	.big-part__title {
		margin: 0;
		text-align: center;
		color: rgba(6, 9, 12, 0.48);
		font-size: 24px;
		font-weight: 600;
		line-height: 32px;
		letter-spacing: 0.24px;
	}
	.big-part__body {
		margin: 0;
		color: rgba(6, 9, 12, 0.72);
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}

	/* ─── Interstitial CTA card (between parts) ─── */
	.big-cta {
		width: 100%;
		max-width: 920px;
		padding: 64px 24px 48px;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 32px;
	}
	.big-cta__copy {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		text-align: center;
	}
	.big-cta__heading {
		margin: 0;
		color: #06090c;
		font-size: 28px;
		font-weight: 600;
		line-height: 36px;
		letter-spacing: 0.28px;
	}
	.big-cta__body {
		margin: 0;
		max-width: 640px;
		color: rgba(6, 9, 12, 0.48);
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.big-cta__btn {
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
	.big-cta__btn:hover {
		background: #1a1f24;
	}
	.big-cta__icon {
		width: 20px;
		height: 20px;
		flex: none;
	}

	/* ─── Subsection card ─── */
	.big-sub {
		align-self: stretch;
		padding: 20px;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.big-sub__head {
		padding-left: 4px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
	}
	.big-sub__name {
		margin: 0;
		color: #9e1c21;
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		letter-spacing: 0.4px;
	}
	.big-sub__duration {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		background: #fff;
		border-radius: 8px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		color: #06090c;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.big-sub__clock {
		width: 20px;
		height: 20px;
		flex: none;
		color: #9e1c21;
	}
	.big-sub__options {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		align-items: stretch;
	}

	/* ─── Option card ─── */
	.big-option {
		background: #fff;
		border-radius: 12px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 40px rgba(6, 9, 12, 0.08);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.big-option__img {
		display: block;
		width: 100%;
		height: 160px;
		object-fit: cover;
	}
	.big-option__img--placeholder {
		background:
			repeating-linear-gradient(
				45deg,
				rgba(6, 9, 12, 0.03) 0 12px,
				transparent 12px 24px
			),
			#eef0f4;
	}
	.big-option__meta {
		padding: 16px 20px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.big-option__label {
		margin: 0;
		color: #9e1c21;
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
		letter-spacing: 0.28px;
	}
	.big-option__title {
		margin: 0;
		color: #06090c;
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.big-option__meta {
		border-bottom: 1px solid rgba(6, 9, 12, 0.04);
	}

	/* Programme list inside option */
	.big-option__programme {
		list-style: none;
		margin: 0;
		padding: 16px;
		border-bottom: 1px solid rgba(6, 9, 12, 0.04);
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.big-option__programme-item {
		display: flex;
		align-items: center;
		gap: 8px;
		color: #06090c;
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
		letter-spacing: 0.28px;
	}
	.big-option__programme-item--inactive {
		padding-left: 24px;
		color: rgba(6, 9, 12, 0.64);
	}
	.big-option__chevron {
		flex: none;
		width: 16px;
		height: 16px;
		color: rgba(6, 9, 12, 0.24);
	}

	/* Artist tags inside option */
	.big-option__tags {
		padding: 16px;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 8px;
	}
	.big-option__tag {
		padding: 4px 8px;
		background: rgba(6, 9, 12, 0.02);
		border-radius: 4px;
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		color: rgba(6, 9, 12, 0.64);
		font-size: 12px;
		font-weight: 500;
		line-height: 16px;
		letter-spacing: 0.24px;
	}

	/* Artist roster (side-image cards) */
	.big-sub__roster {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
	}
	.big-artist {
		flex: 1 1 0;
		min-width: 280px;
		height: 160px;
		display: flex;
		background: #fff;
		border-radius: 12px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 40px rgba(6, 9, 12, 0.08);
		overflow: hidden;
	}
	.big-artist__img {
		flex: none;
		width: 120px;
		height: 100%;
		object-fit: cover;
	}
	.big-artist__img--placeholder {
		background:
			repeating-linear-gradient(
				45deg,
				rgba(6, 9, 12, 0.03) 0 12px,
				transparent 12px 24px
			),
			#eef0f4;
	}
	.big-artist__meta {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.big-artist__head {
		flex: 1 1 0;
		padding: 16px 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 4px;
	}
	.big-artist__name {
		margin: 0;
		color: #06090c;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.big-artist__role {
		margin: 0;
		color: rgba(6, 9, 12, 0.48);
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
		letter-spacing: 0.28px;
	}
	.big-artist__songs {
		margin: 0;
		padding: 12px 16px;
		color: rgba(6, 9, 12, 0.48);
		font-size: 12px;
		font-weight: 500;
		line-height: 16px;
		letter-spacing: 0.24px;
		white-space: pre-line;
	}

	/* ─── Gallery slider ─── */
	.big-gallery {
		padding: 100px 64px 0;
		display: flex;
		justify-content: center;
	}

	/* ─── Tips ─── */
	.big-tips {
		padding: 100px 64px;
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

	/* ─── Responsive ─── */
	@media (max-width: 1024px) {
		.big-intro {
			padding: 0 24px;
		}
		.big-parts {
			padding: 80px 24px 0;
		}
		.big-gallery {
			padding: 80px 24px 0;
		}
		.big-tips {
			padding: 80px 24px;
		}
	}
	@media (max-width: 899px) {
		.big-page {
			grid-template-columns: 1fr;
		}
		.big-sidebar {
			border-right: 0;
			border-bottom: 1px solid rgba(6, 9, 12, 0.08);
			order: 2;
		}
		.big-sidebar__nav {
			position: static;
			padding: 32px 24px;
			flex-direction: row;
			flex-wrap: wrap;
		}
		.big-sidebar__btn {
			width: auto;
		}
		.big-main {
			order: 1;
		}
		.big-intro__row {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 1024px) {
		.big-sub__options {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 768px) {
		.big-intro {
			padding: 0 20px;
		}
		.big-intro__card {
			margin-top: -40px;
		}
		.big-parts {
			padding: 64px 20px 0;
			gap: 48px;
		}
		.big-gallery {
			padding: 64px 20px 0;
		}
		.big-tips {
			padding: 64px 20px;
		}
		.big-part__title {
			font-size: 20px;
			line-height: 28px;
			letter-spacing: 0.2px;
		}
		.big-sub__head {
			flex-wrap: wrap;
		}
	}
</style>

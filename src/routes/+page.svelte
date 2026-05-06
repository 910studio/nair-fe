<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { fileUrl, t, imgUrl, SANITY_CONFIGURED } from '$lib/sanity';
	import { drawer } from '$lib/stores/drawer.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const locale = $derived(getLocale());

	// ─── Hero (s1) ───
	const heroVideoSrc = $derived(
		fileUrl(data.hero?.videoMp4?.asset) ??
			fileUrl(data.hero?.videoWebm?.asset) ??
			'/client-materials/hero-section-video.mp4'
	);
	const heroPosterSrc = $derived(
		SANITY_CONFIGURED && data.hero?.videoPoster
			? imgUrl(data.hero.videoPoster, { w: 1280, fit: 'crop', q: 60 })
			: undefined
	);
	const heroTitle = $derived(t(data.hero?.headline, locale) || m.home_hero_title());

	// ─── Intro (s2) ───
	const introSegments = $derived(data.intro?.bodySegments ?? null);
	const introCtaLabel = $derived(t(data.intro?.ctaLabel, locale) || m.home_intro_cta());
	const introImageSrc = $derived(
		SANITY_CONFIGURED && data.intro?.image
			? imgUrl(data.intro.image, { w: 1200, fit: 'max', q: 70 })
			: '/client-materials/s2-image.png'
	);

	// ─── Disciplines (s3) ───
	const fallbackDisciplines = [
		{ id: 'urtin-duu', label: m.home_discipline_urtin_duu },
		{ id: 'ardiin-duu', label: m.home_discipline_ardiin_duu },
		{ id: 'khoomii', label: m.home_discipline_khoomii },
		{ id: 'yurool', label: m.home_discipline_yurool },
		{ id: 'mongol-bujig', label: m.home_discipline_mongol_bujig },
		{ id: 'uran-nugaralt', label: m.home_discipline_uran_nugaralt },
		{ id: 'tsam-bujig', label: m.home_discipline_tsam_bujig },
		{ id: 'morin-khuur-quartet', label: m.home_discipline_morin_khuur_quartet },
		{ id: 'undesnii-khugjim', label: m.home_discipline_undesnii_khugjim }
	];

	type DisciplineCard = { label: string; image: string | null };

	const disciplineCards = $derived<DisciplineCard[]>(
		data.disciplines?.cards?.length
			? data.disciplines.cards.map((card, i) => ({
					label: t(card.title, locale) || `Card ${i + 1}`,
					image:
						SANITY_CONFIGURED && card.image
							? imgUrl(card.image, { w: 600, h: 340, fit: 'crop', q: 65 })
							: null
				}))
			: fallbackDisciplines.map((d) => ({
					label: d.label(),
					image: `/client-materials/disciplines/${d.id}.png`
				}))
	);

	const disciplineTitle = $derived(t(data.disciplines?.title, locale) || m.home_disciplines_title());

	// 4 / 3 / 2 layout split
	const disciplineRows = $derived([
		disciplineCards.slice(0, 4),
		disciplineCards.slice(4, 7),
		disciplineCards.slice(7)
	]);

	// ─── Why us (s4) ───
	const whyBadge = $derived(t(data.whyUs?.badge, locale) || m.home_why_badge());
	const whyTitle = $derived(t(data.whyUs?.title, locale) || m.home_why_title());
	const whyBody = $derived(t(data.whyUs?.description, locale) || m.home_why_body());

	const fallbackLeftPills = [
		m.home_why_pill_1,
		m.home_why_pill_2,
		m.home_why_pill_3,
		m.home_why_pill_4
	];
	const fallbackRightPills = [
		m.home_why_pill_5,
		m.home_why_pill_6,
		m.home_why_pill_7,
		m.home_why_pill_8
	];

	const whyLeftPills = $derived(
		data.whyUs?.leftPills?.length
			? data.whyUs.leftPills.map((p) => t(p, locale))
			: fallbackLeftPills.map((f) => f())
	);
	const whyRightPills = $derived(
		data.whyUs?.rightPills?.length
			? data.whyUs.rightPills.map((p) => t(p, locale))
			: fallbackRightPills.map((f) => f())
	);

	// ─── Collabs (s3b) ───
	const collabsTitle = $derived(t(data.collabs?.title, locale) || m.home_collabs_title());

	const collabPartners = $derived(
		data.collabs?.partners?.length && SANITY_CONFIGURED
			? data.collabs.partners.map((p, i) => ({
					id: `cms-${i}`,
					name: p.name || '',
					logo: p.logo ? imgUrl(p.logo, { w: 240, h: 96, q: 80 }) : null
				}))
			: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
					id: `placeholder-${i}`,
					name: `LOGO_${String(i).padStart(2, '0')}`,
					logo: null as string | null
				}))
	);

	// 3-row split for mobile marquee (alternating direction per row)
	const collabRows = $derived.by(() => {
		const n = collabPartners.length;
		const a = Math.ceil(n / 3);
		const b = Math.ceil((2 * n) / 3);
		return [
			collabPartners.slice(0, a),
			collabPartners.slice(a, b),
			collabPartners.slice(b)
		];
	});

	// ─── FAQ (s5) ───
	const faqTitle = $derived(m.home_faq_title());
	const fallbackFaqs = $derived(
		Array.from({ length: 3 }, () => ({
			q: m.home_faq_sample_q(),
			a: m.home_faq_sample_a()
		}))
	);
	const faqs = $derived(
		data.faq?.length
			? data.faq.map((f) => ({ q: t(f.question, locale), a: t(f.answer, locale) }))
			: fallbackFaqs
	);
</script>

<!-- SECTION 1 ─ hero · video bg · dark gradient · title bottom-left -->
<section class="s1" data-bg="dark">
	<video
		class="s1__video"
		src={heroVideoSrc}
		poster={heroPosterSrc}
		autoplay
		muted
		loop
		playsinline
		preload="auto"
		aria-hidden="true"
	></video>
	<div class="s1__overlay" aria-hidden="true"></div>
	<h1 class="s1__title">{heroTitle}</h1>
</section>

<!-- SECTION 2 ─ intro · two-tone headline · CTA · feature image -->
<section class="s2" data-bg="light">
	<div class="s2__lead">
		<p class="s2__body">
			{#if introSegments && introSegments.length}
				{#each introSegments as seg, i (i)}
					{#if seg.emphasized}<em>{t(seg.text, locale)}</em>{:else}{t(seg.text, locale)}{/if}
				{/each}
			{:else}
				{@html m.home_intro_body()}
			{/if}
		</p>
		<button
			type="button"
			class="s2__cta"
			onclick={() => (drawer.open = true)}
			aria-haspopup="dialog"
			aria-expanded={drawer.open}
		>
			<span>{introCtaLabel}</span>
			<svg
				class="s2__cta-arrow"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<line x1="3" y1="12" x2="21" y2="12" />
				<polyline points="14 6 21 12 14 18" />
			</svg>
		</button>
	</div>
	<img class="s2__media" src={introImageSrc} alt="" loading="lazy" />
</section>

<!-- SECTION 3 ─ disciplines · radial-dark gradient · 4-3-2 bento -->
<section class="s3" data-bg="dark">
	<h2 class="s3__title">{disciplineTitle}</h2>
	<div class="s3__grid">
		{#each disciplineRows as row, rowIdx (rowIdx)}
			{#if row.length}
				<div class="s3__row">
					{#each row as card, i (`${rowIdx}-${i}`)}
						<article
							class="s3__card"
							style={card.image ? `background-image: url('${card.image}')` : ''}
						>
							<span class="s3__card-overlay" aria-hidden="true"></span>
							<h3 class="s3__card-title">{card.label}</h3>
						</article>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</section>

<!-- SECTION 3b ─ collab belt · radial-bottom dark · ∞ marquee -->
<section class="s3b" data-bg="dark">
	<p class="s3b__title">{collabsTitle}</p>
	<div class="s3b__belt s3b__belt--desktop" aria-label="collab marquee">
		<div class="s3b__belt-track">
			{#each collabPartners as p (`a-${p.id}`)}
				<div class="s3b__collab">
					{#if p.logo}
						<img class="s3b__logo-img" src={p.logo} alt={p.name} loading="lazy" />
					{:else}
						<span class="s3b__symbol" aria-hidden="true"></span>
						<span class="s3b__logo">{p.name}</span>
					{/if}
				</div>
			{/each}
			{#each collabPartners as p (`b-${p.id}`)}
				<div class="s3b__collab" aria-hidden="true">
					{#if p.logo}
						<img class="s3b__logo-img" src={p.logo} alt="" loading="lazy" />
					{:else}
						<span class="s3b__symbol"></span>
						<span class="s3b__logo">{p.name}</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div class="s3b__rows" aria-hidden="true">
		{#each collabRows as row, rowIdx (rowIdx)}
			{#if row.length}
				<div class="s3b__belt" data-dir={rowIdx % 2 === 0 ? 'l' : 'r'}>
					<div class="s3b__belt-track">
						{#each row as p (`m-${rowIdx}-a-${p.id}`)}
							<div class="s3b__collab">
								{#if p.logo}
									<img class="s3b__logo-img" src={p.logo} alt={p.name} loading="lazy" />
								{:else}
									<span class="s3b__symbol"></span>
									<span class="s3b__logo">{p.name}</span>
								{/if}
							</div>
						{/each}
						{#each row as p (`m-${rowIdx}-b-${p.id}`)}
							<div class="s3b__collab">
								{#if p.logo}
									<img class="s3b__logo-img" src={p.logo} alt="" loading="lazy" />
								{:else}
									<span class="s3b__symbol"></span>
									<span class="s3b__logo">{p.name}</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</section>

<!-- SECTION 4 ─ why us · centered intro · pill-cluster card -->
<section class="s4" data-bg="light">
	<div class="s4__intro">
		<span class="s4__badge">{whyBadge}</span>
		<h2 class="s4__title">{whyTitle}</h2>
		<p class="s4__body">{whyBody}</p>
	</div>

	<div class="s4__card">
		<div class="s4__col s4__col--left">
			{#each whyLeftPills as label, i (`l-${i}`)}
				<span
					class="s4__pill"
					class:s4__pill--indent-right={i === 1 || i === 2}
					style="--m-ind: {[0, 40, 60, 80][i]}px"
				>{label}</span>
			{/each}
		</div>

		<img class="s4__mark" src="/client-materials/Logo/symbol.svg" alt="" />


		<div class="s4__col s4__col--right">
			{#each whyRightPills as label, i (`r-${i}`)}
				<span
					class="s4__pill"
					class:s4__pill--indent-left={i === 1 || i === 2}
					style="--m-ind: {[80, 60, 40, 0][i]}px"
				>{label}</span>
			{/each}
		</div>
	</div>
</section>

<!-- SECTION 5 ─ FAQ · light · stacked accordion cards -->
<section class="s5" data-bg="light">
	<h2 class="s5__title">{faqTitle}</h2>
	<div class="s5__stack">
		{#each faqs as item, i (i)}
			<details class="s5__item" open={i === 0}>
				<summary class="s5__head">
					<span class="s5__q">{item.q}</span>
					<svg
						class="s5__chev"
						viewBox="0 0 28 28"
						fill="none"
						stroke="#06090c"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<polyline points="7 11 14 18 21 11" />
					</svg>
				</summary>
				<p class="s5__a">{item.a}</p>
			</details>
		{/each}
	</div>
</section>

<style>
	/* ─── Blueprint base ─── */
	.bp {
		position: relative;
		background: #fff;
		color: #06090c;
		font-family: 'Google Sans', 'Product Sans', 'Inter', system-ui, sans-serif;
		border-bottom: 1px dashed rgba(6, 9, 12, 0.28);
	}
	.bp--dark {
		background: #06090c;
		color: #fff;
		border-bottom-color: rgba(255, 255, 255, 0.28);
	}
	.bp--dark .bp__label,
	.bp--dark .bp__gap-mark,
	.bp--dark .bp__block-tag {
		color: rgba(255, 255, 255, 0.5);
	}
	.bp--dark .bp__frame,
	.bp--dark .bp__block,
	.bp--dark .bp__faq {
		border-color: rgba(255, 255, 255, 0.32);
	}
	.bp--dark .bp__body {
		color: rgba(255, 255, 255, 0.78);
	}

	.bp__label {
		position: absolute;
		top: 12px;
		left: 12px;
		font-family: ui-monospace, 'SF Mono', 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.06em;
		color: rgba(6, 9, 12, 0.5);
		text-transform: uppercase;
		z-index: 2;
	}

	.bp__frame {
		position: relative;
		border: 1px dashed rgba(6, 9, 12, 0.32);
	}

	.bp__gap-mark {
		display: block;
		text-align: center;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.12em;
		color: rgba(6, 9, 12, 0.4);
	}
	.bp__gap-mark--inline {
		display: inline-block;
	}

	.bp__body {
		font-size: 16px;
		line-height: 1.6;
		color: rgba(6, 9, 12, 0.72);
		max-width: 70ch;
		margin: 0;
	}

	/* ─── Section 1 — Hero ─── */
	.s1 {
		position: relative;
		min-height: 100vh;
		padding: 64px;
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
		overflow: hidden;
		background: #06090c;
		color: #fff;
	}
	.s1__video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
	}
	.s1__overlay {
		position: absolute;
		inset: 0;
		z-index: 1;
		background: linear-gradient(
			180deg,
			rgba(6, 9, 12, 0.5) 0%,
			rgba(6, 9, 12, 0.5) 64%,
			rgba(6, 9, 12, 0.8) 100%
		);
		pointer-events: none;
	}
	.s1__title {
		position: relative;
		z-index: 2;
		margin: 0;
		color: #fff;
		font-size: 80px;
		line-height: 100px;
		font-weight: 500;
		letter-spacing: 0.8px;
		white-space: pre-line;
		word-wrap: break-word;
	}

	/* ─── Section 2 — Intro ─── */
	.s2 {
		padding: 64px;
		background: #f9f9fb;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 48px;
	}
	.s2__lead {
		width: 100%;
		max-width: 920px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 32px;
	}
	.s2__body {
		margin: 0;
		font-size: 40px;
		line-height: 48px;
		font-weight: 600;
		letter-spacing: 0.4px;
		color: rgba(6, 9, 12, 0.48);
	}
	.s2__body :global(em) {
		color: #06090c;
		font-style: normal;
	}
	.s2__cta {
		appearance: none;
		border: 0;
		font: inherit;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 16px 20px 16px 24px;
		background: #06090c;
		color: #fff;
		border-radius: 12px;
		outline: 1px solid rgba(255, 255, 255, 0.04);
		outline-offset: -1px;
		font-size: 18px;
		font-weight: 600;
		line-height: 24px;
		letter-spacing: 0.36px;
		text-decoration: none;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			transform 0.2s ease;
	}
	.s2__cta:hover {
		background: #1a1f24;
	}
	.s2__cta:hover .s2__cta-arrow {
		transform: translateX(4px);
	}
	.s2__cta-arrow {
		width: 24px;
		height: 24px;
		flex: none;
		transition: transform 0.2s ease;
	}
	.s2__media {
		display: block;
		width: 100%;
		aspect-ratio: 1312 / 568;
		object-fit: cover;
		border-radius: 16px;
		border: 2px solid rgba(38, 53, 84, 0.08);
	}

	/* ─── Section 3 — Disciplines ─── */
	.s3 {
		padding: 100px 64px;
		background: radial-gradient(
			ellipse 100% 49.87% at 50% 0%,
			#121518 0%,
			#06090c 100%
		);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 80px;
	}
	.s3__title {
		margin: 0;
		max-width: 800px;
		text-align: center;
		color: #fff;
		font-size: 40px;
		font-weight: 600;
		line-height: 48px;
		letter-spacing: 0.4px;
	}
	.s3__grid {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	.s3__row {
		display: flex;
		gap: 24px;
	}
	.s3__card {
		position: relative;
		flex: 1 1 0;
		height: 240px;
		padding: 24px;
		border-radius: 16px;
		outline: 1px solid rgba(255, 255, 255, 0.04);
		outline-offset: -1px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		gap: 12px;
		background-color: #1a1f24;
		background-size: cover;
		background-position: center;
		isolation: isolate;
	}
	.s3__card-overlay {
		position: absolute;
		inset: 0;
		z-index: 1;
		background: linear-gradient(180deg, rgba(6, 9, 12, 0) 0%, #06090c 100%);
		pointer-events: none;
	}
	.s3__card-title {
		position: relative;
		z-index: 2;
		margin: 0;
		color: #fff;
		font-size: 24px;
		font-weight: 600;
		line-height: 32px;
		letter-spacing: 0.24px;
	}

	/* ─── Section 3b — collab belt ─── */
	.s3b {
		position: relative;
		padding: 60px 0 120px;
		background: radial-gradient(
			ellipse 100% 49.87% at 50.13% 100%,
			#121518 0%,
			#06090c 100%
		);
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 48px;
		overflow: hidden;
	}
	.s3b__title {
		margin: 0;
		text-align: center;
		color: rgba(255, 255, 255, 0.48);
		font-size: 20px;
		font-weight: 500;
		line-height: 28px;
		letter-spacing: 0.4px;
	}
	.s3b__belt {
		width: 100%;
		overflow: hidden;
		mask-image: linear-gradient(
			to right,
			transparent 0,
			#000 8%,
			#000 92%,
			transparent 100%
		);
	}
	.s3b__belt-track {
		display: flex;
		width: max-content;
		animation: s3b-scroll 40s linear infinite;
	}
	.s3b__belt:hover .s3b__belt-track {
		animation-play-state: paused;
	}
	.s3b__belt[data-dir='r'] .s3b__belt-track {
		animation-direction: reverse;
	}
	@keyframes s3b-scroll {
		to {
			transform: translateX(-50%);
		}
	}
	.s3b__rows {
		display: none;
	}
	.s3b__collab {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-right: 48px;
		flex: none;
	}
	.s3b__symbol {
		width: 40px;
		height: 40px;
		flex: none;
		border: 1px dashed rgba(255, 255, 255, 0.45);
		border-radius: 999px;
	}
	.s3b__logo {
		width: 160px;
		height: 48px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px dashed rgba(255, 255, 255, 0.45);
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.08em;
		color: rgba(255, 255, 255, 0.55);
	}
	.s3b__logo-img {
		height: 48px;
		width: auto;
		display: block;
		opacity: 0.84;
	}

	/* ─── Section 4 — Why Us ─── */
	.s4 {
		padding: 100px 64px;
		background: #f9f9fb;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 64px;
	}
	.s4__intro {
		width: 100%;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		text-align: center;
	}
	.s4__badge {
		display: inline-flex;
		align-items: center;
		padding: 12px 20px;
		background: rgba(6, 9, 12, 0.02);
		border-radius: 24px;
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		color: #06090c;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.s4__title {
		margin: 0;
		color: #06090c;
		font-size: 40px;
		font-weight: 600;
		line-height: 48px;
		letter-spacing: 0.4px;
	}
	.s4__body {
		margin: 0;
		color: rgba(6, 9, 12, 0.64);
		font-size: 16px;
		font-weight: 400;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.s4__card {
		position: relative;
		width: 100%;
		max-width: 1312px;
		padding: 64px;
		background:
			url('/client-materials/pattern.svg') center bottom / 100% auto no-repeat,
			#fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		box-shadow: 0 8px 40px rgba(6, 9, 12, 0.08);
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 40px;
		overflow: hidden;
	}
	.s4__col {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 40px;
	}
	.s4__col--left {
		align-items: flex-end;
	}
	.s4__col--right {
		align-items: flex-start;
	}
	.s4__pill {
		display: inline-flex;
		align-items: center;
		padding: 12px 20px;
		background: #fff;
		border-radius: 32px;
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		box-shadow: 0 8px 40px rgba(6, 9, 12, 0.08);
		color: #06090c;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
		white-space: nowrap;
	}
	.s4__pill--indent-right {
		margin-right: 40px;
	}
	.s4__pill--indent-left {
		margin-left: 40px;
	}
	.s4__mark {
		flex: none;
		width: 199px;
		height: 240px;
		object-fit: contain;
		display: block;
	}

	/* ─── Section 5 — FAQ ─── */
	.s5 {
		padding: 100px 64px;
		background: #f9f9fb;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 64px;
	}
	.s5__title {
		margin: 0;
		text-align: center;
		color: #06090c;
		font-size: 40px;
		font-weight: 600;
		line-height: 48px;
		letter-spacing: 0.4px;
	}
	.s5__stack {
		width: 100%;
		max-width: 720px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.s5__item {
		width: 100%;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		overflow: hidden;
	}
	.s5__head {
		list-style: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		padding: 20px;
		cursor: pointer;
	}
	.s5__head::-webkit-details-marker {
		display: none;
	}
	.s5__q {
		flex: 1 1 0;
		color: #06090c;
		font-size: 20px;
		font-weight: 500;
		line-height: 28px;
		letter-spacing: 0.4px;
	}
	.s5__chev {
		width: 28px;
		height: 28px;
		flex: none;
		transition: transform 0.2s ease;
	}
	.s5__item[open] .s5__chev {
		transform: rotate(180deg);
	}
	.s5__a {
		margin: 0;
		padding: 0 20px 20px;
		color: rgba(6, 9, 12, 0.64);
		font-size: 16px;
		font-weight: 400;
		line-height: 24px;
		letter-spacing: 0.32px;
	}

	/* ─── Mobile ─── */
	@media (max-width: 768px) {
		.s1 {
			padding: 32px 20px;
			min-height: 100vh;
		}
		.s1__title {
			font-size: 44px;
			line-height: 56px;
			letter-spacing: 0.44px;
			color: #f7f7ed;
		}
		.s4 {
			padding: 48px 24px;
		}
		.s2 {
			padding: 32px 20px;
			gap: 32px;
		}
		.s2__lead {
			gap: 20px;
		}
		.s2__body {
			font-size: 24px;
			line-height: 32px;
			letter-spacing: 0.24px;
		}
		.s2__cta {
			padding: 12px 16px 12px 20px;
			font-size: 16px;
			line-height: 24px;
			letter-spacing: 0.32px;
		}
		.s2__cta-arrow {
			width: 20px;
			height: 20px;
		}
		.s2__media {
			aspect-ratio: 335 / 456;
		}
		.s4 {
			padding: 64px 20px;
			gap: 48px;
			align-items: stretch;
		}
		.s4__intro {
			align-self: stretch;
			max-width: none;
		}
		.s4__badge {
			padding: 8px 16px;
			font-size: 14px;
			line-height: 20px;
			letter-spacing: 0.28px;
		}
		.s4__title {
			font-size: 24px;
			line-height: 32px;
			letter-spacing: 0.24px;
		}
		.s4__body {
			font-size: 14px;
			line-height: 20px;
			letter-spacing: 0.28px;
		}
		.s4__card {
			align-self: stretch;
			padding: 32px 80px 32px 0;
			display: grid;
			grid-template-columns: 148px auto;
			grid-template-rows: auto auto;
			column-gap: 0;
			row-gap: 20px;
			justify-content: center;
			align-items: center;
		}
		.s4__mark {
			grid-column: 1;
			grid-row: 1 / 3;
			width: 100%;
			height: 100%;
			align-self: stretch;
			object-fit: contain;
			object-position: center;
		}
		.s4__col {
			grid-column: 2;
			flex-direction: column;
			align-items: flex-start;
			gap: 20px;
			flex: none;
		}
		.s4__col--left {
			grid-row: 1;
		}
		.s4__col--right {
			grid-row: 2;
		}
		.s4__pill {
			margin-left: var(--m-ind, 0);
			margin-right: 0;
			padding: 8px 16px;
			font-size: 12px;
			line-height: 16px;
			letter-spacing: 0.24px;
		}
		.s4__pill--indent-left,
		.s4__pill--indent-right {
			margin-left: var(--m-ind, 0);
			margin-right: 0;
		}
		.s3 {
			padding: 64px 20px;
			gap: 48px;
			align-items: stretch;
		}
		.s3__title {
			max-width: none;
			font-size: 24px;
			line-height: 32px;
			letter-spacing: 0.24px;
		}
		.s3__grid {
			gap: 24px;
		}
		.s3__row {
			gap: 16px;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			scrollbar-width: none;
		}
		.s3__row::-webkit-scrollbar {
			display: none;
		}
		.s3__card {
			flex: none;
			width: 280px;
			min-width: 280px;
			height: 160px;
			padding: 16px;
			scroll-snap-align: start;
		}
		.s3__card-title {
			font-size: 16px;
			line-height: 24px;
			letter-spacing: 0.32px;
		}
		.s3b__belt--desktop {
			display: none;
		}
		.s3b__rows {
			display: flex;
			flex-direction: column;
			gap: 40px;
			width: 100%;
		}
		.s5 {
			padding: 64px 20px;
			gap: 48px;
			align-items: stretch;
		}
		.s5__title {
			font-size: 24px;
			line-height: 32px;
			letter-spacing: 0.24px;
		}
		.s5__stack {
			max-width: none;
			gap: 12px;
		}
		.s5__head {
			padding: 12px 16px;
		}
		.s5__q {
			font-size: 16px;
			line-height: 24px;
			letter-spacing: 0.32px;
		}
		.s5__chev {
			width: 20px;
			height: 20px;
		}
		.s5__a {
			padding: 0 16px 12px;
			font-size: 14px;
			line-height: 20px;
			letter-spacing: 0.28px;
		}
	}
</style>

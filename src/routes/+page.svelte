<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { fileUrl, t, imgUrl, slugify, SANITY_CONFIGURED } from '$lib/sanity';
	import { drawer } from '$lib/stores/drawer.svelte';
	import { disciplineTransition } from '$lib/stores/disciplineTransition.svelte';
	import { onMount } from 'svelte';
	import LogoBelt from '$lib/components/LogoBelt.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { buildSeo, clampDescription } from '$lib/seo';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const locale = $derived(getLocale());

	// ─── Hero (s1) ───
	let isMobileViewport = $state(false);
	let heroVideoEl: HTMLVideoElement | undefined = $state();
	let heroMuted = $state(true);

	function toggleHeroMute() {
		heroMuted = !heroMuted;
		if (!heroVideoEl) return;
		heroVideoEl.muted = heroMuted;
		if (!heroMuted) {
			heroVideoEl.play().catch(() => {
				heroMuted = true;
				if (heroVideoEl) heroVideoEl.muted = true;
			});
		}
	}

	const desktopVideoSrc = $derived(
		fileUrl(data.hero?.videoMp4?.asset) ??
			fileUrl(data.hero?.videoWebm?.asset) ??
			'/client-materials/hero-section-video.mp4'
	);
	const mobileVideoSrc = $derived(
		fileUrl(data.hero?.videoMobileMp4?.asset) ??
			fileUrl(data.hero?.videoMobileWebm?.asset) ??
			null
	);
	const heroVideoSrc = $derived(
		isMobileViewport && mobileVideoSrc ? mobileVideoSrc : desktopVideoSrc
	);
	const heroPosterSrc = $derived(
		SANITY_CONFIGURED
			? (isMobileViewport && data.hero?.videoMobilePoster
				? imgUrl(data.hero.videoMobilePoster, { w: 1080, fit: 'crop', q: 60 })
				: data.hero?.videoPoster
					? imgUrl(data.hero.videoPoster, { w: 1280, fit: 'crop', q: 60 })
					: undefined)
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

	type DisciplineCard = { slug: string; label: string; image: string | null };

	const disciplineCards = $derived<DisciplineCard[]>(
		data.disciplines?.cards?.length
			? data.disciplines.cards.map((card, i) => {
					const enLabel = card.title?.en || card.title?.mn || `card-${i}`;
					return {
						slug: card.slug || slugify(enLabel) || `card-${i}`,
						label: t(card.title, locale) || `Card ${i + 1}`,
						image:
							SANITY_CONFIGURED && card.image
								? imgUrl(card.image, { w: 600, h: 340, fit: 'crop', q: 65 })
								: null
					};
				})
			: fallbackDisciplines.map((d) => ({
					slug: d.id,
					label: d.label(),
					image: `/client-materials/disciplines/${d.id}.png`
				}))
	);

	const disciplineTitle = $derived(t(data.disciplines?.title, locale) || m.home_disciplines_title());

	// 4 / 3 / 2 layout split — preserved as visual hierarchy across shelves
	const disciplineRows = $derived([
		disciplineCards.slice(0, 4),
		disciplineCards.slice(4, 7),
		disciplineCards.slice(7)
	]);

	// The card whose image should hold `view-transition-name` for the morph.
	// Forward: set in onclick. Back: pre-set on detail page so the matching card
	// here is named when the post-nav snapshot is taken. Cleared after settling.
	const activeSlug = $derived(disciplineTransition.slug);

	function activateCard(e: MouseEvent, slug: string) {
		disciplineTransition.arm(slug);
		// Belt-and-braces: also stamp the DOM directly in case Svelte hasn't flushed
		// before the link click triggers navigation snapshotting.
		const card = e.currentTarget as HTMLAnchorElement;
		const img = card.querySelector<HTMLElement>('.s3__card-img');
		if (img) img.style.viewTransitionName = `discipline-${slug}`;
	}

	onMount(() => {
		// Clear the armed slug once any incoming morph has had time to play.
		const timer = setTimeout(() => disciplineTransition.disarm(), 700);

		// Track viewport for hero video — swap to mobile asset when available.
		const mq = window.matchMedia('(max-width: 768px)');
		isMobileViewport = mq.matches;
		const onMqChange = (e: MediaQueryListEvent) => (isMobileViewport = e.matches);
		mq.addEventListener('change', onMqChange);

		return () => {
			clearTimeout(timer);
			mq.removeEventListener('change', onMqChange);
		};
	});

	// Apple-Music-style image pan: images lag behind the shelf as it scrolls.
	function pan(node: HTMLDivElement) {
		let raf = 0;
		let cards: HTMLElement[] = [];

		const collect = () => {
			cards = Array.from(node.querySelectorAll<HTMLElement>('.s3__card'));
		};

		const update = () => {
			const viewportCenter = node.scrollLeft + node.clientWidth / 2;
			for (const card of cards) {
				const cardCenter = card.offsetLeft + card.offsetWidth / 2;
				const offset = (cardCenter - viewportCenter) / node.clientWidth;
				const clamped = Math.max(-1, Math.min(1, offset));
				const px = -clamped * (card.offsetWidth * 0.08);
				card.style.setProperty('--pan', `${px}px`);
			}
		};

		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(update);
		};

		node.addEventListener('scroll', onScroll, { passive: true });

		const ro = new ResizeObserver(() => {
			collect();
			update();
		});
		ro.observe(node);

		collect();
		requestAnimationFrame(() => {
			collect();
			update();
		});

		return {
			destroy() {
				cancelAnimationFrame(raf);
				node.removeEventListener('scroll', onScroll);
				ro.disconnect();
			}
		};
	}

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

	// ─── SEO + GEO ───
	const introBodyText = $derived(
		introSegments?.length
			? introSegments.map((seg) => t(seg.text, locale)).join(' ')
			: undefined
	);

	const homeSeo = $derived(
		buildSeo({
			title: heroTitle,
			description: clampDescription(introBodyText),
			image: heroPosterSrc ?? introImageSrc,
			pathname: '/',
			locale
		})
	);

	const homeJsonLd = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'Nair Entertainment',
			url: 'https://nair.mn',
			inLanguage: locale,
			potentialAction: {
				'@type': 'SearchAction',
				target: 'https://nair.mn/?q={search_term_string}',
				'query-input': 'required name=search_term_string'
			}
		},
		// FAQ schema lifts answers into Google rich results + LLM ingestion.
		...(faqs.length
			? [
					{
						'@context': 'https://schema.org',
						'@type': 'FAQPage',
						mainEntity: faqs.map((f) => ({
							'@type': 'Question',
							name: f.q,
							acceptedAnswer: { '@type': 'Answer', text: f.a }
						}))
					}
				]
			: [])
	]);
</script>

<Seo seo={homeSeo} {locale} jsonLd={homeJsonLd} />

<!-- SECTION 1 ─ hero · video bg · dark gradient · title bottom-left -->
<section class="s1" data-bg="dark">
	<video
		bind:this={heroVideoEl}
		class="s1__video"
		src={heroVideoSrc}
		poster={heroPosterSrc}
		autoplay
		muted={heroMuted}
		loop
		playsinline
		preload="auto"
		aria-hidden="true"
	></video>
	<div class="s1__overlay" aria-hidden="true"></div>
	<h1 class="s1__title">{heroTitle}</h1>
	<button
		type="button"
		class="s1__mute"
		onclick={toggleHeroMute}
		aria-pressed={!heroMuted}
		aria-label={heroMuted ? 'Дуу нээх' : 'Дуу хаах'}
	>
		{#if heroMuted}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
				<line x1="23" y1="9" x2="17" y2="15" />
				<line x1="17" y1="9" x2="23" y2="15" />
			</svg>
		{:else}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
				<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
				<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
			</svg>
		{/if}
	</button>
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
			<span class="s2__cta-label">{introCtaLabel}</span>
			<span class="s2__cta-chip" aria-hidden="true">
				<svg
					class="s2__cta-arrow"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="3" y1="12" x2="21" y2="12" />
					<polyline points="14 6 21 12 14 18" />
				</svg>
			</span>
		</button>
	</div>
	<img class="s2__media" src={introImageSrc} alt="" loading="lazy" />
</section>

<!-- SECTION 3 ─ disciplines · radial-dark gradient · apple-music-style pan shelves -->
<section class="s3" data-bg="dark">
	<h2 class="s3__title">{disciplineTitle}</h2>
	<div class="s3__shelves">
		{#each disciplineRows as row, rowIdx (rowIdx)}
			{#if row.length}
				<div class="s3__shelf" data-row={rowIdx} use:pan>
					<div class="s3__shelf-edge" aria-hidden="true"></div>
					{#each row as card, i (`${rowIdx}-${i}`)}
						<a
							class="s3__card"
							href="/disciplines/{card.slug}"
							onclick={(e) => activateCard(e, card.slug)}
							aria-label={card.label}
						>
							{#if card.image}
								<img
									class="s3__card-img"
									src={card.image}
									alt=""
									loading="lazy"
									style:view-transition-name={activeSlug === card.slug
										? `discipline-${card.slug}`
										: null}
								/>
							{/if}
							<span class="s3__card-overlay" aria-hidden="true"></span>
							<h3 class="s3__card-title">{card.label}</h3>
						</a>
					{/each}
					<div class="s3__shelf-edge" aria-hidden="true"></div>
				</div>
			{/if}
		{/each}
	</div>
</section>

<!-- SECTION 3b ─ collab belt · radial-bottom dark · ∞ marquee -->
<LogoBelt title={collabsTitle} partners={collabPartners} />

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
		min-height: 100dvh;
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
		font-size: 64px;
		line-height: 80px;
		font-weight: 500;
		letter-spacing: 0.64px;
		white-space: pre-line;
		word-wrap: break-word;
	}
	.s1__mute {
		position: fixed;
		bottom: 24px;
		right: 24px;
		z-index: 45;
		width: 48px;
		height: 48px;
		display: grid;
		place-items: center;
		padding: 0;
		appearance: none;
		background: rgba(6, 9, 12, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 999px;
		color: #fff;
		cursor: pointer;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			transform 0.2s ease;
	}
	.s1__mute:hover {
		background: rgba(6, 9, 12, 0.6);
		border-color: rgba(255, 255, 255, 0.32);
	}
	.s1__mute:active {
		transform: scale(0.95);
	}
	.s1__mute:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 3px;
	}
	.s1__mute svg {
		width: 20px;
		height: 20px;
	}
	@media (max-width: 768px) {
		.s1__mute {
			bottom: 20px;
			right: 20px;
			width: 44px;
			height: 44px;
		}
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
		position: relative;
		appearance: none;
		border: 0;
		font: inherit;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		padding: 20px 20px 20px 32px;
		background: #9e1c21;
		color: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(0, 0, 0, 0.08);
		outline-offset: -1px;
		font-size: 18px;
		font-weight: 600;
		line-height: 24px;
		letter-spacing: 0.36px;
		text-decoration: none;
		cursor: pointer;
		overflow: hidden;
		isolation: isolate;
		box-shadow: 0 8px 24px rgba(158, 28, 33, 0.28);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			background-color 0.2s ease;
	}
	.s2__cta::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: url('/client-materials/pattern-bold.svg');
		background-repeat: repeat-x;
		background-position: center;
		background-size: auto 100%;
		opacity: 0.32;
		pointer-events: none;
		z-index: 0;
	}
	.s2__cta:hover {
		background-color: #b32228;
		transform: translateY(-2px);
		box-shadow: 0 14px 32px rgba(158, 28, 33, 0.36);
	}
	.s2__cta:active {
		transform: translateY(0);
	}
	.s2__cta:focus-visible {
		outline: 3px solid #06090c;
		outline-offset: 4px;
	}
	.s2__cta-label {
		position: relative;
		z-index: 1;
	}
	.s2__cta-chip {
		position: relative;
		z-index: 1;
	}
	.s2__cta-chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: #fff;
		color: #9e1c21;
		position: relative;
		z-index: 1;
	}
	.s2__cta-arrow {
		width: 20px;
		height: 20px;
		flex: none;
		transition: transform 0.2s ease;
	}
	.s2__cta:hover .s2__cta-arrow {
		transform: translateX(3px);
	}
	.s2__media {
		display: block;
		width: 100%;
		aspect-ratio: 1312 / 568;
		object-fit: cover;
		border-radius: 16px;
		border: 2px solid rgba(38, 53, 84, 0.08);
	}

	/* ─── Section 3 — Disciplines · Apple-Music pan shelves ─── */
	.s3 {
		padding: 100px 0;
		background: radial-gradient(
			ellipse 100% 49.87% at 50% 0%,
			#121518 0%,
			#06090c 100%
		);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 64px;
	}
	.s3__title {
		margin: 0;
		padding: 0 64px;
		max-width: 800px;
		text-align: center;
		color: #fff;
		font-size: 40px;
		font-weight: 600;
		line-height: 48px;
		letter-spacing: 0.4px;
	}
	.s3__shelves {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	.s3__shelf {
		display: flex;
		gap: 24px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: 64px;
		scrollbar-width: none;
		-ms-overflow-style: none;
		-webkit-overflow-scrolling: touch;
		/* pan-x pan-y so horizontal pans scroll the shelf (overflow-x: auto),
		   vertical pans bubble to the page. pan-x alone blocks vertical scroll. */
		touch-action: pan-x pan-y;
		overscroll-behavior-x: contain;
	}
	.s3__shelf::-webkit-scrollbar {
		display: none;
	}
	.s3__shelf-edge {
		flex: 0 0 40px;
	}
	.s3__shelf[data-row='0'] .s3__card {
		width: clamp(280px, 28vw, 360px);
		height: 220px;
	}
	.s3__shelf[data-row='1'] .s3__card {
		width: clamp(360px, 36vw, 480px);
		height: 280px;
	}
	.s3__shelf[data-row='2'] .s3__card {
		width: clamp(520px, 56vw, 760px);
		height: 360px;
	}
	.s3__card {
		appearance: none;
		border: 0;
		font: inherit;
		color: inherit;
		text-align: left;
		text-decoration: none;
		cursor: pointer;
		position: relative;
		flex: 0 0 auto;
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
		isolation: isolate;
		scroll-snap-align: start;
		transition: transform 0.3s ease, outline-color 0.3s ease;
	}
	.s3__card:hover {
		transform: translateY(-4px);
		outline-color: rgba(255, 255, 255, 0.18);
	}
	.s3__card:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 2px;
	}
	.s3__card-img {
		position: absolute;
		top: 0;
		left: -8%;
		width: 116%;
		height: 100%;
		object-fit: cover;
		transform: translate3d(var(--pan, 0px), 0, 0);
		will-change: transform;
		z-index: 0;
		pointer-events: none;
		user-select: none;
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
			min-height: 100dvh;
		}
		.s1__title {
			font-size: 36px;
			line-height: 44px;
			letter-spacing: 0.36px;
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
			padding: 14px 14px 14px 24px;
			gap: 14px;
			font-size: 16px;
			line-height: 24px;
			letter-spacing: 0.32px;
			border-radius: 14px;
		}
		.s2__cta-chip {
			width: 36px;
			height: 36px;
			border-radius: 10px;
		}
		.s2__cta-arrow {
			width: 18px;
			height: 18px;
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
			padding: 64px 0;
			gap: 32px;
			align-items: stretch;
		}
		.s3__title {
			padding: 0 20px;
			max-width: none;
			font-size: 24px;
			line-height: 32px;
			letter-spacing: 0.24px;
		}
		.s3__shelves {
			gap: 16px;
		}
		.s3__shelf {
			gap: 16px;
			scroll-padding-inline: 20px;
		}
		.s3__shelf-edge {
			flex: 0 0 4px;
		}
		.s3__shelf[data-row='0'] .s3__card {
			width: 240px;
			height: 160px;
		}
		.s3__shelf[data-row='1'] .s3__card {
			width: 280px;
			height: 184px;
		}
		.s3__shelf[data-row='2'] .s3__card {
			width: 320px;
			height: 208px;
		}
		.s3__card {
			padding: 16px;
		}
		.s3__card-title {
			font-size: 16px;
			line-height: 24px;
			letter-spacing: 0.32px;
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

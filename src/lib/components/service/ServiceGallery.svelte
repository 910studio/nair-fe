<script lang="ts">
	let { images }: { images: string[] } = $props();

	let viewport: HTMLDivElement | undefined = $state();
	let activeIndex = $state(0);

	function onScroll() {
		if (!viewport) return;
		const slideWidth = viewport.clientWidth;
		const idx = Math.round(viewport.scrollLeft / slideWidth);
		if (idx !== activeIndex) activeIndex = idx;
	}

	function goTo(i: number) {
		if (!viewport) return;
		viewport.scrollTo({ left: i * viewport.clientWidth, behavior: 'smooth' });
	}
</script>

<div class="gallery">
	<div
		bind:this={viewport}
		onscroll={onScroll}
		class="gallery__viewport"
		role="region"
		aria-roledescription="carousel"
		aria-label="Gallery"
	>
		{#each images as src, i (i)}
			<div class="gallery__slide" aria-label="Slide {i + 1} of {images.length}">
				<img class="gallery__img" {src} alt="" loading="lazy" />
			</div>
		{/each}
	</div>

	<div class="gallery__dots" role="tablist">
		{#each images as _, i (i)}
			<button
				type="button"
				role="tab"
				class="gallery__dot"
				class:gallery__dot--active={i === activeIndex}
				aria-selected={i === activeIndex}
				onclick={() => goTo(i)}
				aria-label="Go to slide {i + 1}"
			></button>
		{/each}
	</div>
</div>

<style>
	.gallery {
		width: 100%;
		max-width: 920px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}
	.gallery__viewport {
		width: 100%;
		display: flex;
		gap: 32px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		scrollbar-width: none;
		-ms-overflow-style: none;
		-webkit-overflow-scrolling: touch;
		touch-action: pan-x;
		overscroll-behavior-x: contain;
	}
	.gallery__viewport::-webkit-scrollbar {
		display: none;
	}
	.gallery__slide {
		flex: 0 0 100%;
		scroll-snap-align: start;
		padding: 32px;
		background: #fff;
		border-radius: 16px;
		border: 1px solid rgba(6, 9, 12, 0.08);
		box-shadow: 0 8px 40px rgba(6, 9, 12, 0.08);
	}
	.gallery__img {
		display: block;
		width: 100%;
		height: auto;
		max-height: 416px;
		object-fit: cover;
		border-radius: 8px;
		pointer-events: none;
		user-select: none;
	}
	.gallery__dots {
		display: inline-flex;
		gap: 8px;
		padding: 12px;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.04);
		outline-offset: -1px;
		box-shadow: 0 8px 40px rgba(6, 9, 12, 0.08);
	}
	.gallery__dot {
		appearance: none;
		width: 8px;
		height: 8px;
		padding: 0;
		border: 0;
		border-radius: 8px;
		background: rgba(6, 9, 12, 0.12);
		cursor: pointer;
		transition:
			width 0.3s ease,
			background-color 0.3s ease;
	}
	.gallery__dot--active {
		width: 20px;
		background: #9e1c21;
	}

	@media (max-width: 768px) {
		.gallery__slide {
			padding: 16px;
		}
	}
</style>

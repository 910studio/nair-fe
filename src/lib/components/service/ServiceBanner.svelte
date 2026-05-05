<script lang="ts">
	type Props = {
		image: string;
		title: string;
		titleAlign?: 'bottom' | 'center';
	};
	let { image, title, titleAlign = 'bottom' }: Props = $props();
</script>

<header class="banner" data-bg="dark" data-title-align={titleAlign} style="--banner-image: url('{image}')">
	<div class="banner__overlay" aria-hidden="true"></div>
	<h1 class="banner__title">{title}</h1>
</header>

<style>
	.banner {
		position: relative;
		width: 100%;
		height: 320px;
		background-color: #1a1f24;
		background-image: var(--banner-image);
		background-size: cover;
		background-position: center;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: 32px;
		border-bottom: 1px solid rgba(6, 9, 12, 0.08);
	}
	.banner[data-title-align='center'] {
		align-items: center;
	}
	.banner__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(6, 9, 12, 0.4) 0%, #06090c 100%);
		pointer-events: none;
	}
	.banner__title {
		position: relative;
		z-index: 1;
		margin: 0;
		text-align: center;
		color: #fff;
		font-size: 40px;
		font-weight: 600;
		line-height: 48px;
		letter-spacing: 0.4px;
	}

	@media (max-width: 768px) {
		.banner {
			height: 240px;
			padding: 24px 20px;
		}
		.banner__title {
			font-size: 28px;
			line-height: 36px;
			letter-spacing: 0.28px;
		}
	}
</style>

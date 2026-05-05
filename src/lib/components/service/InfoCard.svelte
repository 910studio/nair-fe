<script lang="ts">
	type Props = {
		label: string;
		value: string;
		illustration?: string;
	};
	let { label, value, illustration }: Props = $props();
</script>

<article class="info-card">
	{#if illustration}
		<img class="info-card__illustration" src={illustration} alt="" loading="lazy" />
		<div class="info-card__fade" aria-hidden="true"></div>
	{/if}
	<div class="info-card__content">
		<p class="info-card__label">{label}</p>
		<p class="info-card__value">{value}</p>
	</div>
</article>

<style>
	.info-card {
		position: relative;
		flex: 1 1 0;
		min-height: 168px;
		padding: 20px 24px;
		background: #fff;
		border-radius: 16px;
		outline: 1px solid rgba(6, 9, 12, 0.08);
		outline-offset: -1px;
		box-shadow: 0 8px 24px rgba(6, 9, 12, 0.02);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		isolation: isolate;
	}
	.info-card__illustration {
		position: absolute;
		top: 12px;
		right: 16px;
		width: auto;
		height: 100%;
		max-height: 280px;
		object-fit: contain;
		object-position: top right;
		z-index: 0;
		pointer-events: none;
		user-select: none;
	}
	.info-card__fade {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 64px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 100%);
		z-index: 1;
		pointer-events: none;
	}
	.info-card__content {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.info-card__label {
		margin: 0;
		color: #9e1c21;
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.info-card__value {
		margin: 0;
		color: #06090c;
		font-size: 24px;
		font-weight: 600;
		line-height: 32px;
		letter-spacing: 0.24px;
		white-space: pre-line;
	}
</style>

<script lang="ts">
	type Props = {
		status?: string | number;
		title: string;
		body?: string;
		cta?: { label: string; href: string };
	};

	let { status, title, body, cta }: Props = $props();
</script>

<section class="stock" data-bg="light">
	<span class="stock__pattern" aria-hidden="true"></span>

	<div class="stock__inner">
		<img class="stock__mark" src="/client-materials/Logo/symbol.svg" alt="Nair Entertainment" />
		{#if status !== undefined}
			<p class="stock__status">{status}</p>
		{/if}
		<h1 class="stock__title">{title}</h1>
		{#if body}
			<p class="stock__body">{body}</p>
		{/if}
		{#if cta}
			<a class="stock__cta" href={cta.href}>
				<svg
					class="stock__cta-icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<line x1="21" y1="12" x2="3" y2="12" />
					<polyline points="10 18 3 12 10 6" />
				</svg>
				<span>{cta.label}</span>
			</a>
		{/if}
	</div>
</section>

<style>
	.stock {
		position: relative;
		min-height: 100vh;
		padding: 64px 20px;
		background: #f9f9fb;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		isolation: isolate;
	}
	.stock__pattern {
		position: absolute;
		inset: 0;
		background:
			url('/client-materials/pattern.svg') center bottom / 100% auto no-repeat,
			transparent;
		pointer-events: none;
		z-index: 0;
	}
	.stock__inner {
		position: relative;
		z-index: 1;
		max-width: 560px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		text-align: center;
	}
	.stock__mark {
		width: 72px;
		height: 88px;
		object-fit: contain;
	}
	.stock__status {
		margin: 0;
		color: #9e1c21;
		font-size: 80px;
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}
	.stock__title {
		margin: 0;
		color: #06090c;
		font-size: 32px;
		font-weight: 600;
		line-height: 40px;
		letter-spacing: 0.32px;
	}
	.stock__body {
		margin: 0;
		max-width: 42ch;
		color: rgba(6, 9, 12, 0.64);
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.stock__cta {
		margin-top: 16px;
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
	.stock__cta:hover {
		background: #1a1f24;
	}
	.stock__cta-icon {
		width: 20px;
		height: 20px;
		flex: none;
	}

	@media (max-width: 768px) {
		.stock {
			padding: 48px 20px;
		}
		.stock__status {
			font-size: 56px;
		}
		.stock__title {
			font-size: 24px;
			line-height: 32px;
			letter-spacing: 0.24px;
		}
		.stock__body {
			font-size: 14px;
			line-height: 20px;
			letter-spacing: 0.28px;
		}
	}
</style>

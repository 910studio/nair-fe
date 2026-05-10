<script lang="ts">
	type Partner = { id: string; name: string; logo: string | null };

	let {
		title,
		partners
	}: {
		title: string;
		partners: Partner[];
	} = $props();

	const rows = $derived.by(() => {
		const n = partners.length;
		const a = Math.ceil(n / 3);
		const b = Math.ceil((2 * n) / 3);
		return [partners.slice(0, a), partners.slice(a, b), partners.slice(b)];
	});
</script>

<section class="belt" data-bg="dark">
	<p class="belt__title">{title}</p>
	<div class="belt__belt belt__belt--desktop" aria-label="collab marquee">
		<div class="belt__track">
			{#each partners as p (`a-${p.id}`)}
				<div class="belt__item">
					{#if p.logo}
						<img class="belt__logo-img" src={p.logo} alt={p.name} loading="lazy" />
					{:else}
						<span class="belt__symbol" aria-hidden="true"></span>
						<span class="belt__logo">{p.name}</span>
					{/if}
				</div>
			{/each}
			{#each partners as p (`b-${p.id}`)}
				<div class="belt__item" aria-hidden="true">
					{#if p.logo}
						<img class="belt__logo-img" src={p.logo} alt="" loading="lazy" />
					{:else}
						<span class="belt__symbol"></span>
						<span class="belt__logo">{p.name}</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div class="belt__rows" aria-hidden="true">
		{#each rows as row, rowIdx (rowIdx)}
			{#if row.length}
				<div class="belt__belt" data-dir={rowIdx % 2 === 0 ? 'l' : 'r'}>
					<div class="belt__track">
						{#each row as p (`m-${rowIdx}-a-${p.id}`)}
							<div class="belt__item">
								{#if p.logo}
									<img class="belt__logo-img" src={p.logo} alt={p.name} loading="lazy" />
								{:else}
									<span class="belt__symbol"></span>
									<span class="belt__logo">{p.name}</span>
								{/if}
							</div>
						{/each}
						{#each row as p (`m-${rowIdx}-b-${p.id}`)}
							<div class="belt__item">
								{#if p.logo}
									<img class="belt__logo-img" src={p.logo} alt="" loading="lazy" />
								{:else}
									<span class="belt__symbol"></span>
									<span class="belt__logo">{p.name}</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</section>

<style>
	.belt {
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
	.belt__title {
		margin: 0;
		text-align: center;
		color: rgba(255, 255, 255, 0.48);
		font-size: 20px;
		font-weight: 500;
		line-height: 28px;
		letter-spacing: 0.4px;
	}
	.belt__belt {
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
	.belt__track {
		display: flex;
		width: max-content;
		animation: belt-scroll 40s linear infinite;
	}
	.belt__belt:hover .belt__track {
		animation-play-state: paused;
	}
	.belt__belt[data-dir='r'] .belt__track {
		animation-direction: reverse;
	}
	@keyframes belt-scroll {
		to {
			transform: translateX(-50%);
		}
	}
	.belt__rows {
		display: none;
	}
	.belt__item {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-right: 48px;
		flex: none;
	}
	.belt__symbol {
		width: 40px;
		height: 40px;
		flex: none;
		border: 1px dashed rgba(255, 255, 255, 0.45);
		border-radius: 999px;
	}
	.belt__logo {
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
	.belt__logo-img {
		height: 48px;
		width: auto;
		display: block;
		opacity: 0.84;
	}

	@media (max-width: 768px) {
		.belt__belt--desktop {
			display: none;
		}
		.belt__rows {
			display: flex;
			flex-direction: column;
			gap: 40px;
			width: 100%;
		}
	}
</style>

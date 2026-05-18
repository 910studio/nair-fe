<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import type { Localized } from '$lib/types';

	type Item = { label: Localized; active: boolean; description?: Localized };

	type Props = {
		title: string;
		items: Item[];
	};

	let { title, items }: Props = $props();

	const t = (v: Localized) => v[getLocale()];
	const hasDesc = (item: Item) => Boolean(item.description && t(item.description).trim());

	let openIdx = $state<number | null>(null);

	function toggle(i: number) {
		openIdx = openIdx === i ? null : i;
	}
	function close() {
		openIdx = null;
	}
	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window onclick={close} onkeydown={handleKey} />

<section class="program">
	<h2 class="program__title">{title}</h2>
	<ul class="program__list">
		{#each items as item, i (i)}
			<li class="program__item" class:program__item--inactive={!item.active}>
				<span class="program__dot" aria-hidden="true"></span>
				<span class="program__label">{t(item.label)}</span>
				{#if hasDesc(item)}
					<button
						type="button"
						class="program__info"
						aria-label="Дэлгэрэнгүй"
						aria-expanded={openIdx === i}
						onclick={(e) => {
							e.stopPropagation();
							toggle(i);
						}}
					>
						<svg viewBox="0 0 16 16" aria-hidden="true">
							<circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.25" />
							<line x1="8" y1="7" x2="8" y2="11.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" />
							<circle cx="8" cy="4.75" r="0.85" fill="currentColor" />
						</svg>
					</button>
					{#if openIdx === i}
						<div
							class="program__tooltip"
							role="tooltip"
							>
							{t(item.description!)}
						</div>
					{/if}
				{/if}
			</li>
		{/each}
	</ul>
</section>

<style>
	.program {
		flex: 1 1 0;
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
	.program__title {
		margin: 0;
		color: #9e1c21;
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		letter-spacing: 0.4px;
	}
	.program__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.program__item {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.program__dot {
		flex: none;
		width: 20px;
		height: 20px;
		display: inline-block;
		position: relative;
	}
	.program__dot::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: rgba(6, 9, 12, 0.32);
		transform: translate(-50%, -50%);
	}
	.program__item--inactive .program__dot::before {
		background: transparent;
		box-shadow: inset 0 0 0 1.5px rgba(6, 9, 12, 0.24);
	}
	.program__label {
		flex: 1 1 0;
		color: #06090c;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
	.program__info {
		flex: none;
		display: inline-grid;
		place-items: center;
		width: 22px;
		height: 22px;
		padding: 0;
		margin: 0;
		background: transparent;
		border: 0;
		border-radius: 999px;
		color: rgba(6, 9, 12, 0.4);
		cursor: pointer;
		transition: color 0.15s ease, background-color 0.15s ease;
	}
	.program__info svg {
		width: 16px;
		height: 16px;
		display: block;
	}
	.program__info:hover,
	.program__info:focus-visible {
		color: rgba(6, 9, 12, 0.72);
		background: rgba(6, 9, 12, 0.04);
		outline: none;
	}
	.program__info[aria-expanded='true'] {
		color: rgba(6, 9, 12, 0.85);
		background: rgba(6, 9, 12, 0.06);
	}
	.program__tooltip {
		position: absolute;
		right: 0;
		bottom: calc(100% + 8px);
		z-index: 5;
		max-width: min(280px, calc(100% - 8px));
		padding: 10px 12px;
		background: #06090c;
		color: rgba(255, 255, 255, 0.92);
		border-radius: 8px;
		font-size: 13px;
		font-weight: 500;
		line-height: 18px;
		letter-spacing: 0.24px;
		box-shadow: 0 12px 28px rgba(6, 9, 12, 0.18);
		white-space: pre-wrap;
		pointer-events: auto;
	}
	.program__tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		right: 8px;
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 6px solid #06090c;
	}

	@media (max-width: 768px) {
		.program__tooltip {
			max-width: calc(100vw - 56px);
		}
	}
</style>

<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import type { Localized } from '$lib/types';

	type Item = { label: Localized; active: boolean };

	type Props = {
		title: string;
		items: Item[];
	};

	let { title, items }: Props = $props();

	const t = (v: Localized) => v[getLocale()];
</script>

<section class="program">
	<h2 class="program__title">{title}</h2>
	<ul class="program__list">
		{#each items as item, i (i)}
			<li class="program__item" class:program__item--inactive={!item.active}>
				<span class="program__dot" aria-hidden="true"></span>
				<span class="program__label">{t(item.label)}</span>
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
		background: rgba(158, 28, 33, 0.6);
		transform: translate(-50%, -50%);
	}
	.program__item--inactive .program__dot::before {
		background: transparent;
		box-shadow: inset 0 0 0 1.5px rgba(158, 28, 33, 0.45);
	}
	.program__label {
		flex: 1 1 0;
		color: #06090c;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		letter-spacing: 0.32px;
	}
</style>

<script>
	export let stretch = false;

	let style = Object.entries($$props)
		.map(([key, value]) => {
			if (
				value !== null &&
				key.indexOf('$$') !== 0 &&
				!['stretch'].includes(key)
			) {
				return `${key}:${value};`;
			}
		})
		.join('');

	$: style += stretch ? 'flex-grow:1;' : '';
</script>

<div class="skeleton-row" {style}>
	<slot />
</div>

<style lang="scss">
	.skeleton-row {
		display: flex;
		flex-direction: row;

		> :global(*:not(:last-child)) {
			margin-right: 8px;
		}
	}
</style>

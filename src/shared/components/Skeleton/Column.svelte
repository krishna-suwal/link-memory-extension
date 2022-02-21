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

<div class="skeleton-column" {style}>
	<slot />
</div>

<style lang="scss">
	.skeleton-column {
		display: flex;
		flex-direction: column;

		> :global(*:not(:last-child)) {
			margin-bottom: 8px;
		}
	}
</style>

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

<div class="skeleton-box" {style}>
	<slot />
</div>

<style>
	.skeleton-box {
		border-radius: 5px;
		background: #525252;
	}
</style>

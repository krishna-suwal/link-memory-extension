<script>
	export let id = '';
	export let label = '';
	export let url = '';
	export let thumbnail = '';
</script>

<div class="link-item" {id}>
	{#if thumbnail && typeof thumbnail === 'string'}
		<div class="thumbnail">
			<img src={thumbnail} />
		</div>
	{/if}
	<div class="detail">
		<div class="title-row" title={label.replace(/"/g, '&quot;')}>
			<a href={url}>{label}</a>
		</div>
		<div class="url-row" title={url.replace(/"/g, '&quot;')}>
			<a href={url}>{url}</a>
		</div>
	</div>
	<div class="actions">
		<slot name="actions" />
	</div>
</div>

<style type="text/scss">
	.link-item {
		display: flex;
		/* box-shadow: 0 0 3px 1px #2d0d4a; */
		padding: 6px 8px;
		margin: 5px;
		background: #f3f3f3;

		.thumbnail {
			height: 60px;
			max-width: 45px;
			margin-right: 5px;

			img {
				max-height: 100%;
				width: 100%;
			}
		}
		.detail {
			flex-grow: 1;
			overflow: hidden;
		}
		.title-row,
		.url-row {
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.title-row a {
			text-decoration: none;
			color: black;
			font-size: 15px;
		}
		.url-row a {
			color: gray;
			font-size: 12px;
		}
		.actions {
			display: flex;
			align-items: center;

			:global(.action) {
				margin-left: 8px;
				max-height: 24px;
				cursor: pointer;

				:global(svg) {
					height: 20px;
					fill: #636363;
				}
			}
		}
	}
</style>

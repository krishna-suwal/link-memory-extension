<script lang="ts">
	import { escAttr } from '../../utils/escAttr';

	export let id: string;
	export let title: string;
	export let url: string;
	export let description: string = '';
	export let featuredImageUrl: string = '';
	export let faviconUrl: string = '';
	export let hideActions: boolean = false;
</script>

<div class="link-item" {id}>
	<div class="detail">
		<div class="title-row" title={escAttr(title)}>
			<span class="text">
				{title}
			</span>
		</div>
		{#if description}
			<div class="description-row" title={escAttr(description)}>
				<span class="text">
					{description}
				</span>
			</div>
		{/if}
		<div class="url-row">
			{#if faviconUrl}
				<img class="favicon" src={faviconUrl} alt="" />
			{/if}
			<a href={url} title={escAttr(url)} on:click|preventDefault>{url}</a>
		</div>
	</div>
	{#if !hideActions}
		<div class="actions">
			<slot name="actions" />
		</div>
	{/if}
	{#if featuredImageUrl}
		<div
			class="featured-image"
			style={`background-image: url(${featuredImageUrl})`}
		/>
	{/if}
</div>

<style lang="scss">
	.link-item {
		display: flex;
		/* box-shadow: 0 0 3px 1px #2d0d4a; */
		margin: 8px;
		background: #f3f3f3;
		position: relative;

		&:hover .actions {
			opacity: 1;
		}

		.featured-image {
			width: 120px;
			min-width: 120px;
			max-width: 120px;
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}
		.detail {
			flex-grow: 1;
			overflow: hidden;
			padding: 12px;
		}
		.title-row {
			font-size: 14px;
			color: black;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-bottom: 8px;

			a {
				text-decoration: none;
				color: black;
				font-size: 15px;
			}
		}
		.url-row {
			display: flex;
			align-items: center;

			.favicon {
				width: 16px;
				height: 16px;
				min-width: 16px;
				margin-right: 6px;
			}
			a {
				color: #747474;
				font-size: 12px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
		.description-row {
			font-size: 12px;
			line-height: 16px;
			color: #525252;
			max-height: 32px;
			overflow: hidden;
			margin-bottom: 8px;
		}

		.actions {
			display: flex;
			align-items: center;
			opacity: 0;
			position: absolute;
			right: 8px;
			top: 8px;
			background: #d7d7d7;
			border-radius: 3px;
			transition: 0.3s;

			:global(.action) {
				cursor: pointer;
				padding: 4px;
				display: flex;
				align-items: center;
				justify-content: center;

				&:hover {
					background: #bfbfbf;
				}

				:global(svg) {
					height: 16px;
					fill: #464646;
				}
			}
		}
	}
</style>

<script>
	import { onMount } from 'svelte';
	import Box from '../../shared/components/Skeleton/Box.svelte';
	import Row from '../../shared/components/Skeleton/Row.svelte';

	import CopyLinkIcon from '../../icons/CopyLinkIcon.svelte';
	import OpenLinkIcon from '../../icons/OpenLinkIcon.svelte';
	import TrashIcon from '../../icons/TrashIcon.svelte';
	import LinkItem from '../../shared/components/LinkItem.svelte';
	import { isFetchingLinks, links, linksTrash } from '../../stores/links-store';
	import { lm } from '../../core/global-module';

	export let onChangeTab = () => {};

	onMount(() => {
		setTimeout(() => {
			lm.storage.get('limem_links', []).then((list) => {
				if (Array.isArray(list)) {
					links.set(list);
				}
				isFetchingLinks.set(false);
			});
			lm.storage.get('limem_links_trash', []).then((list) => {
				if (Array.isArray(list)) {
					linksTrash.set(list);
				}
			});
		}, 10);
	});
</script>

<div class="links-list">
	{#if $isFetchingLinks}
		<Row padding="2px 8px">
			<Box width="100%" height="50px" />
		</Row>
		<Row padding="2px 8px">
			<Box width="100%" height="50px" />
		</Row>
		<Row padding="2px 8px">
			<Box width="100%" height="50px" />
		</Row>
	{:else}
		{#each $links as { id, label, url, image_url } (id)}
			<LinkItem id={`saved-link-${id}`} {label} thumbnail={image_url} {url}>
				<svelte:fragment slot="actions">
					<div
						class="action"
						title="Open in new tab"
						on:click={() => lm.tabs.openNew(url)}
					>
						<OpenLinkIcon />
					</div>
					<div
						title="Copy"
						class="action copy-text tooltip"
						data-clipboard-text={url}
					>
						<CopyLinkIcon />
						<span class="tooltiptext">Copied!</span>
					</div>
					<div title="Delete" class="action" on:click={() => links.remove(id)}>
						<TrashIcon />
					</div>
				</svelte:fragment>
			</LinkItem>
		{:else}
			<div class="empty-storage-notice">
				<span>
					There are no saved tabs. Go to
					<a href="#" on:click|preventDefault={() => onChangeTab('open-tabs')}>
						Open Tabs
					</a>
					tab or click on the "Save Current Tab" button below to save tabs.
				</span>
			</div>
		{/each}
	{/if}
</div>

<style type="text/scss">
	.empty-storage-notice {
		margin: 8px;
		padding: 12px 16px;
		background: #f3f3f3;
		border-radius: 2px;
		font-size: 12px;
		text-align: center;
		color: #5a5a5a;

		a {
			color: #9575e9;
			text-decoration: none;
			font-weight: bold;

			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>

<script>
	import { onMount } from 'svelte';
	import Box from '../../../Electron/cname/client/shared/components/Skeleton/Box.svelte';
	import Row from '../../../Electron/cname/client/shared/components/Skeleton/Row.svelte';

	import CopyLinkIcon from './icons/CopyLinkIcon.svelte';
	import OpenLinkIcon from './icons/OpenLinkIcon.svelte';
	import PlusIcon from './icons/PlusIcon.svelte';
	import RestoreIcon from './icons/RestoreIcon.svelte';
	import TrashIcon from './icons/TrashIcon.svelte';
	import LinkItem from './shared/components/LinkItem.svelte';
	import { isFetchingLinks, links, linksTrash } from './stores/links-store';

	let openTabs = [];

	onMount(() => {
		lm.tabs.getAll().then((v) => (openTabs = v));
	});
	const onClearTrash = (e) => {
		if (e.detail !== 4) {
			return;
		}
		linksTrash.clear();
		alert('Cleared Trash!');
	};
	const onClickRestore = () => {
		if ($linksTrash.length === 0) {
			return alert('Nothing to restore!');
		}
		linksTrash.restore();
	};
	const onAddCurrentTab = () => lm.tabs.getActive().then(links.add);
</script>

<div class="header">
	<div class="title">
		<span>Link Memory</span>
	</div>
	<div class="actions">
		<button class="clear-trash" on:click={onClearTrash}>Clear Trash</button>
		<span class="restore" on:click={onClickRestore}>
			<RestoreIcon height="14px" fill="white" />
		</span>
	</div>
</div>
<div class="lists-wrapper">
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
				<LinkItem {label} thumbnail={image_url} {url}>
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
							class="action"
							data-clipboard-text={url}
							aria-label="Copied!"
						>
							<CopyLinkIcon />
						</div>
						<div
							title="Delete"
							class="action"
							on:click={() => links.remove(id)}
						>
							<TrashIcon />
						</div>
					</svelte:fragment>
				</LinkItem>
			{/each}
		{/if}
	</div>

	<div class="open-tabs-list">
		<div class="list-header">
			<span>Open Tabs</span>
		</div>
		<div class="list">
			{#each openTabs as { id, label, url, image_url } (id)}
				<LinkItem {label} thumbnail={image_url} {url}>
					<svelte:fragment slot="actions">
						<div
							class="action"
							title="Add"
							on:click={() => links.add({ label, url, image_url })}
						>
							<PlusIcon />
						</div>
					</svelte:fragment>
				</LinkItem>
			{/each}
		</div>
	</div>
</div>

<div class="add-current-tab-btn-container">
	<button class="add-current-tab" on:click={onAddCurrentTab}
		>Add Current Tab</button
	>
</div>

<style type="text/scss">
	.header {
		background-color: blueviolet;
		padding: 6px 10px;
		color: white;
		font-weight: bold;
		font-size: 17px;
		display: flex;

		.title {
			text-align: center;
			flex-grow: 1;
		}
		.actions {
			display: flex;
			align-items: center;

			.clear-trash {
				border: none;
				background: none;
				color: #ffd0d0;
				margin-right: 10px;
				font-size: 12px;
				font-family: arial;
				cursor: pointer;
				padding: 2px 8px;
				transition: 0.2s;
				border-radius: 4px;

				&:hover {
					background: #ce1b1b;
				}
			}
			.restore {
				display: flex;
				align-items: center;
				cursor: pointer;
			}
		}
	}

	.lists-wrapper {
		max-height: 400px;
		overflow-y: auto;

		.list-header {
			padding: 0px 12px;
			margin-top: 10px;
			font-weight: bold;
		}
	}

	.add-current-tab {
		width: 100%;
		background: #c5c5c5cc;
		border: none;
		padding: 8px;
		cursor: pointer;
	}
</style>

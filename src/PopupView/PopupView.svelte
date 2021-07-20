<script>
	import { onMount } from 'svelte';
	import Box from '../shared/components/Skeleton/Box.svelte';
	import Row from '../shared/components/Skeleton/Row.svelte';

	import CopyLinkIcon from '../icons/CopyLinkIcon.svelte';
	import OpenLinkIcon from '../icons/OpenLinkIcon.svelte';
	import PlusIcon from '../icons/PlusIcon.svelte';
	import TrashIcon from '../icons/TrashIcon.svelte';
	import LinkItem from '../shared/components/LinkItem.svelte';
	import { isFetchingLinks, links } from '../stores/links-store';
	import Header from './components/Header.svelte';

	let openTabs = [];

	onMount(() => {
		lm.tabs.getAll().then((v) => (openTabs = v));
	});
	const onAddCurrentTab = () => {
		lm.tabs.getActive().then((tab) => {
			const { id } = links.add(tab);

			setTimeout(() => {
				lm.element.scrollIntoView(`#saved-link-${id}`);
			}, 200);
		});
	};
</script>

<Header />
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
				<LinkItem id={`open-tab-${id}`} {label} thumbnail={image_url} {url}>
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

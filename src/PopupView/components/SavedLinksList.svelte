<script lang="ts">
	import Box from '../../shared/components/Skeleton/Box.svelte';
	import Row from '../../shared/components/Skeleton/Row.svelte';
	import CopyLinkIcon from '../../icons/CopyLinkIcon.svelte';
	import OpenLinkIcon from '../../icons/OpenLinkIcon.svelte';
	import TrashIcon from '../../icons/TrashIcon.svelte';
	import LinkItem from '../../shared/components/LinkItem.svelte';
	import { isFetchingLinks, links } from '../../stores/links-store';
	import { tabsMod } from '../../modules/tabsMod';
	import { appStorage } from '../../modules/storageMod';
	import InfoNotice from '../../shared/components/InfoNotice.svelte';

	export let onChangeTab = (tab: string) => {};

	$: syncedItems = $links.filter((item) => item.storeLocation !== 'local');
	$: localItems = $links.filter((item) => item.storeLocation === 'local');
</script>

<div class="links-list">
	{#if $isFetchingLinks}
		<Row margin="8px">
			<Box width="100%" height="60px" border-radius="0" />
		</Row>
		<Row margin="8px">
			<Box width="100%" height="60px" border-radius="0" />
		</Row>
		<Row margin="8px">
			<Box width="100%" height="60px" border-radius="0" />
		</Row>
	{:else if $links.length === 0}
		<div class="empty-storage-notice">
			<p>
				You don't have any saved tabs. Click on the "Save Current Tab" button
				below to save currently active tab. Or, go to
				<span
					class="button-link"
					on:click|preventDefault={() => onChangeTab('open-tabs')}
				>
					Open Tabs
				</span>
				to save other open tabs.
			</p>
		</div>
	{:else}
		{#each syncedItems as link (link.id)}
			<LinkItem
				id={`saved-link-${link.id}`}
				title={link.label}
				url={link.url}
				description={link.description}
				featuredImageUrl={link.image_url}
				faviconUrl={link.faviconUrl}
			>
				<svelte:fragment slot="actions">
					<div
						class="action"
						title="Open in new tab"
						on:click={() => tabsMod.openNew(link.url)}
					>
						<OpenLinkIcon />
					</div>
					<div
						title="Copy"
						class="action copy-text tooltip"
						data-clipboard-text={link.url}
					>
						<CopyLinkIcon />
						<span class="tooltiptext">Copied Link</span>
					</div>
					<div
						title="Trash"
						class="action"
						on:click={() => appStorage.removeItem(link.id)}
					>
						<TrashIcon />
					</div>
				</svelte:fragment>
			</LinkItem>
		{/each}
		{#if localItems.length > 0}
			<div class="local-storage-notice-section">
				<div class="list-section-title">
					<div class="h-ruler" />
					<div class="content">
						<span class="text">Local Storage</span>
					</div>
					<div class="h-ruler" />
				</div>
				<div class="notice-container">
					<InfoNotice>
						Following items are being saved in your <strong>
							local storage
						</strong>
						because of insufficient space in <strong>sync storage</strong>.
						Items stored in local storage will not be synced with your signed in
						account.
					</InfoNotice>
				</div>
			</div>
			{#each localItems as link (link.id)}
				<LinkItem
					id={`saved-link-${link.id}`}
					title={link.label}
					url={link.url}
					description={link.description}
					featuredImageUrl={link.image_url}
					faviconUrl={link.faviconUrl}
				>
					<svelte:fragment slot="actions">
						<div
							class="action"
							title="Open in new tab"
							on:click={() => tabsMod.openNew(link.url)}
						>
							<OpenLinkIcon />
						</div>
						<div
							title="Copy"
							class="action copy-text tooltip"
							data-clipboard-text={link.url}
						>
							<CopyLinkIcon />
							<span class="tooltiptext">Copied Link</span>
						</div>
						<div
							title="Trash"
							class="action"
							on:click={() => appStorage.removeItem(link.id)}
						>
							<TrashIcon />
						</div>
					</svelte:fragment>
				</LinkItem>
			{/each}
		{/if}
	{/if}
</div>

<style lang="scss">
	.empty-storage-notice {
		margin: 8px;
		padding: 12px 16px;
		background: #f3f3f3;
		border-radius: 2px;
		font-size: 12px;
		text-align: center;
		color: #5a5a5a;

		.button-link {
			color: #9575e9;
			text-decoration: none;
			font-weight: bold;
			cursor: pointer;

			&:hover {
				text-decoration: underline;
			}
		}
	}
	.local-storage-notice-section {
		margin: 24px 0;

		& > :global(*):not(:last-child) {
			margin-bottom: 12px;
		}
	}
	.list-section-title {
		display: flex;
		align-items: center;
		padding: 0 8px;
		font-size: 12px;
		color: #000000;

		.h-ruler {
			flex: 1;
			height: 1px;
			background-color: #d7d7d7;
		}
		.content {
			display: flex;
			align-items: center;
			margin: 0 8px;

			& > :global(*):not(:last-child) {
				margin-right: 8px;
			}
		}
	}
	.notice-container {
		margin: 0 8px;
	}
</style>

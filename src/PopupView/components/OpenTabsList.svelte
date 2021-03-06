<script lang="ts">
	import { onMount } from 'svelte';
	import Box from '../../shared/components/Skeleton/Box.svelte';
	import Row from '../../shared/components/Skeleton/Row.svelte';

	import PlusIcon from '../../icons/PlusIcon.svelte';
	import LinkItem from '../../shared/components/LinkItem.svelte';
	import { isFetchingLinks } from '../../stores/links-store';
	import { initClipboardJS } from '../../helpers/initClipboardJS';
	import CheckMarkIcon from '../../icons/CheckMarkIcon.svelte';
	import FlagRender from '../../shared/components/FlagRender.svelte';
	import { tabsMod } from '../../modules/tabsMod';
	import type { TabInfo } from '../../types';
	import { appStorage } from '../../modules/storageMod';

	let isFetchingTabs = true;
	let openTabs: TabInfo[] = [];

	onMount(() => {
		tabsMod.getAll().then((tabs) => {
			openTabs = tabs;
			isFetchingTabs = false;
		});
	});
	const onAddTab = (tab: TabInfo): Promise<boolean> => {
		return new Promise((resolve) => {
			appStorage
				.addNewItem({
					label: tab.title,
					description: tab.description,
					url: tab.url,
					image_url: tab.featuredImageUrl,
					faviconUrl: tab.faviconUrl,
				})
				.then(() => {
					initClipboardJS();
					resolve(true);
				})
				.catch((reason) => {
					resolve(false);
					alert(reason);
				});
		});
	};
</script>

<div class="open-tabs-list">
	<div class="list">
		{#if isFetchingTabs}
			<Row margin="8px">
				<Box width="100%" height="60px" border-radius="0" />
			</Row>
			<Row margin="8px">
				<Box width="100%" height="60px" border-radius="0" />
			</Row>
			<Row margin="8px">
				<Box width="100%" height="60px" border-radius="0" />
			</Row>
		{:else}
			{#each openTabs as tab (tab.tabId)}
				<LinkItem
					id={`open-tab-${tab.tabId}`}
					title={tab.title}
					url={tab.url}
					description={tab.description}
					featuredImageUrl={tab.featuredImageUrl}
					faviconUrl={tab.faviconUrl}
				>
					<svelte:fragment slot="actions">
						{#if !$isFetchingLinks}
							<FlagRender let:flag={isAdded} let:setFlag defaultValue={false}>
								{#if isAdded}
									<div class="action">
										<CheckMarkIcon />
									</div>
								{:else}
									<div
										class="action"
										title="Save"
										on:click={() => {
											onAddTab(tab).then((isSuccess) => {
												if (isSuccess) {
													setFlag(true);
													setTimeout(() => {
														setFlag(false);
													}, 2000);
												}
											});
										}}
									>
										<PlusIcon />
									</div>
								{/if}
							</FlagRender>
						{/if}
					</svelte:fragment>
				</LinkItem>
			{/each}
		{/if}
	</div>
</div>

<script lang="ts">
	import { initClipboardJS } from '../../helpers/initClipboardJS';
	import { scrollIntoView } from '../../utils/scrollIntoView';
	import CheckMarkIcon from '../../icons/CheckMarkIcon.svelte';
	import FlagRender from '../../shared/components/FlagRender.svelte';
	import { tabsMod } from '../../modules/tabsMod';
	import { appStorage } from '../../modules/storageMod';
	import { waitForElement } from '../../utils/waitForElement';

	const onAddCurrentTab = (): Promise<boolean> => {
		return new Promise((resolve) => {
			tabsMod.getActiveTabInfo().then((tab) => {
				appStorage
					.addNewItem({
						label: tab.title,
						description: tab.description,
						url: tab.url,
						image_url: tab.featuredImageUrl,
						faviconUrl: tab.faviconUrl,
					})
					.then((data) => {
						waitForElement(`#saved-link-${data.id}`)
							.then((element) => {
								scrollIntoView(element);
								initClipboardJS();
							})
							.catch(console.log);
						resolve(true);
					})
					.catch((reason) => {
						resolve(false);
						alert(reason);
					});
			});
		});
	};
</script>

<div class="add-current-tab-btn-container">
	<FlagRender let:flag={isAdded} let:setFlag defaultValue={false}>
		{#if isAdded}
			<button class="add-current-tab">
				<CheckMarkIcon height="12px" /> Saved Current Tab
			</button>
		{:else}
			<button
				class="add-current-tab"
				on:click={() => {
					onAddCurrentTab().then((isSuccess) => {
						if (isSuccess) {
							setFlag(true);
							setTimeout(() => {
								setFlag(false);
							}, 2000);
						}
					});
				}}>Save Current Tab</button
			>
		{/if}
	</FlagRender>
</div>

<style lang="scss">
	.add-current-tab {
		width: 100%;
		background: #d6d6d6;
		border: none;
		padding: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;

		:global(svg) {
			margin-right: 4px;
		}
	}
</style>

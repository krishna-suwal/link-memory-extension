<script>
	import { initClipboardJS } from '../../helpers/initClipboardJS';
	import { scrollIntoView } from '../../utils/scrollIntoView';
	import CheckMarkIcon from '../../icons/CheckMarkIcon.svelte';
	import FlagRender from '../../shared/components/FlagRender.svelte';
	import { tabsMod } from '../../modules/tabsMod';
	import { appStorage } from '../../modules/storageMod';

	const onAddCurrentTab = () => {
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
					setTimeout(() => {
						scrollIntoView(`#saved-link-${data.id}`);
						initClipboardJS();
					}, 200);
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
					onAddCurrentTab();
					setFlag(true);
					setTimeout(() => {
						setFlag(false);
					}, 2000);
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

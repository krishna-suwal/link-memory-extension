<script>
	import { onMount } from 'svelte';
	import Box from '../../shared/components/Skeleton/Box.svelte';
	import Row from '../../shared/components/Skeleton/Row.svelte';

	import PlusIcon from '../../icons/PlusIcon.svelte';
	import LinkItem from '../../shared/components/LinkItem.svelte';
	import { links, isFetchingLinks } from '../../stores/links-store';
	import { lm } from '../../core/global-module';
	import { init_clipboard_js } from '../../helpers/init_clipboard_js';
	import { scrollIntoView } from '../../utils/scrollIntoView';
	import CheckMarkIcon from '../../icons/CheckMarkIcon.svelte';
	import FlagRender from '../../shared/components/FlagRender.svelte';

	let isFetchingTabs = true;
	let openTabs = [];

	onMount(() => {
		setTimeout(() => {
			lm.tabs.getAll().then((v) => {
				openTabs = v;
				isFetchingTabs = false;
			});
		}, 0);
	});
	const getAddOpenTabHandler = (tab) => () => {
		const { id } = links.add(tab);

		setTimeout(() => {
			scrollIntoView(`#saved-link-${id}`);
			init_clipboard_js();
		}, 200);
	};
</script>

<div class="open-tabs-list">
	<div class="list">
		{#if isFetchingTabs}
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
			{#each openTabs as { id, label, url, image_url } (id)}
				<LinkItem id={`open-tab-${id}`} {label} thumbnail={image_url} {url}>
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
										title="Add"
										on:click={() => {
											getAddOpenTabHandler({ id, label, url, image_url })();
											setFlag(true);
											setTimeout(() => {
												setFlag(false);
											}, 2000);
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

<style type="text/scss">
</style>

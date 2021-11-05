<script>
	import { onMount } from 'svelte';
	import Box from '../../shared/components/Skeleton/Box.svelte';
	import Row from '../../shared/components/Skeleton/Row.svelte';

	import PlusIcon from '../../icons/PlusIcon.svelte';
	import LinkItem from '../../shared/components/LinkItem.svelte';
	import { links } from '../../stores/links-store';
	import { lm } from '../../core/global-module';
	import { init_clipboard_js } from '../../helpers/init_clipboard_js';
	import { scrollIntoView } from '../../utils/scrollIntoView';

	let isFetchingTabs = true;
	let openTabs = [];

	onMount(() => {
		lm.tabs.getAll().then((v) => {
			openTabs = v;
			isFetchingTabs = false;
		});
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
						<div
							class="action"
							title="Add"
							on:click={getAddOpenTabHandler({ id, label, url, image_url })}
						>
							<PlusIcon />
						</div>
					</svelte:fragment>
				</LinkItem>
			{/each}
		{/if}
	</div>
</div>

<style type="text/scss">
</style>

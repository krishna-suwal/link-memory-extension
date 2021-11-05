<script>
	import { links } from '../../stores/links-store';
	import { lm } from '../../core/global-module';
	import { init_clipboard_js } from '../../helpers/init_clipboard_js';
	import { scrollIntoView } from '../../utils/scrollIntoView';
	import CheckMarkIcon from '../../icons/CheckMarkIcon.svelte';
	import FlagRender from '../../shared/components/FlagRender.svelte';

	const onAddCurrentTab = () => {
		lm.tabs.getActive().then((tab) => {
			const { id } = links.add(tab);

			setTimeout(() => {
				scrollIntoView(`#saved-link-${id}`);
				init_clipboard_js();
			}, 200);
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

<style type="text/scss">
	.add-current-tab {
		width: 100%;
		background: #c5c5c5cc;
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

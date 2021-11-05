<script>
	import { links } from '../../stores/links-store';
	import { lm } from '../../core/global-module';
	import { init_clipboard_js } from '../../helpers/init_clipboard_js';
	import { scrollIntoView } from '../../utils/scrollIntoView';

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
	<button class="add-current-tab" on:click={onAddCurrentTab}
		>Save Current Tab</button
	>
</div>

<style type="text/scss">
	.add-current-tab {
		width: 100%;
		background: #c5c5c5cc;
		border: none;
		padding: 8px;
		cursor: pointer;
	}
</style>

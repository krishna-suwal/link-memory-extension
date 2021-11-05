<script>
	import { onMount } from 'svelte';

	import Header from './components/Header.svelte';
	import { init_clipboard_js } from '../helpers/init_clipboard_js';
	import SavedLinksList from './components/SavedLinksList.svelte';
	import OpenTabsList from './components/OpenTabsList.svelte';
	import SaveCurrentTabSection from './components/SaveCurrentTabSection.svelte';

	let activeTab = 'saved';

	onMount(() => {
		init_clipboard_js();
	});
</script>

<Header />
<div class="tabs">
	<div
		class="tab"
		class:active={activeTab === 'saved'}
		on:click={() => (activeTab = 'saved')}
	>
		<span>Saved</span>
		<span class="number-badge">15</span>
	</div>
	<div
		class="tab"
		class:active={activeTab === 'open-tabs'}
		on:click={() => (activeTab = 'open-tabs')}
	>
		<span>Open Tabs</span>
	</div>
	<div
		class="tab"
		class:active={activeTab === 'more'}
		on:click={() => (activeTab = 'more')}
	>
		<span>More</span>
	</div>
</div>
<div class="lists-wrapper">
	{#if activeTab === 'saved'}
		<SavedLinksList onChangeTab={(tab) => (activeTab = tab)} />
	{:else if activeTab === 'open-tabs'}
		<OpenTabsList />
	{:else if activeTab === 'more'}{/if}
</div>
<SaveCurrentTabSection />

<style type="text/scss">
	.tabs {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 12px;
		padding: 0 8px;
		color: #767676;
		box-shadow: 0 3px 9px -6px black;

		.tab {
			height: 30px;
			display: flex;
			align-items: center;
			cursor: pointer;
			padding: 0 8px;
			border-bottom: 2px solid transparent;

			&.active {
				color: #393939;
				border-bottom: 2px solid #9070e2;
			}
			&:hover {
				color: #393939;
			}
			.number-badge {
				color: #9070e2;
				background: #f3f3f3;
				border-radius: 100%;
				padding: 2px 5px;
				margin-left: 4px;
			}
		}
	}
	.lists-wrapper {
		max-height: 400px;
		overflow-y: auto;
		padding-top: 5px;
	}
</style>

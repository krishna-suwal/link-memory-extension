<script lang="ts">
	import { onMount } from 'svelte';

	import Header from './components/Header.svelte';
	import { initClipboardJS } from '../helpers/initClipboardJS';
	import SavedLinksList from './components/SavedLinksList.svelte';
	import OpenTabsList from './components/OpenTabsList.svelte';
	import SaveCurrentTabSection from './components/SaveCurrentTabSection.svelte';
	import { isFetchingLinks, links } from '../stores/links-store';
	import MoreTab from './components/MoreTab.svelte';
	import Tools from './components/Tools.svelte';
	import { isOptionsPage } from '../helpers/isOptionsPage';
	import { getTargetTab } from '../helpers/urlParams';

	let activeTab = getTargetTab() ? getTargetTab() : 'saved';
	let tabsBoxShadow = '0 3px 1px -2px #cbcbcb69';

	onMount(initClipboardJS);
</script>

<Header />
<div class="tabs-container">
	<div class="tabs" style={`box-shadow: ${tabsBoxShadow};`}>
		<div
			class="tab"
			class:active={activeTab === 'saved'}
			on:click={() => (activeTab = 'saved')}
		>
			<span>Saved</span>
			<span class="number-badge">
				{#if $isFetchingLinks}
					...
				{:else}
					{$links.length}
				{/if}
			</span>
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
			class:active={activeTab === 'tools'}
			on:click={() => (activeTab = 'tools')}
		>
			<span>Tools</span>
		</div>
		<div
			class="tab"
			class:active={activeTab === 'more'}
			on:click={() => (activeTab = 'more')}
		>
			<span>More</span>
		</div>
	</div>
</div>
<div class="tabs-placeholder" />
<div
	class="lists-wrapper"
	on:scroll={(e) => {
		if (e.target.scrollTop > 10) {
			tabsBoxShadow = '0 3px 9px -6px black';
		} else {
			tabsBoxShadow = '0 3px 1px -2px #cbcbcb69';
		}
	}}
>
	{#if activeTab === 'saved'}
		<SavedLinksList onChangeTab={(tab) => (activeTab = tab)} />
	{:else if activeTab === 'open-tabs'}
		<OpenTabsList />
	{:else if activeTab === 'tools'}
		<Tools />
	{:else if activeTab === 'more'}
		<MoreTab />
	{/if}
</div>
{#if !$isFetchingLinks && !isOptionsPage()}
	<SaveCurrentTabSection />
{/if}

<style lang="scss">
	.tabs-container {
		position: sticky;
		position: sticky;
		top: 0;
		z-index: 99;
	}
	.tabs-placeholder {
		height: 30px;
	}
	.tabs {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 12px;
		padding: 0 8px;
		color: #767676;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		background-color: white;
		box-shadow: 0 3px 9px -6px black;
		transition: 0.2s;
		z-index: 99;

		.tab {
			height: 30px;
			display: flex;
			align-items: center;
			cursor: pointer;
			padding: 0 8px;
			border-bottom: 2px solid transparent;
			user-select: none;

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
		// padding-top: 5px;
	}
</style>

<script lang="ts">
	import ExportToolScreen from './ToolsScreens/ExportToolScreen.svelte';

	let screen = 'main';
</script>

{#if screen === 'export-screen'}
	<ExportToolScreen onGoBack={() => (screen = 'main')} />
{:else}
	<div class="sections">
		<div class="section import">
			<div class="tool-header">
				<button class="">Import</button>
				<span class="text">
					Import links from a file. Currently you can import from JSON files
					only.
					<br />
					<br />
					<strong>Note</strong>: Keep in mind that the file you're trying to
					import must have been exported by this extension.
				</span>
			</div>
		</div>
		<div class="section export">
			<div class="tool-header">
				<button on:click={() => (screen = 'export-screen')}>Export</button>
				<span class="text">
					Export your saved links or currently open tabs to a file. Supported
					file formats are JSON and HTML.
				</span>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.sections {
		.section {
			margin: 8px;
			background: #f3f3f3;
			padding: 12px;
		}
	}
	.import,
	.export {
		.tool-header {
			display: flex;
			align-items: flex-start;

			& > :global(*):not(:last-child) {
				margin-right: 12px;
			}
			.text {
				color: #525252;
			}
		}
	}
</style>

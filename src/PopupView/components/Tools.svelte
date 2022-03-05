<script lang="ts">
	import { importContentsFromJson } from '../../helpers/importContents';
	import { isOptionsPage } from '../../helpers/isOptionsPage';
	import { openOptionsPage } from '../../helpers/openOptionsPage';
	import { appStorage } from '../../modules/storageMod';
	import ExportToolScreen from './ToolsScreens/ExportToolScreen.svelte';
	import { clickElement } from '../../utils/clickElement';
	import InfoNotice from '../../shared/components/InfoNotice.svelte';
	import { getTargetAction } from '../../helpers/urlParams';

	let screen = 'main';

	const onClickImport = () => {
		if (!isOptionsPage()) {
			openOptionsPage({
				targetTab: 'tools',
				targetAction: 'import',
			});
			return;
		}
		clickElement(document.getElementById('import-file-input'));
	};

	const onChangeImportFile = (e: any) => {
		const files = e.target?.files;

		if (!files || !files?.length) {
			return;
		}
		const reader = new FileReader();

		reader.readAsText(files[0]);
		reader.onload = function (e) {
			const result = e.target?.result;

			if (typeof result === 'string') {
				importContentsFromJson(result)
					.then((items) => {
						appStorage
							.addBatch(items)
							.then(() => {
								alert(`Successfully imported ${items.length} items`);
							})
							.catch(alert);
					})
					.catch(alert);
			} else {
				alert('Could not read the file!');
			}
		};
	};
</script>

{#if screen === 'export-screen'}
	<ExportToolScreen onGoBack={() => (screen = 'main')} />
{:else}
	{#if getTargetAction() === 'import' && isOptionsPage()}
		<div class="notice-container">
			<InfoNotice>
				Please click on the "Import" button below. As a file selector dialog
				cannot be used in a popup, you must use import function from this page.
			</InfoNotice>
		</div>
	{/if}
	<div class="sections">
		<div class="section import">
			<div class="tool-header">
				<button id="trigger-import" on:click={onClickImport}>Import</button>
				<input
					type="file"
					id="import-file-input"
					accept=".json"
					on:change={onChangeImportFile}
				/>
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
	.notice-container {
		margin: 8px;
	}
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
	#import-file-input {
		display: none;
	}
</style>

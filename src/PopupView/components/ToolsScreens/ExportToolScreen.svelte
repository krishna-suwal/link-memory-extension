<script lang="ts">
	import { exportContents } from '../../../helpers/exportContents';

	export let onGoBack: () => void;

	let includeSavedLinks = true;
	let includeOpenTabs = true;
	let format: 'json' | 'html' = 'json';

	const onClickExport = () => {
		exportContents({ includeSavedLinks, includeOpenTabs, format })
			.then(onGoBack)
			.catch(alert);
	};
</script>

<div class="content">
	<div class="title">
		<span class="text">Export Tool</span>
	</div>
	<div class="sections">
		<div class="section choose-contents">
			<div class="section-description">
				<span class="text">Select your contents to export</span>
			</div>
			<div class="input-rows">
				<div class="single-checkbox">
					<input
						type="checkbox"
						id="include-saved-links"
						bind:checked={includeSavedLinks}
					/>
					<label for="include-saved-links">Include saved links</label>
				</div>
				<div class="single-checkbox">
					<input
						type="checkbox"
						id="include-open-tabs"
						bind:checked={includeOpenTabs}
					/>
					<label for="include-open-tabs">Include open tabs</label>
				</div>
			</div>
		</div>
		<div class="section choose-format">
			<div class="section-description">
				<span class="text">Select file format</span>
			</div>
			<div class="input-rows">
				<div class="single-checkbox">
					<input
						type="radio"
						id="json-file-format"
						name="file-format"
						bind:group={format}
						value="json"
					/>
					<label for="json-file-format">JSON</label>
				</div>
				<div class="single-checkbox">
					<input
						type="radio"
						id="html-file-format"
						name="file-format"
						bind:group={format}
						value="html"
					/>
					<label for="html-file-format">HTML</label>
				</div>
			</div>
		</div>
	</div>
	<div class="actions">
		<button on:click={onGoBack}>Cancel</button>
		<button
			class="primary-btn"
			on:click={onClickExport}
			disabled={!includeSavedLinks && !includeOpenTabs}>Export</button
		>
	</div>
</div>

<style lang="scss">
	.content {
		margin: 8px;
		background: #f3f3f3;
		padding: 12px;

		& > :global(*):not(:last-child) {
			margin-bottom: 16px;
		}
		.title {
			font-size: 16px;
		}
		.sections {
			& > :global(*):not(:last-child) {
				margin-bottom: 20px;
			}

			.section {
				& > :global(*):not(:last-child) {
					margin-bottom: 8px;
				}

				.input-rows {
					& > :global(*):not(:last-child) {
						margin-bottom: 4px;
					}
				}
			}
		}
		.actions {
			text-align: right;

			& > :global(*):not(:last-child) {
				margin-right: 8px;
			}
		}
	}
	.single-checkbox {
		display: flex;

		& > :global(*):not(:last-child) {
			margin-right: 8px;
		}
	}
</style>

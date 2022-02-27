<script lang="ts">
	import RestoreIcon from '../../icons/RestoreIcon.svelte';
	import { appStorage } from '../../modules/storageMod';
	import { scrollIntoView } from '../../utils/scrollIntoView';
	import { waitForElement } from '../../utils/waitForElement';

	const onClearTrash = () => {
		const isConfirm = confirm('Are you sure? You cannot restore this action.');

		if (!isConfirm) {
			return;
		}
		appStorage.clearTrash();
		alert('Cleared Trash!');
	};
	const onClickRestore = async () => {
		appStorage
			.restoreItem()
			.then(({ id }) => {
				waitForElement(`#saved-link-${id}`).then(scrollIntoView);
			})
			.catch(alert);
	};
</script>

<div class="header">
	<div class="title">
		<span>Link Memory</span>
	</div>
	<div class="actions">
		<button class="clear-trash" on:click={onClearTrash}>Clear Trash</button>
		<span
			class="restore"
			on:click={onClickRestore}
			title="Restore a trashed item"
		>
			<RestoreIcon height="14px" fill="white" />
		</span>
	</div>
</div>

<style lang="scss">
	.header {
		background-color: blueviolet;
		padding: 6px 10px;
		color: white;
		font-weight: bold;
		font-size: 17px;
		display: flex;

		.title {
			text-align: center;
			flex-grow: 1;
		}
		.actions {
			display: flex;
			align-items: center;

			.clear-trash {
				border: none;
				background: none;
				color: #ffd0d0;
				margin-right: 10px;
				font-size: 12px;
				font-family: arial;
				cursor: pointer;
				padding: 4px 6px;
				transition: 0.2s;
				border-radius: 0px;

				&:hover {
					background: #ce1b1b;
				}
			}
			.restore {
				display: flex;
				align-items: center;
				cursor: pointer;
			}
		}
	}
</style>

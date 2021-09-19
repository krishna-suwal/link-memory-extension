<script>
	import { onMount } from 'svelte';

	import RestoreIcon from '../../icons/RestoreIcon.svelte';
	import { linksTrash } from '../../stores/links-store';

	let openTabs = [];
	const githubIconUrl =
		'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/600px-Octicons-mark-github.svg.png';

	onMount(() => {
		lm.tabs.getAll().then((v) => (openTabs = v));
	});
	const onClearTrash = (e) => {
		const isConfirm = confirm('Are you sure? You cannot restore this action.');

		if (!isConfirm) {
			return;
		}
		linksTrash.clear();
		alert('Cleared Trash!');
	};
	const onClickRestore = async () => {
		if ($linksTrash.length === 0) {
			return alert('Nothing to restore!');
		}
		const { id } = await linksTrash.restore();

		setTimeout(() => {
			lm.element.scrollIntoView(`#saved-link-${id}`);
		}, 200);
	};
</script>

<div class="header">
	<div class="title">
		<span>Link Memory</span>
	</div>
	<div class="actions">
		<a
			class="github-link"
			href="https://github.com/krishna-suwal/link-memory-extension"
			target="_blank"
		>
			<img src={githubIconUrl} alt="GitHub Icon" />
			<span>GitHub</span>
		</a>

		<button class="clear-trash" on:click={onClearTrash}>Clear Trash</button>
		<span class="restore" on:click={onClickRestore}>
			<RestoreIcon height="14px" fill="white" />
		</span>
	</div>
</div>

<style type="text/scss">
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

			.github-link {
				display: flex;
				align-items: center;
				color: #d6d6d6;
				font-size: 12px;
				text-decoration: none;
				margin-right: 4px;

				img {
					margin-right: 4px;
					width: 16px;
					height: 16px;
				}
			}

			.clear-trash {
				border: none;
				background: none;
				color: #ffd0d0;
				margin-right: 10px;
				font-size: 12px;
				font-family: arial;
				cursor: pointer;
				padding: 2px 8px;
				transition: 0.2s;
				border-radius: 4px;

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

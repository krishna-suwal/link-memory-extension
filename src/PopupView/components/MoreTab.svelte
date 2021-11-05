<script>
	import BugIcon from '../../icons/BugIcon.svelte';

	const githubIconUrl =
		'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/600px-Octicons-mark-github.svg.png';
</script>

<div class="more-tab">
	<div class="row">
		<a
			class="github-link"
			href="https://github.com/krishna-suwal/link-memory-extension"
			target="_blank"
		>
			<img src={githubIconUrl} alt="GitHub Icon" />
			<span>GitHub Repository</span>
		</a>
	</div>
	<div class="row">
		<a
			class="report-bug-link"
			href="https://github.com/krishna-suwal/link-memory-extension/issues/new"
			target="_blank"
		>
			<span class="icon"><BugIcon /></span>
			<span>Report a bug</span>
		</a>
	</div>
</div>

<style type="text/scss">
	.more-tab {
		padding: 4px 0;
		margin: 8px;
		background: #f3f3f3;
	}
	.row {
		font-size: 14px;
		padding: 0px 8px;
		margin: 8px;

		.github-link,
		.report-bug-link {
			display: inline-flex;
			align-items: center;
			text-decoration: none;

			.icon {
				display: inline-flex;
				align-items: center;
				justify-content: center;
			}
			img,
			.icon {
				margin-right: 8px;
				width: 24px;
				height: 24px;
			}
			span {
				color: black;
				text-decoration: none;
				font-weight: bold;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}
</style>

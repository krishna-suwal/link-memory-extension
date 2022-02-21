<script>
	import CopyLinkIcon from '../../icons/CopyLinkIcon.svelte';
	import OpenLinkIcon from '../../icons/OpenLinkIcon.svelte';
	import { tabsMod } from '../../modules/tabsMod';
	import LinkItem from '../../shared/components/LinkItem.svelte';

	const githubIconUrl =
		'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/600px-Octicons-mark-github.svg.png';
	const githubUrl = 'https://github.com/krishna-suwal/link-memory-extension';
	const reportButLink =
		'https://github.com/krishna-suwal/link-memory-extension/issues/new';
</script>

<div class="more-tab">
	<LinkItem
		id="github-repo"
		title="GitHub Repository"
		description="If you're interested in helping, you can contribute by going to this repository. Any help you can contribute will be greatly appreciated."
		url={githubUrl}
		faviconUrl={githubIconUrl}
	>
		<svelte:fragment slot="actions">
			<div
				class="action"
				title="Open in new tab"
				on:click={() => tabsMod.openNew(githubUrl)}
			>
				<OpenLinkIcon />
			</div>
			<div
				title="Copy"
				class="action copy-text tooltip"
				data-clipboard-text={githubUrl}
			>
				<CopyLinkIcon />
				<span class="tooltiptext">Copied!</span>
			</div>
		</svelte:fragment>
	</LinkItem>
	<LinkItem
		id="report"
		title="Report a bug | Report an issue"
		description="If you have encountered a bug, want to report something, or want to request for a feature, you can do so in this page."
		url={reportButLink}
		faviconUrl="https://cdn1.iconfinder.com/data/icons/social-object-set-2-1/74/27-512.png"
	>
		<svelte:fragment slot="actions">
			<div
				class="action"
				title="Open in new tab"
				on:click={() => tabsMod.openNew(reportButLink)}
			>
				<OpenLinkIcon />
			</div>
			<div
				title="Copy"
				class="action copy-text tooltip"
				data-clipboard-text={reportButLink}
			>
				<CopyLinkIcon />
				<span class="tooltiptext">Copied!</span>
			</div>
		</svelte:fragment>
	</LinkItem>
</div>

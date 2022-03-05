import type { SavedLinkData, TabInfo } from '../types';
import { replacePlaceholders } from '../utils/replacePlaceholders';

export function makeLinksExportHtml(
	savedLinks: SavedLinkData[],
	openTabs: TabInfo[]
) {
	let savedLinksHtml = '<td colspan="5">No Items!</td>';
	let openTabsHtml = '<td colspan="5">No Items!</td>';

	if (savedLinks.length > 0) {
		savedLinksHtml = savedLinks
			.map((item, i) => {
				return replacePlaceholders(rowTemplate, {
					serial_number: i + 1,
					thumbnail_url: item.image_url,
					title: item.label,
					description: item.description ? item.description : '',
					favicon_url: item.faviconUrl,
					link_url: item.url,
				});
			})
			.join('\n');
	}
	if (openTabs.length > 0) {
		openTabsHtml = openTabs
			.map((item, i) => {
				return replacePlaceholders(rowTemplate, {
					serial_number: i + 1,
					thumbnail_url: item.featuredImageUrl,
					title: item.title,
					description: item.description ? item.description : '',
					favicon_url: item.faviconUrl,
					link_url: item.url,
				});
			})
			.join('\n');
	}

	return replacePlaceholders(linksExportHtml, {
		saved_links_rows: savedLinksHtml,
		open_tabs_rows: openTabsHtml,
	});
}

export const rowTemplate = `
<tr>
	<td>{{serial_number}}</td>
	<td>
		<img class="thumb" src="{{thumbnail_url}}" alt="">
	</td>
	<td>{{title}}</td>
	<td>{{description}}</td>
	<td>
		<div class="link">
			<img src="{{favicon_url}}" alt="">
			<a target="_blank" rel="noopener noreferrer"
				href="{{link_url}}">{{link_url}}</a>
		</div>
	</td>
</tr>`;

export const linksExportHtml = `
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Link Memory - Exported Contents</title>

	<style>
		* {
			padding: 0;
			margin: 0;
			box-sizing: border-box;
		}

		body {
			padding: 24px;
		}

		body>*:not(:last-child) {
			margin-bottom: 24px;

		}

		h3 {
			text-align: center;
		}

		table {
			border-spacing: 0;
			width: 100%;
			border: 1px solid #ddd;
		}

		th,
		td {
			text-align: left;
			padding: 16px;
		}

		tr:nth-child(even) {
			background-color: #f2f2f2
		}

		.thumb {
			max-width: 100px;
		}

		.link {
			display: flex;
			align-items: flex-start;
		}

		.link img {
			max-width: 16px;
			margin-right: 6px;
		}
	</style>
</head>

<body>
	<h3>Saved Links</h3>
	<table>
		<tr>
			<th>SN</th>
			<th></th>
			<th>Title</th>
			<th>Description</th>
			<th>URL</th>
		</tr>
		{{saved_links_rows}}
	</table>

	<h3>Open Tabs</h3>
	<table>
		<tr>
			<th>SN</th>
			<th></th>
			<th>Title</th>
			<th>Description</th>
			<th>URL</th>
		</tr>
		{{open_tabs_rows}}
	</table>
</body>

</html>

`;

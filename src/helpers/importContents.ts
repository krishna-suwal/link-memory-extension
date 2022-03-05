import type { SavedLinkData, TabInfo } from '../types';
import { makeId } from '../utils/makeId';

export function importContentsFromJson(
	jsonStr: string
): Promise<SavedLinkData[]> {
	return new Promise((resolve, reject) => {
		if (!jsonStr) {
			return 'There is no content!';
		}

		const list: SavedLinkData[] = [];

		try {
			const json = JSON.parse(jsonStr);

			if (typeof json === 'object') {
				const savedLinks = json.savedLinks;
				const openTabs = json.openTabs;

				if (Array.isArray(savedLinks)) {
					savedLinks.forEach((item: SavedLinkData) => {
						if (!item.url) {
							return;
						}
						item.id = makeId();

						list.push(item);
					});
				}

				if (Array.isArray(openTabs)) {
					openTabs.forEach((item: TabInfo) => {
						if (!item.url) {
							return;
						}

						list.push({
							id: makeId(),
							label: item.title,
							description: item.description,
							url: item.url,
							image_url: item.featuredImageUrl,
							faviconUrl: item.faviconUrl,
						});
					});
				}
			}
		} catch (error) {
			return reject(error);
		}

		resolve(list);
	});
}

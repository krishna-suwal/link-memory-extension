import { appStorage } from '../modules/storageMod';
import { tabsMod } from '../modules/tabsMod';
import { makeLinksExportHtml } from '../templates/links-export';
import type { SavedLinkData, TabInfo } from '../types';
import { downloadTextIntoFile } from '../utils/downloadTextIntoFile';

export function exportContents(props: {
	includeSavedLinks: boolean;
	includeOpenTabs: boolean;
	format: 'json' | 'html';
}): Promise<void> {
	return new Promise(async (resolve, reject) => {
		if (props.format === 'json') {
			return exportContentsToJson(props).then(resolve).catch(reject);
		} else if (props.format === 'html') {
			return exportContentsToHtml(props).then(resolve).catch(reject);
		} else {
			return reject(`Unsupported export file format: ${props.format}`);
		}
	});
}

export function exportContentsToJson(props: {
	includeSavedLinks: boolean;
	includeOpenTabs: boolean;
}): Promise<void> {
	return new Promise(async (resolve, reject) => {
		try {
			const data: any = {};

			if (props.includeSavedLinks) {
				data.savedLinks = await appStorage.getSavedLinks();
			}
			if (props.includeOpenTabs) {
				data.openTabs = await tabsMod.getAll();
			}

			downloadTextIntoFile(`link-memory.json`, JSON.stringify(data));
		} catch (error) {
			return reject(error);
		}

		resolve();
	});
}

export function exportContentsToHtml(props: {
	includeSavedLinks: boolean;
	includeOpenTabs: boolean;
}): Promise<void> {
	return new Promise(async (resolve, reject) => {
		try {
			let savedLinks: SavedLinkData[] = [];
			let openTabs: TabInfo[] = [];

			if (props.includeSavedLinks) {
				savedLinks = await appStorage.getSavedLinks();
			}
			if (props.includeOpenTabs) {
				openTabs = await tabsMod.getAll();
			}

			downloadTextIntoFile(
				`link-memory.html`,
				makeLinksExportHtml(savedLinks, openTabs)
			);
		} catch (error) {
			return reject(error);
		}

		resolve();
	});
}

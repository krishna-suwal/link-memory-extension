import { dummyData } from '../helpers/dummyData';
import { getLastError } from '../helpers/getLastError';
import { getTabDescription } from '../helpers/getTabDescription';
import { getTabFeatureImage } from '../helpers/getTabFeatureImage';
import type { TabInfo } from '../types';
import { isExtensionEnv } from '../utils/isExtensionEnv';

function getAllTabsData(): Promise<TabInfo[]> {
	return new Promise((resolve, reject) => {
		if (!isExtensionEnv()) {
			return resolve(dummyData.openTabs);
		}

		chrome.tabs.query({}, async function (tabs) {
			const list: TabInfo[] = [];

			if (tabs) {
				for (let i = 0; i < tabs.length; i += 1) {
					const tab = tabs[i];

					list.push({
						tabId: tab.id ? tab.id : chrome.tabs.TAB_ID_NONE,
						title: tab.title ? tab.title : '',
						description: await getTabDescription(tab),
						url: tab.url ? tab.url : '',
						featuredImageUrl: await getTabFeatureImage(tab),
						faviconUrl: tab.favIconUrl ? tab.favIconUrl : '',
					});
				}
				resolve(list);
			} else {
				reject(getLastError());
			}
		});
	});
}

function getTabInfo(tabId: number): Promise<TabInfo> {
	return new Promise((resolve, reject) => {
		if (!isExtensionEnv()) {
			return resolve(dummyData.activeTab);
		}

		chrome.tabs.get(tabId, async (tab) => {
			if (tab) {
				resolve({
					tabId,
					title: tab.title ? tab.title : '',
					description: await getTabDescription(tab),
					url: tab.url ? tab.url : '',
					featuredImageUrl: await getTabFeatureImage(tab),
					faviconUrl: tab.favIconUrl ? tab.favIconUrl : '',
				});
			} else {
				reject(getLastError());
			}
		});
	});
}

function openNewTab(url: string) {
	if (!isExtensionEnv()) {
		window.open(url, '_blank');
		return;
	}
	chrome.tabs.create({ url });
}

function getActiveTab(): Promise<chrome.tabs.Tab> {
	return new Promise((resolve, reject) => {
		if (!isExtensionEnv()) {
			return reject('Cannot get tab object in non-extension environment');
		}

		if (chrome.tabs.query) {
			chrome.tabs
				.query({ active: true }, (tabs) => {
					if (tabs.length > 0) {
						resolve(tabs[0]);
					} else {
						reject(getLastError());
					}
				})
				// @ts-ignore
				?.then((tabs: any) => {
					if (tabs.length > 0) {
						resolve(tabs[0]);
					} else {
						reject(getLastError());
					}
				});
		} else {
			// @ts-ignore
			chrome.tabs.getSelected(undefined, function (tab) {
				if (tab) {
					resolve(tab);
				} else {
					reject(getLastError());
				}
			});
		}
	});
}

function openInActiveTab(url: string) {
	if (!isExtensionEnv()) {
		window.location.href = url;
		return;
	}

	getActiveTab().then((tab) => {
		if (tab.id) {
			chrome.tabs.update(tab.id, { url });
		}
	});
}

function getActiveTabInfo(): Promise<TabInfo> {
	return new Promise((resolve, reject) => {
		if (!isExtensionEnv()) {
			return resolve(dummyData.activeTab);
		}

		getActiveTab()
			.then(async (tab) => {
				resolve({
					tabId: tab.id ? tab.id : chrome.tabs.TAB_ID_NONE,
					title: tab.title ? tab.title : '',
					description: await getTabDescription(tab),
					url: tab.url ? tab.url : '',
					featuredImageUrl: await getTabFeatureImage(tab),
					faviconUrl: tab.favIconUrl ? tab.favIconUrl : '',
				});
			})
			.catch(reject);
	});
}

export const tabsMod = {
	getAll: getAllTabsData,
	get: getTabInfo,
	openNew: openNewTab,
	openInActiveTab,
	getActive: getActiveTab,
	getActiveTabInfo,
};

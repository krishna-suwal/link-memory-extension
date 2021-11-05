export class TabsManager {
	getAll() {
		return new Promise((resolve, reject) => {
			chrome.tabs.query({}, async function (tabs) {
				resolve(
					await Promise.all(
						tabs.map(async (tab) => ({
							id: tab.id,
							label: tab.title,
							url: tab.url,
							image_url: await getTabFeatureImage(tab),
						}))
					)
				);
			});
		});
	}
	get(tab_id) {
		return new Promise((resolve, reject) => {
			chrome.tabs.get(tab_id, async function (tab) {
				resolve({
					label: tab.title,
					url: tab.url,
					image_url: await getTabFeatureImage(tab),
				});
			});
		});
	}
	openNew(url) {
		chrome.tabs.create({ url });
	}
	openInActiveTab(url) {
		chrome.tabs.getSelected(null, function (tab) {
			chrome.tabs.update(tab.id, { url });
		});
	}
	getActive() {
		return new Promise((resolve) => {
			chrome.tabs.getSelected(null, async function (tab) {
				resolve({
					label: tab.title,
					url: tab.url,
					image_url: await getTabFeatureImage(tab),
				});
			});
		});
	}
}

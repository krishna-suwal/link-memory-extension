import getTabFeatureImage from '../helpers/getTabFeatureImage';

const core = {
	tabs: {
		getAll: function () {
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
		},
		get: function (tab_id) {
			return new Promise((resolve, reject) => {
				chrome.tabs.get(tab_id, async function (tab) {
					resolve({
						label: tab.title,
						url: tab.url,
						image_url: await getTabFeatureImage(tab),
					});
				});
			});
		},
		openNew: function (url) {
			chrome.tabs.create({ url });
		},
		openInActiveTab: function (url) {
			chrome.tabs.getSelected(null, function (tab) {
				chrome.tabs.update(tab.id, { url });
			});
		},
		getActive: function () {
			return new Promise((resolve) => {
				chrome.tabs.getSelected(null, async function (tab) {
					resolve({
						label: tab.title,
						url: tab.url,
						image_url: await getTabFeatureImage(tab),
					});
				});
			});
		},
	},
};

export default core;

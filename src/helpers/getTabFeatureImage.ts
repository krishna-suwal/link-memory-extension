import { logLastError } from '../utils/logTabError';

function getImageUrl() {
	const ogTag = document.querySelector('[property="og:image"]');
	const aTag = document.createElement('a');

	if (ogTag) {
		const url = ogTag.getAttribute('content');

		if (url) {
			aTag.href = url;

			return aTag.href;
		}
	}
	return '';
}

export function getTabFeatureImage(tab: chrome.tabs.Tab): Promise<string> {
	return new Promise((resolve) => {
		if (!tab.id) {
			return resolve('');
		}

		if (tab.url && tab.url?.trim().startsWith('view-source:')) {
			return resolve('');
		}

		function tryImageTypeUrl() {
			if (!tab.url) {
				return resolve('');
			}

			if (tab.url.match(/(\.png|\.jpg|\.jpeg|\.gif)$/g)) {
				resolve(tab.url);
			} else {
				resolve('');
			}
		}

		chrome.tabs.executeScript(
			tab.id,
			{
				code: `(${getImageUrl.toString()})()`,
			},
			(results) => {
				logLastError();

				if (!results) {
					tryImageTypeUrl();
				} else if (results.length > 0) {
					const firstItem = results[0];

					if (typeof firstItem === 'string' && firstItem?.trim() !== '') {
						resolve(firstItem);
					} else {
						tryImageTypeUrl();
					}
				} else {
					tryImageTypeUrl();
				}
			}
		);
	});
}

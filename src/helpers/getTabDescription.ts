import { logLastError } from '../utils/logTabError';

export function getTabDescription(tab: chrome.tabs.Tab): Promise<string> {
	return new Promise((resolve) => {
		if (!tab.id) {
			return resolve('');
		}

		if (tab.url && tab.url?.trim().startsWith('view-source:')) {
			return resolve('');
		}

		function tryMetaTag() {
			if (!tab.id) {
				return resolve('');
			}

			chrome.tabs.executeScript(
				tab.id,
				{
					code: `document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]').getAttribute('content') : ''`,
				},
				(results) => {
					logLastError();

					if (!results) {
						resolve('');
					} else if (results.length > 0) {
						const firstItem = results[0];

						if (typeof firstItem === 'string') {
							resolve(firstItem);
						} else {
							resolve('');
						}
					} else {
						resolve('');
					}
				}
			);
		}

		chrome.tabs.executeScript(
			tab.id,
			{
				code: `document.querySelector('[property="og:description"]') ? document.querySelector('[property="og:description"]').getAttribute('content') : ''`,
			},
			(results) => {
				logLastError();

				if (!results) {
					tryMetaTag();
				} else if (results.length > 0) {
					const firstItem = results[0];

					if (typeof firstItem === 'string' && firstItem?.trim() !== '') {
						resolve(firstItem);
					} else {
						tryMetaTag();
					}
				} else {
					tryMetaTag();
				}
			}
		);
	});
}

import { getLastError } from './getLastError';

export function getTabDescription(tab: chrome.tabs.Tab): Promise<string> {
	return new Promise((resolve) => {
		if (!tab.id) {
			return resolve('');
		}

		chrome.tabs.executeScript(
			tab.id,
			{
				code: `document.querySelector('[property="og:description"]') ? document.querySelector('[property="og:description"]').getAttribute('content') : ''`,
			},
			(results) => {
				const lastError = getLastError();

				if (lastError) {
					// eslint-disable-next-line no-console
					console.log('tab: ' + tab.id + ' lastError: ' + lastError);
				}

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
	});
}

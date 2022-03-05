import type { POJO } from '../types/general';
import { isExtensionEnv } from '../utils/isExtensionEnv';
import queryString from 'query-string';

export function openOptionsPage(urlParams: POJO = {}) {
	if (!isExtensionEnv()) {
		return;
	}

	// if (chrome.runtime.openOptionsPage) {
	// 	chrome.runtime.openOptionsPage();
	// 	return;
	// }

	let url = chrome.runtime.getURL(
		'options.html?' + queryString.stringify(urlParams)
	);

	if (url) {
		window.open(url);
		return;
	}

	chrome.tabs.create({
		url: `extension://${chrome.runtime.id}/options.html`,
	});
}

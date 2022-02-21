import { getLastError } from '../helpers/getLastError';

export function logLastError(tab: chrome.tabs.Tab | null = null): string {
	const lastError = getLastError();

	if (lastError) {
		if (tab) {
			// eslint-disable-next-line no-console
			console.log(`'tab: ${tab.id} lastError: ${lastError} url: ${tab.url}`);
		} else {
			// eslint-disable-next-line no-console
			console.log(`lastError: ${lastError}`);
		}
	}
	return lastError;
}

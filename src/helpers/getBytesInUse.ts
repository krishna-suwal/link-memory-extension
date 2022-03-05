import { isExtensionEnv } from '../utils/isExtensionEnv';

export function getSyncStoreBytesInUse(key: string): Promise<number> {
	return new Promise((resolve) => {
		if (!isExtensionEnv()) {
			return resolve(0);
		}

		chrome.storage.sync.getBytesInUse(key, (bytes) => {
			resolve(bytes);
		});
	});
}

import { byteLength } from 'byte-length';
import { isExtensionEnv } from '../utils/isExtensionEnv';

export function makeArrayDistributionForStore<T = any>(
	syncStoreKey: string,
	list: T[]
): { sync: T[]; local: T[] } {
	const syncItems: T[] = [];
	const localItems: T[] = [...list];

	if (!isExtensionEnv()) {
		return {
			sync: [],
			local: [...list],
		};
	}

	// Ref: https://stackoverflow.com/a/67429150/13616962
	const maxSyncLength =
		chrome.storage.sync.QUOTA_BYTES_PER_ITEM - byteLength(syncStoreKey) - 20;

	try {
		while (localItems.length > 0) {
			const item = localItems.shift();

			if (!item) {
				break;
			}

			syncItems.push(item);

			const json = JSON.stringify(syncItems);
			const bytes = byteLength(json);

			if (bytes > maxSyncLength) {
				syncItems.pop();
				localItems.unshift(item);
				break;
			} else if (bytes === maxSyncLength) {
				break;
			}
		}
	} catch (error) {
		return {
			sync: [],
			local: [...list],
		};
	}
	return {
		sync: syncItems,
		local: localItems,
	};
}

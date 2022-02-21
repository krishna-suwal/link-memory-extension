import { isExtensionEnv } from '../utils/isExtensionEnv';

export class Storage {
	cache: { [key: string]: any } = {};

	get(key: string): Promise<any> {
		return new Promise((resolve, reject) => {
			if (Object.keys(this.cache).includes(key)) {
				return resolve(this.cache[key]);
			}

			if (!isExtensionEnv()) {
				setTimeout(() => {
					const storedValue = localStorage.getItem(key);

					if (storedValue === null) {
						return resolve(null);
					}

					try {
						resolve(JSON.parse(storedValue));
					} catch (error) {
						reject(error);
					}
				}, 500);
				return;
			}
			// TODO Check if this blocks the runtime. Wrap it with setTimeout if it does.
			chrome.storage.sync.get([key], function (result) {
				try {
					resolve(JSON.parse(result[key]));
				} catch (error) {
					return reject(error);
				}
			});
		});
	}

	set(key: string, value: any): Promise<void> {
		return new Promise((resolve, reject) => {
			let readyVal = value;

			try {
				readyVal = JSON.stringify(value);
			} catch (error) {
				return reject(error);
			}

			if (!isExtensionEnv()) {
				localStorage.setItem(key, readyVal);
				this.cache[key] = value;
				return resolve();
			}

			chrome.storage.sync.set({ [key]: readyVal }, () => {
				if (chrome.runtime.lastError) {
					/**
					 * Reference for this error type checking method:
					 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#differentiate_between_similar_errors
					 */
					if (
						'QUOTA_BYTES_PER_ITEM quota exceeded' ===
						chrome.runtime.lastError.message
					) {
						return reject(
							'Failed to save new item. Storage limit exceeded. Storage limit is set by your browser. Current limit might be 1MB.'
						);
					} else {
						return reject(chrome.runtime.lastError.message);
					}
				}
				this.cache[key] = value;
				resolve();
			});
		});
	}
}

import { isExtensionEnv } from '../utils/isExtensionEnv';

export class Storage {
	keys: string[] = [];
	cache: { [key: string]: any } = {};
	isLoadedAll: boolean = false;

	constructor(props: { keys: string[] }) {
		this.keys = props.keys;
	}

	loadAll(): Promise<void> {
		return new Promise((resolve) => {
			if (!isExtensionEnv()) {
				setTimeout(() => {
					this.keys.forEach((key) => {
						const storedValue = localStorage.getItem(key);

						if (!storedValue) {
							this.cache[key] = null;
							return;
						}

						try {
							this.cache[key] = JSON.parse(storedValue);
						} catch (error) {
							// @ts-ignore
							console.error(error);
						}
					});
					this.isLoadedAll = true;
					resolve();
				}, 500);
				return;
			}
			setTimeout(() => {
				chrome.storage.sync.get(this.keys, (result) => {
					this.keys.forEach((key) => {
						if (!result[key]) {
							this.cache[key] = null;
							return;
						}

						try {
							this.cache[key] = JSON.parse(result[key]);
						} catch (error) {
							// @ts-ignore
							console.error(error);
						}
					});
					this.isLoadedAll = true;
					resolve();
				});
			}, 0);
		});
	}

	get(key: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			if (!this.isLoadedAll) {
				try {
					await this.loadAll();
				} catch (error) {
					return reject(error);
				}
			}
			resolve(this.cache[key]);
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

			setTimeout(() => {
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
								'Failed to save. Storage limit exceeded. The limit is set by your browser.'
							);
						} else {
							return reject(chrome.runtime.lastError.message);
						}
					}
					this.cache[key] = value;
					resolve();
				});
			}, 0);
		});
	}
}

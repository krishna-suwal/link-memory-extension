import type { StorageType } from '../types';
import { isExtensionEnv } from '../utils/isExtensionEnv';

export class Storage {
	stores: StorageType[] = [];
	cache: { [key: string]: any } = {};
	isLoadedAll: boolean = false;

	constructor(props: { stores: StorageType[] }) {
		this.stores = props.stores;
	}

	makeSyncStoreCacheKey(key: string) {
		return `sync.${key}`;
	}

	makeLocalStoreCacheKey(key: string) {
		return `local.${key}`;
	}

	getSyncStoreKeys(): string[] {
		return this.stores
			.filter((store) => store.type === 'sync')
			.map((store) => store.key);
	}

	getLocalStoreKeys(): string[] {
		return this.stores
			.filter((store) => store.type === 'local')
			.map((store) => store.key);
	}

	loadAll(): Promise<void> {
		return new Promise((resolve) => {
			if (!isExtensionEnv()) {
				setTimeout(() => {
					const syncKeys = this.getSyncStoreKeys();

					syncKeys.forEach((key) => {
						const cacheKey = this.makeSyncStoreCacheKey(key);
						const storedValue = localStorage.getItem(key);

						if (!storedValue) {
							this.cache[cacheKey] = null;
							return;
						}

						try {
							this.cache[cacheKey] = JSON.parse(storedValue);
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

			const loadSyncStorage = (keys: string[]): Promise<void> => {
				return new Promise((resolve) => {
					chrome.storage.sync.get(keys, (result) => {
						keys.forEach((key) => {
							const cacheKey = this.makeSyncStoreCacheKey(key);

							if (!result[key]) {
								this.cache[cacheKey] = null;
								return;
							}

							try {
								this.cache[cacheKey] = JSON.parse(result[key]);
							} catch (error) {
								// @ts-ignore
								console.error(error);
							}
						});
						this.isLoadedAll = true;
						resolve();
					});
				});
			};

			const loadLocalStorage = (keys: string[]): Promise<void> => {
				return new Promise((resolve) => {
					chrome.storage.local.get(keys, (result) => {
						keys.forEach((key) => {
							const cacheKey = this.makeLocalStoreCacheKey(key);

							if (!result[key]) {
								this.cache[cacheKey] = null;
								return;
							}

							try {
								this.cache[cacheKey] = JSON.parse(result[key]);
							} catch (error) {
								// @ts-ignore
								console.error(error);
							}
						});
						this.isLoadedAll = true;
						resolve();
					});
				});
			};

			setTimeout(async () => {
				await loadSyncStorage(this.getSyncStoreKeys());
				await loadLocalStorage(this.getLocalStoreKeys());
				resolve();
			}, 0);
		});
	}

	get(key: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const store = this.stores.find((store) => store.key === key);

			if (store) {
				if (store.type === 'local') {
					return this.getLocal(key).then(resolve).catch(reject);
				} else if (store.type === 'sync') {
					return this.getSync(key).then(resolve).catch(reject);
				}
			}
			reject(`Unknown storage key: ${key}`);
		});
	}

	set(key: string, value: any): Promise<void> {
		return new Promise((resolve, reject) => {
			const store = this.stores.find((store) => store.key === key);

			if (store) {
				if (store.type === 'local') {
					return this.setLocal(key, value).then(resolve).catch(reject);
				} else if (store.type === 'sync') {
					return this.setSync(key, value).then(resolve).catch(reject);
				}
			}
			reject(`Unknown storage key: ${key}`);
		});
	}

	getSync(key: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			if (!this.isLoadedAll) {
				try {
					await this.loadAll();
				} catch (error) {
					return reject(error);
				}
			}
			resolve(this.cache[this.makeSyncStoreCacheKey(key)]);
		});
	}

	setSync(key: string, value: any): Promise<void> {
		return new Promise((resolve, reject) => {
			const cacheKey = this.makeSyncStoreCacheKey(key);
			let readyVal = value;

			try {
				readyVal = JSON.stringify(value);
			} catch (error) {
				return reject(error);
			}

			if (!isExtensionEnv()) {
				localStorage.setItem(key, readyVal);
				this.cache[cacheKey] = value;
				return resolve();
			}

			setTimeout(() => {
				chrome.storage.sync.set({ [key]: readyVal }, () => {
					const error = chrome.runtime.lastError?.message;

					if (error) {
						/**
						 * Reference for this error type checking method:
						 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#differentiate_between_similar_errors
						 */
						if ('QUOTA_BYTES_PER_ITEM quota exceeded' === error) {
							return reject('Item quota exceeded');
						} else {
							return reject(error);
						}
					}
					this.cache[cacheKey] = value;
					resolve();
				});
			}, 0);
		});
	}

	getLocal(key: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			if (!this.isLoadedAll) {
				try {
					await this.loadAll();
				} catch (error) {
					return reject(error);
				}
			}
			resolve(this.cache[this.makeLocalStoreCacheKey(key)]);
		});
	}

	setLocal(key: string, value: any): Promise<void> {
		return new Promise((resolve, reject) => {
			const cacheKey = this.makeLocalStoreCacheKey(key);
			let readyVal = value;

			try {
				readyVal = JSON.stringify(value);
			} catch (error) {
				return reject(error);
			}

			if (!isExtensionEnv()) {
				localStorage.setItem(key, readyVal);
				this.cache[cacheKey] = value;
				return resolve();
			}

			setTimeout(() => {
				chrome.storage.local.set({ [key]: readyVal }, () => {
					const error = chrome.runtime.lastError?.message;

					if (error) {
						/**
						 * Reference for this error type checking method:
						 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#differentiate_between_similar_errors
						 */
						if ('QUOTA_BYTES_PER_ITEM quota exceeded' === error) {
							return reject('Item quota exceeded');
						} else {
							return reject(error);
						}
					}
					this.cache[cacheKey] = value;
					resolve();
				});
			}, 0);
		});
	}
}

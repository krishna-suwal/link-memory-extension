import { Storage } from './Storage';
import { v4 as uuidv4 } from 'uuid';
import type { AppOptions, Events, SavedLinkData } from '../types';
import { hasKey, isEmpty } from '../utils/utils';
import { makeArrayDistributionForStore } from '../helpers/makeArrayDistribution';
import { byteLength } from 'byte-length';
import { transferLastArrayItem } from '../utils/transferArrayItem';

export class AppStorage extends Storage {
	events: Events;

	constructor(options: { events: Events }) {
		super({
			stores: [
				{
					key: 'limem_links',
					type: 'sync',
				},
				{
					key: 'limem.local.links',
					type: 'local',
				},
				{
					key: 'limem_links_trash',
					type: 'sync',
				},
				{
					key: 'limem.sync.options',
					type: 'sync',
				},
				{
					key: 'limem.local.options',
					type: 'local',
				},
			],
		});
		this.events = options.events;
	}

	getOptions(): Promise<AppOptions> {
		return new Promise((resolve, reject) => {
			const options: AppOptions = { sync: {}, local: {} };

			super
				.getSync('limem.sync.options')
				.then((value) => {
					if (isEmpty(value)) {
						return;
					}
				})
				.catch(console.error)
				.finally(() => resolve(options));
		});
	}

	addNewItem(props: {
		id?: string;
		label: string;
		url: string;
		image_url: string;
		description?: string;
		faviconUrl?: string;
	}): Promise<SavedLinkData> {
		return new Promise((resolve, reject) => {
			this.getSavedLinks()
				.then((list) => {
					const data: SavedLinkData = {
						...props,
						id: props.id ? props.id : uuidv4(),
					};
					const newList = [...list, data];

					this.updateSavedLinks(newList)
						.then(() => resolve(data))
						.catch(reject);
				})
				.catch(reject);
		});
	}

	addBatch(items: SavedLinkData[]): Promise<void> {
		return new Promise((resolve, reject) => {
			this.getSavedLinks()
				.then((list) => {
					this.updateSavedLinks([...list, ...items])
						.then(resolve)
						.catch(reject);
				})
				.catch(reject);
		});
	}

	removeItem(id: string): Promise<SavedLinkData> {
		return new Promise((resolve, reject) => {
			this.getSavedLinks()
				.then((list) => {
					const removedItem = list.find((item) => item.id === id);

					if (!removedItem) {
						return reject(`Could find a saved tab with id: ${id}`);
					}

					const newList = list.filter((item) => item.id !== id);

					this.updateSavedLinks(newList)
						.then(() => resolve(removedItem))
						.catch(reject);

					this.addToTrash(removedItem);
				})
				.catch(reject);
		});
	}

	addToTrash(data: SavedLinkData): Promise<void> {
		return new Promise((resolve, reject) => {
			this.getTrashLinks()
				.then(async (list) => {
					const newList = [...list, data];
					let isSuccess = false;

					while (!isSuccess && newList.length > 0) {
						try {
							await this.updateTrashLinks(newList);
							isSuccess = true;
						} catch (error) {
							newList.shift();
						}
					}
					resolve();
				})
				.catch(reject);
		});
	}

	popLastTrashItem(): Promise<SavedLinkData | undefined> {
		return new Promise((resolve, reject) => {
			this.getTrashLinks()
				.then((list) => {
					resolve(list.pop());
					this.updateTrashLinks(list);
				})
				.catch(reject);
		});
	}

	clearTrash(): Promise<void> {
		return this.updateTrashLinks([]);
	}

	restoreItem(): Promise<SavedLinkData> {
		return new Promise((resolve, reject) => {
			this.popLastTrashItem()
				.then((item) => {
					if (item) {
						this.addNewItem(item).then(resolve).catch(reject);
					} else {
						reject('Nothing to restore!');
					}
				})
				.catch(reject);
		});
	}

	//-------------------------
	// Low level.
	//-------------------------

	getSavedLinks(): Promise<SavedLinkData[]> {
		return new Promise(async (resolve) => {
			const list: SavedLinkData[] = [];

			const load = async (key: string, isLocal = false) => {
				try {
					const value = await this.get(key);

					if (Array.isArray(value)) {
						value.forEach((item) => {
							if (!item.id) {
								return;
							}
							if (isLocal) {
								list.push({
									...item,
									storeLocation: 'local',
								});
							} else {
								list.push(item);
							}
						});
					}
				} catch (error) {
					console.log(error);
				}
			};

			// Load links from the sync storage.
			await load('limem_links');

			// Load links from the local storage.
			await load('limem.local.links', true);

			resolve(list);
		});
	}

	updateSavedLinks(list: SavedLinkData[]): Promise<void> {
		return new Promise(async (resolve, reject) => {
			list = list.map((item) => {
				delete item.storeLocation;
				return item;
			});

			const prevList = await this.getSavedLinks();
			const dist = makeArrayDistributionForStore('limem_links', list);
			let syncItems = dist.sync;
			let localItems = dist.local;

			try {
				while (1) {
					try {
						await this.set('limem_links', syncItems);
						break;
					} catch (error) {
						if (error === 'Item quota exceeded') {
							const result = transferLastArrayItem(
								syncItems,
								localItems,
								'first'
							);

							syncItems = result.from;
							localItems = result.to;
						} else {
							throw error;
						}
					}
				}
				await this.set('limem.local.links', localItems);

				localItems = localItems.map((item) => ({
					...item,
					storeLocation: 'local',
				}));

				this.events.emit('saved-links-changed', [...syncItems, ...localItems]);
			} catch (error) {
				console.error(error);
				reject(error);
				const dist = makeArrayDistributionForStore('limem_links', prevList);

				await this.set('limem_links', dist.sync);
				await this.set('limem.local.links', dist.local);
				return;
			}
			resolve();
		});
	}

	getTrashLinks(): Promise<SavedLinkData[]> {
		return new Promise((resolve, reject) => {
			const list: SavedLinkData[] = [];

			super
				.getSync('limem_links_trash')
				.then((value) => {
					if (Array.isArray(value)) {
						value.forEach((item) => {
							if (item.id) {
								list.push(item);
							}
						});
					}
					resolve(list);
				})
				.catch(reject);
		});
	}

	updateTrashLinks(list: SavedLinkData[]): Promise<void> {
		return new Promise((resolve, reject) => {
			super
				.setSync('limem_links_trash', list)
				.then(() => {
					this.events.emit('trash-links-changed', list);
					resolve();
				})
				.catch(reject);
		});
	}
}

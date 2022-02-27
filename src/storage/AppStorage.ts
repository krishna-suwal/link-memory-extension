import { Storage } from './Storage';
import { v4 as uuidv4 } from 'uuid';
import type { AppOptions, Events, SavedLinkData } from '../types';
import { hasKey, isEmpty } from '../utils/utils';
import { chunkArray } from '../utils/chunkArray';

export class AppStorage extends Storage {
	events: Events;

	constructor(options: { events: Events }) {
		super({
			keys: [
				'limem_links',
				'limem_links_1',
				'limem_links_trash',
				'limem_options',
			],
		});
		this.events = options.events;
	}

	getOptions(): Promise<AppOptions> {
		return new Promise((resolve, reject) => {
			const options: AppOptions = {};

			super
				.get('limem_options')
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

	//-------------------------
	// Low level.
	//-------------------------

	getSavedLinks(): Promise<SavedLinkData[]> {
		return new Promise(async (resolve) => {
			const list: SavedLinkData[] = [];

			const load = async (key: string) => {
				try {
					const value1 = await super.get(key);

					if (Array.isArray(value1)) {
						value1.forEach((item) => {
							if (item.id) {
								list.push(item);
							}
						});
					}
				} catch (error) {
					console.error(error);
				}
			};

			await load('limem_links');
			await load('limem_links_1');

			resolve(list);
		});
	}

	updateSavedLinks(list: SavedLinkData[]): Promise<void> {
		return new Promise(async (resolve, reject) => {
			const prevList = await this.getSavedLinks();
			const chunks = chunkArray(list, 2);

			try {
				await super.set('limem_links', chunks[0]);
				await super.set('limem_links_1', chunks[1]);

				this.events.emit('saved-links-changed', list);
			} catch (error) {
				const prevListChunks = chunkArray(prevList, 2);

				await super.set('limem_links', prevListChunks[0]);
				await super.set('limem_links_1', prevListChunks[1]);

				reject(error);
			}
			resolve();
		});
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

	getTrashLinks(): Promise<SavedLinkData[]> {
		return new Promise((resolve, reject) => {
			const list: SavedLinkData[] = [];

			super
				.get('limem_links_trash')
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
				.set('limem_links_trash', list)
				.then(() => {
					this.events.emit('trash-links-changed', list);
					resolve();
				})
				.catch(reject);
		});
	}
}

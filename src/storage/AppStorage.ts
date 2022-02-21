import { Storage } from './Storage';
import { v4 as uuidv4 } from 'uuid';
import type { Events, SavedLinkData } from '../types';

export class AppStorage extends Storage {
	events: Events;

	constructor(options: { events: Events }) {
		super();
		this.events = options.events;
	}

	addNewItem(props: {
		label: string;
		url: string;
		image_url: string;
		description?: string;
		faviconUrl?: string;
	}): Promise<SavedLinkData> {
		return new Promise((resolve, reject) => {
			this.getSavedLinks()
				.then((list) => {
					const data: SavedLinkData = { id: uuidv4(), ...props };
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

	getSavedLinks(): Promise<SavedLinkData[]> {
		return new Promise((resolve, reject) => {
			const list: SavedLinkData[] = [];

			super
				.get('limem_links')
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

	updateSavedLinks(list: SavedLinkData[]): Promise<void> {
		return new Promise((resolve, reject) => {
			super
				.set('limem_links', list)
				.then(() => {
					this.events.emit('saved-links-changed', list);
					resolve();
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

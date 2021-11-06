import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { lm } from '../core/global-module';

export const isFetchingLinks = writable(true);
export const links = (function () {
	const { set, subscribe, update } = writable([]);

	return {
		set,
		subscribe,
		update,
		add: function ({ label, url, image_url }) {
			const newItem = { id: uuidv4(), label, url, image_url };

			update((list) => {
				const newLinks = [...list, newItem];

				lm.storage.set('limem_links', newLinks).catch((reason) => {
					console.log(`Current limit: ${list.length}`);
					alert(reason);
					set([...list]);
				});
				return newLinks;
			});
			return newItem;
		},
		remove: function (id) {
			update((list) => {
				const removedItem = list.find((item) => item.id === id);
				const newLinks = list.filter((item) => item.id !== id);

				lm.storage.set('limem_links', newLinks).catch((reason) => {
					console.log(`Current links limit: ${list.length}`);
					alert(reason);
					set([...list]);
				});
				linksTrash.add(removedItem);
				return newLinks;
			});
		},
	};
})();
export const linksTrash = (function () {
	const { set, subscribe, update } = writable([]);

	function popLastItem() {
		return new Promise((resolve, reject) => {
			update((list) => {
				if (list.length === 0) {
					resolve(undefined);
					return list;
				}
				resolve(list.pop());
				lm.storage.set('limem_links_trash', list);
				return list;
			});
		});
	}

	return {
		set,
		subscribe,
		update,
		add: function ({ label, url, image_url }) {
			update((list) => {
				const newItem = { id: uuidv4(), label, url, image_url };
				const newList = [...list, newItem];

				lm.storage.set('limem_links_trash', newList).catch((reason) => {
					console.log(`Current limit trash: ${list.length}`);

					list = [...list];
					list.shift();
					list = [...list, newItem];

					set(list);
				});
				return newList;
			});
		},
		clear: function () {
			lm.storage.set('limem_links_trash', []);
		},
		restore: async function () {
			const lastItem = await popLastItem();

			if (!lastItem) return;

			return links.add(lastItem);
		},
	};
})();

lm.storage.onUpdate('limem_links', links.set, 'store-update');
lm.storage.onUpdate('limem_links_trash', linksTrash.set, 'store-update');

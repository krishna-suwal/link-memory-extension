import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const dumyLinksList = [
	{
		id: 'adsfdsa',
		image_url: 'https://avt.mkklcdnv6temp.com/6/v/19-1583499341.jpg',
		label: 'Google Official Site (Search Engine Site) - Dummy Link Data',
		url: 'https://google.com',
	},
	{
		id: 'gdhera',
		label: 'Google Official Site (Search Engine Site) - Dummy Link Data',
		url: 'https://google.com',
	},
	{
		id: 'gdhhadfwera',
		label: 'Google Official Site (Search Engine Site) - Dummy Link Data',
		url: 'https://google.com',
		image_url:
			'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded',
	},
];

export const isFetchingLinks = writable(true);
export const links = (function () {
	const { set, subscribe, update } = writable([]);

	return {
		set,
		subscribe,
		update,
		add: function ({ label, url, image_url }) {
			update((list) => {
				const newItem = { id: uuidv4(), label, url, image_url };
				const newLinks = [...list, newItem];

				storageManager.set('limem_links', newLinks);
				return newLinks;
			});
		},
		remove: function (id) {
			update((list) => {
				const removedItem = list.find((item) => item.id === id);
				const newLinks = list.filter((item) => item.id !== id);

				storageManager.set('limem_links', newLinks);
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
				storageManager.set('limem_links_trash', list);
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

				storageManager.set('limem_links_trash', newList);
				return newList;
			});
		},
		clear: function () {
			storageManager.set('limem_links_trash', []);
		},
		restore: async function () {
			const lastItem = await popLastItem();

			if (!lastItem) return;

			links.add(lastItem);
		},
	};
})();

storageManager.onUpdate('limem_links', links.set, 'store-update');
storageManager.onUpdate('limem_links_trash', linksTrash.set, 'store-update');

storageManager.get('limem_links', []).then((list) => {
	if (Array.isArray(list)) {
		links.set(list);
	}
	isFetchingLinks.set(false);
});
storageManager.get('limem_links_trash', []).then((list) => {
	if (Array.isArray(list)) {
		linksTrash.set(list);
	}
});

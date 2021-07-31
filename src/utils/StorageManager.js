const onUpdateListeners = {};

function initListenersContainer(name) {
	if (onUpdateListeners[name]) return;

	onUpdateListeners[name] = {};
}
function callUpdateListeners(name, ...args) {
	if (!onUpdateListeners[name]) return;

	Object.values(onUpdateListeners[name]).forEach((callback) => {
		callback(...args);
	});
}

class StorageManager {
	get(key, _default = null) {
		return new Promise((resolve, reject) => {
			const storage = window.storage
				? window.storage.StorageArea
				: chrome.storage;

			storage.sync.get([key], function (result) {
				if (typeof result[key] !== 'string') return resolve(_default);

				try {
					resolve(JSON.parse(result[key]));
				} catch (error) {
					return reject(error);
				}
			});
		});
	}
	set(key, value) {
		const _this = this;

		return new Promise((resolve, reject) => {
			if (typeof value !== 'string') value = JSON.stringify(value);

			const storage = window.storage
				? window.storage.StorageArea
				: chrome.storage;

			storage.sync.set({ [key]: value }, () => {
				_this.get(key).then((value) => {
					callUpdateListeners(key, value);
				});
				resolve();
			});
		});
	}
	onUpdate(key, callback, listenerId) {
		if (typeof callback !== 'function') return;

		initListenersContainer(key);
		onUpdateListeners[key][listenerId] = callback;
	}
}

export default StorageManager;

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

export class StorageManager {
	get(key, _default = null) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				let result = localStorage.getItem(key);

				if (typeof result !== 'string') return resolve(_default);
				try {
					resolve(JSON.parse(result));
				} catch (error) {
					reject(error);
				}
			}, 2000);
		});
	}
	set(key, value) {
		const _this = this;

		return new Promise((resolve, reject) => {
			if (typeof value !== 'string') value = JSON.stringify(value);

			localStorage.setItem(key, value);
			_this.get(key).then((value) => {
				callUpdateListeners(key, value);
			});
			resolve();
		});
	}
	onUpdate(key, callback, listenerId) {
		if (typeof callback !== 'function') return;

		initListenersContainer(key);
		onUpdateListeners[key][listenerId] = callback;
	}
}

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
			chrome.storage.sync.get([key], function (result) {
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

			chrome.storage.sync.set({ [key]: value }, () => {
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
							'Storage limit exceeded. Storage limit is set by your browser. Current limit might be 1MB.'
						);
					} else {
						return reject(chrome.runtime.lastError.message);
					}
				}

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

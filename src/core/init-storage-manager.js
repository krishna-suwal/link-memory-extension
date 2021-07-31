import StorageManager from '../utils/StorageManager';
import StorageManagerEmulator from '../utils/StorageManagerEmulator';

if (window.storage || chrome.storage) {
	window.storageManager = new StorageManager();
} else {
	window.storageManager = new StorageManagerEmulator();
}

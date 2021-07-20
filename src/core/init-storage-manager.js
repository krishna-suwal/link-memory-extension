import StorageManager from '../utils/StorageManager';
import StorageManagerEmulator from '../utils/StorageManagerEmulator';

if (chrome.storage) {
	window.storageManager = new StorageManager();
} else {
	window.storageManager = new StorageManagerEmulator();
}

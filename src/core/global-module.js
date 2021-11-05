import { lm as lmPolyfill } from '../browser-polyfills/global-module';
import StorageManager from '../lib/StorageManager';
import { TabsManager } from '../lib/TabsManager';
import { isExtensionEnv } from '../utils/isExtensionEnv';

export const lm = isExtensionEnv()
	? {
			tabs: new TabsManager(),
			storage: new StorageManager(),
	  }
	: lmPolyfill;

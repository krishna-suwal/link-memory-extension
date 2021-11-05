import { StorageManager } from './StorageManager';
import { TabsManager } from './TabsManager';

export const lm = {
	tabs: new TabsManager(),
	storage: new StorageManager(),
};

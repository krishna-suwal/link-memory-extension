import { appStorage } from '../modules/storageMod';
import { isFetchingLinks, links } from '../stores/links-store';

export function bootstrap() {
	appStorage
		.getSavedLinks()
		.then((list) => {
			links.set(list);
		})
		.finally(() => {
			isFetchingLinks.set(false);
		});

	appStorage.events.addListener('saved-links-changed', links.set);
}

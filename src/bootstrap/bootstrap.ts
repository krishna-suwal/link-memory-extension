import { appStorage } from '../modules/storageMod';
import {
	isFetchingLinks,
	isFetchingTrashLinks,
	links,
	linksTrash,
} from '../stores/links-store';

export function bootstrap() {
	appStorage
		.getSavedLinks()
		.then((list) => {
			links.set(list);
		})
		.finally(() => {
			isFetchingLinks.set(false);
		});

	appStorage
		.getTrashLinks()
		.then((list) => {
			linksTrash.set(list);
		})
		.finally(() => {
			isFetchingTrashLinks.set(false);
		});
}

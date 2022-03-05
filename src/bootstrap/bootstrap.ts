import LZString from 'lz-string';
import { appStorage } from '../modules/storageMod';
import { isFetchingLinks, links } from '../stores/links-store';

export function bootstrap() {
	appStorage
		.getSavedLinks()
		.then((list) => {
			links.set(list);

			const newList = list.map((item) => {
				const encodedDesc = item.description
					? LZString.compressToUTF16(item.description)
					: '';
				const decodedDesc = LZString.decompressFromUTF16(encodedDesc);

				return {
					...item,
					encodedDesc,
					descLen: item.description?.length,
					encodedDescLen: encodedDesc.length,
					decodedDesc,
					decodedDescLen: decodedDesc?.length,
					isEqual: decodedDesc === item.description,
				};
			});

			console.log(newList);
		})
		.finally(() => {
			isFetchingLinks.set(false);
		});

	appStorage.events.addListener('saved-links-changed', links.set);
}

import LZString from 'lz-string';
import type { SavedLinkData } from '../types';

export function decodeLinksData(list: SavedLinkData[]): SavedLinkData[] {
	return list.map((item) => {
		if (item.ed) {
			const description = item.description ? item.description : '';
			const decodedDesc = LZString.decompressFromUTF16(description);

			item = {
				...item,
				description: decodedDesc ? decodedDesc : '',
			};

			delete item.ed;
		}
		return item;
	});
}

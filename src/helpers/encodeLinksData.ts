import LZString from 'lz-string';
import type { SavedLinkData } from '../types';

export function encodeLinksData(list: SavedLinkData[]): SavedLinkData[] {
	return list.map((item) => {
		const description = item.description;

		if (description) {
			return {
				...item,
				description: LZString.compressToUTF16(description),
				ed: true,
			};
		}
		return item;
	});
}

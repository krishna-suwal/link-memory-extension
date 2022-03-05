export type PlaceholdersType = {
	[tag: string]: any;
};

export function replacePlaceholders(
	str: string,
	placeholders: PlaceholdersType
) {
	Object.entries(placeholders).forEach(([tag, value]) => {
		const regex = new RegExp(`{{${tag}}}`, 'g');

		str = str.replace(regex, value);
	});
	return str;
}

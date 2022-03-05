export function transferLastArrayItem<T = any>(
	from: T[],
	to: T[],
	toLocation: 'first' | 'last' = 'first'
): {
	from: T[];
	to: T[];
} {
	from = [...from];
	to = [...to];

	const item = from.pop();

	if (!item) {
		return { from, to };
	}

	if (toLocation === 'first') {
		to.unshift(item);
	} else if (toLocation === 'last') {
		to.push(item);
	}
	return { from, to };
}

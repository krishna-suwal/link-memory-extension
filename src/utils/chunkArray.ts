export function chunkArray<T = any>(
	array: T[],
	length: number,
	isBalanced: boolean = true
): T[][] {
	if (length < 2) {
		return [array];
	}

	let len = array.length;
	let out = [];
	let i = 0;
	let size;

	if (len % length === 0) {
		size = Math.floor(len / length);

		while (i < len) {
			out.push(array.slice(i, (i += size)));
		}
	} else if (isBalanced) {
		while (i < len) {
			size = Math.ceil((len - i) / length--);
			out.push(array.slice(i, (i += size)));
		}
	} else {
		length--;
		size = Math.floor(len / length);

		if (len % size === 0) {
			size--;
		}

		while (i < size * length) {
			out.push(array.slice(i, (i += size)));
		}
		out.push(array.slice(size * length));
	}

	return out;
}

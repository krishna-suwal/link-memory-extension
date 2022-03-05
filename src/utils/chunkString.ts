export function chunkString(str: string, length: number): string[] {
	if (length < 2) {
		return [str];
	}
	let chunks: string[] = [];
	let chunkSize = Math.floor(str.length / length);

	for (let i = 0; i < length - 1; i += 1) {
		if (!str) {
			chunks.push('');
			continue;
		}
		const a = i * chunkSize;
		const b = a + chunkSize;

		chunks.push(str.substring(a, b));
		str = str.substring(b);
	}
	chunks.push(str);

	return chunks;
}

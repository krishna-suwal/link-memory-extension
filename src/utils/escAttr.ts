export function escAttr(str: string): string {
	return str.replace(/"/g, '&quot;');
}

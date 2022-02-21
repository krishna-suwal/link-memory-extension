export function isExtensionEnv() {
	if (window.chrome?.storage) {
		return true;
	}
	return false;
}

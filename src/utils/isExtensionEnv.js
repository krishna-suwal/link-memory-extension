export function isExtensionEnv() {
	if (chrome.storage) {
		return true;
	}
	return false;
}

export function getLastError(): string {
	const lastErr = chrome.runtime.lastError;

	if (lastErr) {
		return JSON.stringify(lastErr);
	}
	return '';
}

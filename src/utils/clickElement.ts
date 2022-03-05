export function clickElement(element: HTMLElement | null) {
	if (!element) {
		return;
	}

	if (element.click) {
		element.click();
		return;
	}
	if (document.createEvent) {
		const evt = document.createEvent('MouseEvents');

		if (evt.initEvent) {
			evt.initEvent('click', true, false);
			element.dispatchEvent(evt);
			return;
		}
	}
}

export function scrollIntoView(selector) {
	let element = selector;

	if (typeof element === 'string') {
		element = document.querySelector(selector);
	}
	if (!element || typeof element !== 'object') {
		return;
	}
	element.scrollIntoView({ behavior: 'smooth' });
}

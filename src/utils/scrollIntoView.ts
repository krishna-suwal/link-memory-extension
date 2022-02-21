export function scrollIntoView(selector: string | Element): void {
	const scrollerArgs: boolean | ScrollIntoViewOptions = { behavior: 'smooth' };

	if (typeof selector === 'string') {
		document.querySelector(selector)?.scrollIntoView(scrollerArgs);
	} else {
		selector?.scrollIntoView(scrollerArgs);
	}
}

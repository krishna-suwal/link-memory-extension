export function initClipboardJS() {
	new ClipboardJS('.copy-text').on('success', function (e: any) {
		e.trigger.classList.add('tooltip-visible');

		setTimeout(() => {
			e.trigger.classList.remove('tooltip-visible');
		}, 3000);
	});
}

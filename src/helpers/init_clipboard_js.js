export function init_clipboard_js() {
	new ClipboardJS('.copy-text').on('success', function (e) {
		e.trigger.classList.add('tooltip-visible');

		setTimeout(() => {
			e.trigger.classList.remove('tooltip-visible');
		}, 3000);
	});
}

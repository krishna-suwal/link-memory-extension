export function downloadTextIntoFile(fileName: string, text: string) {
	const element = document.createElement('a');

	element.setAttribute(
		'href',
		'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
	);
	element.setAttribute('download', fileName);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

export function waitForElement(
	selector: string,
	props: {
		maxWait?: number;
		pingInterval?: number;
	} = {}
): Promise<Element> {
	return new Promise((resolve, reject) => {
		const { maxWait = 5000, pingInterval = 500 } = props;
		let waited = 0;

		if (!selector) {
			return reject('Selector cannot be empty!');
		}

		const element = document.querySelector(selector);

		if (element) {
			return resolve(element);
		}

		let timerId = setInterval(() => {
			const element = document.querySelector(selector);

			if (element) {
				clearInterval(timerId);
				return resolve(element);
			}
			waited += pingInterval;

			if (waited >= maxWait) {
				clearInterval(timerId);
				reject('Element not found!');
			}
		}, pingInterval);
	});
}

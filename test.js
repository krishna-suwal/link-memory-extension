require('dotenv').config();

const puppeteer = require('puppeteer');
const path = require('path');

const webpages = [
	'https://ww2.gogoanimes.org/static/images/logo.png',
	'https://www.youtube.com/watch?v=VlUwxCptDcg',
	'https://www.npmjs.com/package/open-graph-scraper',
];

(async () => {
	const TEST_PROD = process.env.TEST_PROD.toUpperCase() === 'YES';
	const thisExtensionPath = TEST_PROD
		? path.resolve(__dirname, 'dist')
		: __dirname;
	const paths = `${thisExtensionPath}`;

	if (TEST_PROD) {
		console.log('-> Testing PRODUCTION code...');
	}
	console.log('-> Opening Browser...');

	const browserArgs = [
		`--disable-extensions-except=${paths}`,
		`--load-extension=${paths}`,
	];

	if (process.env.BROWSER_MAXIMIZED.toUpperCase() === 'YES') {
		browserArgs.push(`--start-maximized`);
	} else {
		browserArgs.push(`--window-size=1000,700`);
	}

	const browser = await puppeteer.launch({
		executablePath: process.env.BROWSER_EXEC_PATH,
		headless: false,
		devtools: process.env.BROWSER_DEVTOOLS?.toUpperCase() === 'YES',
		args: browserArgs,
	});

	console.log('✅ Browser opened');
	console.log('-> Opening webpages...');

	for (let i = 0; i < webpages.length; i += 1) {
		(await browser.newPage()).goto(webpages[i]);
	}

	console.log('✅ Webpages opened');
	console.log('-> Waiting for the extension to be loaded...');

	const waitForExtension = 1000;

	setTimeout(async () => {
		console.log(
			`-> Assuming the extension has been loaded after waiting for ${waitForExtension} ms...`
		);
		console.log('-> Navigating to the extension page...');

		const targets = browser.targets();
		const extensionTarget = targets.find(
			({ _targetInfo }) => _targetInfo.type === 'service_worker'
		);

		if (extensionTarget) {
			const partialExtensionUrl = extensionTarget._targetInfo.url || '';
			const [, , extensionID] = partialExtensionUrl.split('/');
			const extensionUrl = `chrome-extension://${extensionID}/popup-view.html`;

			(await browser.newPage()).goto(extensionUrl);

			console.log('✅ Opened up the extension page');
		} else {
			console.log('❌ Could not find the extension');
		}
	}, waitForExtension);
})();

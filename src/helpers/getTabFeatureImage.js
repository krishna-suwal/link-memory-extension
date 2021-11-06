function getTabFeatureImage(tab) {
	return new Promise((resolve) => {
		chrome.tabs.executeScript(
			tab.id,
			{
				code: `document.querySelector('[property="og:image"]') ? document.querySelector('[property="og:image"]').getAttribute('content') : ''`,
			},
			(og_image_url) => {
				const lastErr = chrome.runtime.lastError;

				if (lastErr)
					// eslint-disable-next-line no-console
					console.log(
						'tab: ' + tab.id + ' lastError: ' + JSON.stringify(lastErr)
					);

				if (Array.isArray(og_image_url)) {
					og_image_url = og_image_url[0];
				}

				if (og_image_url && typeof og_image_url === 'string') {
					resolve(og_image_url);
				} else {
					resolve(tab.favIconUrl);
				}
			}
		);
	});
}

export default getTabFeatureImage;

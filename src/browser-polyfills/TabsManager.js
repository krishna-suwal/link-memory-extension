import { v4 as uuidv4 } from 'uuid';

let bool = true;
const featureImageUrl =
	'https://thumbs.dreamstime.com/b/concept-open-magic-book-pages-water-land-small-child-fantasy-nature-learning-copy-space-166401875.jpg';

function getFeatureImage() {
	bool = !bool;
	return bool ? featureImageUrl : '';
}

export class TabsManager {
	async getAll() {
		return [
			{
				id: uuidv4(),
				label:
					'Aliquip cupidatat minim commodo consequat eiusmod laboris velit elit voluptate',
				url: 'https://searchapparchitecture.techtarget.com/definition/software',
				image_url: getFeatureImage(),
			},
			{
				id: uuidv4(),
				label: document.title,
				url: location.href,
				image_url: getFeatureImage(),
			},
		];
	}
	async get() {
		return {
			label: document.title,
			url: location.href,
			og_image_url: getFeatureImage(),
		};
	}
	openNew(url) {
		window.open(url, '_blank');
	}
	openInActiveTab(url) {
		window.location.href = url;
	}
	async getActive() {
		return {
			label:
				'Aliquip cupidatat minim commodo consequat eiusmod laboris velit elit voluptate',
			url: 'https://searchapparchitecture.techtarget.com/definition/software',
			image_url: getFeatureImage(),
		};
	}
}

import { v4 as uuidv4 } from 'uuid';

let bool = false;

function getFeatureImage() {
	bool = !bool;

	if (bool) {
		return 'https://thumbs.dreamstime.com/b/concept-open-magic-book-pages-water-land-small-child-fantasy-nature-learning-copy-space-166401875.jpg';
	}
	return '';
}

const coreEmulator = {
	tabs: {
		getAll: async function () {
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
		},
		get: async function () {
			return {
				label: document.title,
				url: location.href,
				og_image_url: getFeatureImage(),
			};
		},
		openNew: function (url) {
			window.open(url, '_blank');
		},
		openInActiveTab: function (url) {},
		getActive: async function () {
			return {
				label:
					'Aliquip cupidatat minim commodo consequat eiusmod laboris velit elit voluptate',
				url: 'https://searchapparchitecture.techtarget.com/definition/software',
				image_url: getFeatureImage(),
			};
		},
	},
};

export default coreEmulator;

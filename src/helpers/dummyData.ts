import type { TabInfo } from '../types';

const featureImageUrl =
	'https://thumbs.dreamstime.com/b/concept-open-magic-book-pages-water-land-small-child-fantasy-nature-learning-copy-space-166401875.jpg';
const description =
	'Laborum dolor ea sit dolor ut sit exercitation velit fugiat in occaecat. Laborum dolor ea sit dolor ut sit exercitation velit fugiat in occaecat.';

export const dummyData: {
	featureImageUrl: string;
	activeTab: TabInfo;
	openTabs: TabInfo[];
} = {
	featureImageUrl: featureImageUrl,
	activeTab: {
		tabId: 0,
		title: document.title,
		description: description,
		url: location.href,
		faviconUrl: '',
		featuredImageUrl: '',
	},
	openTabs: [
		{
			tabId: 1,
			title:
				'Aliquip cupidatat minim commodo consequat eiusmod laboris velit elit voluptate',
			url: 'https://searchapparchitecture.techtarget.com/definition/software',
			featuredImageUrl: featureImageUrl,
			description: description,
			faviconUrl: 'https://s.w.org/favicon.ico?2',
		},
		{
			tabId: 2,
			title: document.title,
			url: location.href,
			featuredImageUrl: '',
			description: description,
			faviconUrl:
				'https://cdn.sstatic.net/Sites/crypto/Img/apple-touch-icon@2.png?v=fff48bebc5fd',
		},
		{
			tabId: 3,
			title:
				'Aliquip cupidatat minim commodo consequat eiusmod laboris velit elit voluptate',
			url: 'https://searchapparchitecture.techtarget.com/definition/software',
			featuredImageUrl: featureImageUrl,
			description: '',
			faviconUrl: 'https://s.w.org/favicon.ico?2',
		},
	],
};

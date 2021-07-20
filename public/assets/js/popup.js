let dummy_links = [
	{
		id: 'adsfdsa',
		image_url: 'https://avt.mkklcdnv6temp.com/6/v/19-1583499341.jpg',
		label: 'Google Official Site (Search Engine Site) - Dummy Link Data',
		url: 'https://google.com',
	},
	{
		id: 'gdhera',
		label: 'Google Official Site (Search Engine Site) - Dummy Link Data',
		url: 'https://google.com',
	},
	{
		id: 'gdhhadfwera',
		label: 'Google Official Site (Search Engine Site) - Dummy Link Data',
		url: 'https://google.com',
		image_url:
			'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded',
	},
];
let links = [];
let trash = [];

// links = dummy_links;

function loadData() {
	return new Promise((resolve) => {
		if (!window.chrome) return resolve();
		if (!window.chrome.storage) return resolve();

		chrome.storage.sync.get(
			['limem_links', 'limem_links_trash'],
			function (result) {
				try {
					let parsedList = JSON.parse(result.limem_links);

					if (Array.isArray(parsedList)) {
						links = parsedList;
					}

					let parsedTrash = JSON.parse(result.limem_links_trash);

					if (Array.isArray(parsedTrash)) {
						trash = parsedTrash;
					}
				} catch (error) {}
				resolve();
			}
		);
	});
}
function saveData(links) {
	return new Promise((resolve) => {
		saveTrash();

		if (!window.chrome) return resolve();
		if (!window.chrome.storage) return resolve();
		if (!Array.isArray(links)) return resolve();

		chrome.storage.sync.set({ limem_links: JSON.stringify(links) }, resolve);
	});
}
function saveTrash(_trash_data = null) {
	return new Promise((resolve) => {
		if (!window.chrome) return resolve();
		if (!window.chrome.storage) return resolve();

		if (!_trash_data) {
			_trash_data = trash;
		}

		if (!Array.isArray(_trash_data)) return resolve();

		chrome.storage.sync.set(
			{ limem_links_trash: JSON.stringify(_trash_data) },
			resolve
		);
	});
}

function getLink(id) {
	return links.find((link) => `${link.id}` == `${id}`);
}

function removeLink(id) {
	const new_list = [];

	links.forEach((link) => {
		if (link.id !== id) {
			new_list.push(link);
		} else {
			trash.push(link);
		}
	});
	links = new_list;

	saveTrash();
	saveData(links).then(() => updateLinksListUI(links));
}
function addLink(label, url, og_image_url) {
	links.push({ id: Date.now(), label, url, image_url: og_image_url });

	saveData(links).then(() => updateLinksListUI(links));
}

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

$(document).ready(function () {
	loadData().then(() => {
		updateLinksListUI(links);

		$('.links-list').dblclick(function (e) {
			if (!['a', 'A'].includes(e.target.tagName)) return;

			const url = $(e.target).attr('href');

			chrome.tabs.getSelected(null, function (tab) {
				chrome.tabs.update(tab.id, { url: url });
			});
		});
		$('.add-link').on('click', function () {
			chrome.tabs.getSelected(null, async function (tab) {
				addLink(tab.title, tab.url, await getTabFeatureImage(tab));

				$('.links-list').animate(
					{
						scrollTop: $('.links-list .link-item:last').offset().top,
					},
					500
				);
			});
		});
		$('.links-list').on('click', '.open-in-new-tab', function () {
			const link = getLink($(this).data('id'));

			if (link) {
				chrome.tabs.create({ url: link.url });
			}
		});
		$('.links-list').on('click', '.delete-link', function () {
			removeLink($(this).data('id'));
		});
		$('.clear-trash').on('click', function (e) {
			if (e.detail === 5) {
				saveTrash([]);
				trash = [];
				alert('Cleared Trash!');
			}
		});
		$('.restore').on('click', function () {
			if (trash.length > 0) {
				const { label, url, image_url } = trash.pop();
				addLink(label, url, image_url);
				saveTrash();

				$('.links-list').animate(
					{
						scrollTop: $('.links-list .link-item:last').offset().top,
					},
					500
				);
			} else {
				alert('Nothing to restore!');
			}
		});
	});

	$('.open-tabs-list .list').html('');

	chrome.tabs.query({}, async function (tabs) {
		let html = '';

		for (let i = 0; i < tabs.length; i += 1) {
			const tab = tabs[i];

			html += getOpenTabItemTemplate({
				id: tab.id,
				label: tab.title,
				url: tab.url,
				image_url: await getTabFeatureImage(tab),
			});
		}
		$('.open-tabs-list .list').html(html);
	});
	$(document.body).on('click', '.add-tab-to-links-list', function () {
		const tab_id = $(this).data('tab-id');

		if (!tab_id) return;

		chrome.tabs.get(tab_id, async function (tab) {
			addLink(tab.title, tab.url, await getTabFeatureImage(tab));
		});
	});
});

function updateLinksListUI(links = []) {
	let html = '';

	links.forEach((link) => {
		html += getLinkItemTemplate(link);
	});

	$('.links-list').html(html);

	new ClipboardJS('.copy-link').on('success', function (e) {
		$(e.trigger).addClass('tooltipped').addClass('tooltipped-s');

		setTimeout(() => {
			$(e.trigger).removeClass('tooltipped').removeClass('tooltipped-s');
		}, 5000);
	});
}

function getLinkItemTemplate({ id, label, url, image_url }) {
	return `<div class="link-item">
	${
		image_url
			? `
		<div class="og-image">
			<img src="${image_url}">
		</div>
		`
			: ''
	}
	<div class="detail ${image_url ? 'deduct-og-image' : ''}">
		<div class="title-row" title="${label.replace(/"/g, '&quot;')}">
			<a href="${url}">${label}</a>
		</div>
		<div class="url-row" title="${url.replace(/"/g, '&quot;')}">
			<a href="${url}">${url}</a>
		</div>
	</div>
	<div class="actions">
		<div class="action open-in-new-tab" data-id="${id}" title="Open in new tab">
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
				id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;"
				xml:space="preserve"><g>	<g>		<path			d="M492.703,0H353.126c-10.658,0-19.296,8.638-19.296,19.297c0,10.658,8.638,19.296,19.296,19.296h120.281v120.281    c0,10.658,8.638,19.296,19.296,19.296c10.658,0,19.297-8.638,19.297-19.296V19.297C512,8.638,503.362,0,492.703,0z" />	</g></g><g>	<g>		<path			d="M506.346,5.654c-7.538-7.539-19.747-7.539-27.285,0L203.764,280.95c-7.539,7.532-7.539,19.753,0,27.285    c3.763,3.769,8.703,5.654,13.643,5.654c4.933,0,9.873-1.885,13.643-5.654L506.346,32.939    C513.885,25.407,513.885,13.186,506.346,5.654z" />	</g></g><g>	<g>		<path			d="M427.096,239.92c-10.658,0-19.297,8.638-19.297,19.296v214.191H38.593V104.201h214.191    c10.658,0,19.296-8.638,19.296-19.296s-8.638-19.297-19.296-19.297H19.297C8.638,65.608,0,74.246,0,84.905v407.799    C0,503.362,8.638,512,19.297,512h407.799c10.664,0,19.296-8.638,19.296-19.297V259.216    C446.392,248.558,437.754,239.92,427.096,239.92z" />	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
			</svg>
		</div>
		<div title="Copy" class="action copy-link" data-id="${id}" data-clipboard-text="${url}" aria-label="Copied!">
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
				id="Layer_1" x="0px" y="0px" viewBox="0 0 300 300" style="enable-background:new 0 0 300 300;"
				xml:space="preserve">
				<g>
					<g>
						<g>
							<path
								d="M149.996,0C67.157,0,0.001,67.161,0.001,149.997S67.157,300,149.996,300s150.003-67.163,150.003-150.003     S232.835,0,149.996,0z M225.363,123.302l-36.686,36.686c-3.979,3.979-9.269,6.17-14.895,6.17c-5.625,0-10.916-2.192-14.895-6.168     l-1.437-1.437l-3.906,3.906l1.434,1.434c8.214,8.214,8.214,21.579,0,29.793l-36.681,36.686c-3.979,3.979-9.269,6.17-14.898,6.17     c-5.628,0-10.919-2.192-14.9-6.173L74.634,216.5c-8.214-8.209-8.214-21.573-0.003-29.79l36.689-36.684     c3.979-3.979,9.269-6.17,14.898-6.17s10.916,2.192,14.898,6.17l1.432,1.432l3.906-3.906l-1.432-1.432     c-8.214-8.211-8.214-21.576-0.005-29.79l36.689-36.686c3.981-3.981,9.272-6.173,14.898-6.173s10.916,2.192,14.898,6.17     l13.868,13.873C233.577,101.723,233.577,115.09,225.363,123.302z" />
							<path
								d="M142.539,173.459l-7.093,7.093l-11.002-10.999l7.093-7.093l-1.432-1.432c-1.04-1.037-2.422-1.611-3.89-1.611     c-1.471,0-2.853,0.573-3.893,1.611l-36.686,36.681c-2.145,2.147-2.145,5.638,0,7.783l13.87,13.873     c2.083,2.083,5.708,2.08,7.786,0.003l36.681-36.686c2.148-2.147,2.148-5.641,0-7.789L142.539,173.459z" />
							<path
								d="M200.493,90.643c-1.04-1.04-2.425-1.613-3.896-1.613c-1.471,0-2.856,0.573-3.896,1.616l-36.686,36.684     c-2.142,2.147-2.142,5.638,0.003,7.786l1.434,1.432l10.88-10.883l11.002,11.002l-10.88,10.883l1.434,1.434     c2.083,2.077,5.703,2.08,7.786-0.003l36.684-36.681c2.145-2.147,2.145-5.638,0-7.786L200.493,90.643z" />
						</g>
					</g>
				</g><g> </g><g> </g><g> </g><g> </g><g> </g><g> </g><g> </g><g> </g><g> </g><g> </g><g> </g><g> </g><g> </g><g></g><g></g>
			</svg>
		</div>
		<div title="Delete" class="action delete-link" data-id="${id}">
			<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 512 512"
				viewBox="0 0 512 512">
				<g>
					<path
						d="m424 64h-88v-16c0-26.51-21.49-48-48-48h-64c-26.51 0-48 21.49-48 48v16h-88c-22.091 0-40 17.909-40 40v32c0 8.837 7.163 16 16 16h384c8.837 0 16-7.163 16-16v-32c0-22.091-17.909-40-40-40zm-216-16c0-8.82 7.18-16 16-16h64c8.82 0 16 7.18 16 16v16h-96z" />
					<path
						d="m78.364 184c-2.855 0-5.13 2.386-4.994 5.238l13.2 277.042c1.22 25.64 22.28 45.72 47.94 45.72h242.98c25.66 0 46.72-20.08 47.94-45.72l13.2-277.042c.136-2.852-2.139-5.238-4.994-5.238zm241.636 40c0-8.84 7.16-16 16-16s16 7.16 16 16v208c0 8.84-7.16 16-16 16s-16-7.16-16-16zm-80 0c0-8.84 7.16-16 16-16s16 7.16 16 16v208c0 8.84-7.16 16-16 16s-16-7.16-16-16zm-80 0c0-8.84 7.16-16 16-16s16 7.16 16 16v208c0 8.84-7.16 16-16 16s-16-7.16-16-16z" />
					</g>
			</svg>
			</div>
		</div>
	</div>`;
}
function getOpenTabItemTemplate({ id, label, url, image_url }) {
	return `<div class="link-item">
	${
		image_url
			? `
		<div class="og-image">
			<img src="${image_url}">
		</div>
		`
			: ''
	}
	<div class="detail ${
		image_url ? 'deduct-og-image' : ''
	}" style="max-width: calc(100% - 88px) !important;">
		<div class="title-row" title="${label.replace(/"/g, '&quot;')}">
			<a href="${url}">${label}</a>
		</div>
		<div class="url-row" title="${url.replace(/"/g, '&quot;')}">
			<a href="${url}">${url}</a>
		</div>
	</div>
	<div class="actions">
		<div class="action add-tab-to-links-list" data-tab-id="${id}" title="Add">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512"
				style="enable-background:new 0 0 512 512;" xml:space="preserve">
				<g>
					<g>
						<path d="M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.853,256-256S397.167,0,256,0z M256,472.341
c-119.275,0-216.341-97.046-216.341-216.341S136.725,39.659,256,39.659S472.341,136.705,472.341,256S375.295,472.341,256,472.341z
" />
					</g>
				</g>
				<g>
					<g>
						<path d="M355.148,234.386H275.83v-79.318c0-10.946-8.864-19.83-19.83-19.83s-19.83,8.884-19.83,19.83v79.318h-79.318
c-10.966,0-19.83,8.884-19.83,19.83s8.864,19.83,19.83,19.83h79.318v79.318c0,10.946,8.864,19.83,19.83,19.83
s19.83-8.884,19.83-19.83v-79.318h79.318c10.966,0,19.83-8.884,19.83-19.83S366.114,234.386,355.148,234.386z" />
					</g>
				</g>
				<g></g>
				<g></g>
				<g></g>
				<g></g>
				<g></g>
				<g></g>
				<g></g>
				<g></g>
				<g></g>
				<g></g>
				<g></g>
				<g></g>
				<g></g>
				<g></g>
				<g></g>
			</svg>
		</div>
	</div>
</div>`;
}

<h1 align="center">Link Memory</h1>

<p align="center">
 <img src="https://github.com/krishna-suwal/link-memory-extension/raw/develop/public/assets/images/Screenshot_1.png">
 <img src="https://github.com/krishna-suwal/link-memory-extension/raw/develop/public/assets/images/Screenshot_2.png">
</p>

### About

This extension uses svelte for rendering UI. You can use this extension to save tabs/links instead of keeping them open.

1. When you click on the extension icon, a popup will appear. And you can add/save your active tabs.
2. To add current open tab there is a button at the bottom.
3. To add other active tabs, it will listed at the bottom and you just need to click on the plus icon. The saved tabs/links will be listed at the top.
4. You can open one of them in a new tab, copy the link or delete it.
5. You can recover the deleted tabs by clicking on the restore icon at the top right corner.
6. To clear the trash, just press "Clear Trash" button 4 times.

### Development

Clone this repository and install dependencies

```shell
git clone https://github.com/krishna-suwal/link-memory-extension.git
cd link-memory-extension
yarn install
```

You can directly load the root folder as unpackaged extension for testing on browser.

However it will be easier to work in localhost for things that don't require browser extension API. So to run it on localhost use:

```shell
yarn svelte:dev
```

Rebuild extension logos from `icons/logo.svg`.

```shell
yarn rebuild-logos
```

Zip `dist` folder for upload to Ms Edge Web Store and Firefox. _This script needs ``7z`` command to be available on PATH_. If you're using windows, then you can follow [this link](https://stackoverflow.com/a/18180154/13616962) to install ``7z`` on your system.

```shell
yarn build
```

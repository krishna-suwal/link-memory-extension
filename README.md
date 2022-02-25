<h1 align="center">Link Memory</h1>

<p align="center">
 <img src="https://github.com/krishna-suwal/link-memory-extension/raw/develop/public/assets/images/Screenshot_1.png" width="500" >
 <img src="https://github.com/krishna-suwal/link-memory-extension/raw/develop/public/assets/images/Screenshot_2.png" width="500" >
</p>

### About

Save your tabs with this extension instead of leaving them open and letting them slow down your computer.

1. When you click on the extension icon, a popup will appear. There you can save your open tabs.
2. To save currently active tab, there is a button at the bottom named "Save Current Tab".
3. To save other open tabs, go to "Open Tabs" tab. Hover on the item you want to save and click on the plus icon.
4. After saving your tabs, you can open them in a new tab, copy link or delete them.
5. You can recover the deleted items by clicking on the restore icon at the top right corner.
6. To clear the trash, click on "Clear Trash" button.

### Development

## Roadmap
- Use [lz-string](https://www.npmjs.com/package/lz-string) to compress data
- As MS Edge haven't allowed extensions to have unlimited storage, add secondary storage to save links/tabs

Clone this repository and install dependencies

```shell
git clone https://github.com/krishna-suwal/link-memory-extension.git
cd link-memory-extension
yarn install
```
Run client dev server for svelte.

```shell
yarn svelte:dev
```
Copy and rename the `.env.example` file to `.env` and update it accordingly.

To test the extension, run `node test.js`. It will open up a browser using `puppeteer` and load up the extension.
It will also load the extension's popup page.

To rebuild extension logos, run `yarn rebuild-logos`.

To make release zip, run `yarn build`. It will generate zip files in the root directory. This script needs ``7z`` command to be available on PATH. If you're using windows, then you can follow [this link](https://stackoverflow.com/a/18180154/13616962) to install ``7z`` on your system.

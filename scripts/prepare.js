const path = require('path');
const fs = require('fs-extra');
const mkdirp = require('make-dir');
const distPath = path.resolve(__dirname, '..', 'dist');
// const srcPath = path.resolve(__dirname, '..', 'src');

(async function () {
	await mkdirp(distPath);
	await installDependecies();
	await buildSvelteSrc();
	await copyFiles();
})();

function installDependecies() {
	return new Promise((resolve, reject) => {
		console.log('\n[1/3] Install dependecies...');

		require('child_process')
			.exec('yarn install', (error, stdout, stderr) => {
				if (error) {
					return reject(error);
				}
				if (stderr) {
					return reject(stderr);
				}
				console.log(`stdout:\n${stdout}`);
			})
			.on('message', console.log)
			.on('exit', resolve)
			.on('close', resolve)
			.on('error', reject);
	});
}
function buildSvelteSrc() {
	return new Promise((resolve, reject) => {
		console.log('\n[2/3] Build svelte code...');

		require('child_process')
			.exec('yarn svelte:build', (error, stdout, stderr) => {
				if (error) {
					return reject(error);
				}
				if (stderr) {
					return reject(stderr);
				}
				console.log(`stdout: ${stdout}`);
			})
			.on('exit', resolve)
			.on('error', reject);
	});
}
function copyFiles() {
	console.log('\n[3/3] Copy files...');

	const filesToCopy = [
		{
			from: path.resolve(__dirname, '..', 'public'),
			to: path.resolve(distPath, 'public'),
		},
		{
			from: path.resolve(__dirname, '..', 'popup-view.html'),
			to: path.resolve(distPath, 'popup-view.html'),
		},
		{
			from: path.resolve(__dirname, '..', 'options.html'),
			to: path.resolve(distPath, 'options.html'),
		},
		{
			from: path.resolve(__dirname, '..', 'background.js'),
			to: path.resolve(distPath, 'background.js'),
		},
		{
			from: path.resolve(__dirname, '..', 'manifest.json'),
			to: path.resolve(distPath, 'manifest.json'),
		},
		{
			from: path.resolve(__dirname, '..', 'icons'),
			to: path.resolve(distPath, 'icons'),
		},
	];

	return Promise.all(filesToCopy.map((file) => fs.copy(file.from, file.to)));
}

/**
 * Copy the src files.
 *
 * @since 1.0.0
 *
 * @returns {Promise} a newly generated promise object.
 */
// function src() {
// 	console.log('[2/2] Bundle extension manifest, images and main script.');

// 	const copyManifest = fs.copy(
// 		path.resolve(srcPath, 'manifest.json'),
// 		path.resolve(distPath, 'manifest.json')
// 	);

// 	const copyExtensionLogos = fs.copy(path.resolve(srcPath, 'icons'), distPath);

// 	return Promise.all([copyManifest, copyExtensionLogos]);
// }

/**
 * External depedencies
 */
const path = require('path');
const sharp = require('sharp');
const mkdirp = require('make-dir');

/**
 * Internal depedencies
 */
const svgPath = path.resolve(__dirname, '..', 'icons', 'logo.svg');
const iconsPath = path.resolve(__dirname, '..', 'icons');
const targetSizes = [16, 32, 48, 128];

// Build extension icons.
mkdirp(iconsPath).then(generateIcons);

/**
 * Generate extension icons.
 *
 * @since 1.4.0
 */
async function generateIcons() {
	await Promise.all(
		targetSizes.map((size) => {
			sharp(svgPath)
				.png()
				.resize({ width: size, height: size })
				.toFile(`${iconsPath}/icon-${size}.png`);
		})
	);
	console.log('Generated icons...');
}

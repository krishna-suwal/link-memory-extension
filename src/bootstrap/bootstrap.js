import { lm } from '../core/global-module';
import { lm as lmPolyfill } from '../browser-polyfills/global-module';
import { isExtensionEnv } from '../utils/isExtensionEnv';

export function bootstrap() {
	if (isExtensionEnv()) {
		window.lm = lm;
	} else {
		window.lm = lmPolyfill;
	}
}

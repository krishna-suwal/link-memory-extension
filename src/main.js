import './core/init-storage-manager';
import './core/init-core';

import Popup from './Popup.svelte';

const app = new Popup({
	target: document.body,
});

export default app;

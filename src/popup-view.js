import './core/init-storage-manager';
import './core/init-core';

import PopupView from './PopupView';

const app = new PopupView({
	target: document.body,
});

export default app;

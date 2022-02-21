import { bootstrap } from './bootstrap/bootstrap';
import PopupView from './PopupView/PopupView.svelte';

bootstrap();

const root = document.getElementById('root');

if (root) {
	new PopupView({
		target: root,
	});
}

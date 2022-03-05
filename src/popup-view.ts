import { bootstrap } from './bootstrap/bootstrap';
import PopupView from './PopupView/PopupView.svelte';
import './global.scss';

bootstrap();

const root = document.getElementById('root');

if (root) {
	new PopupView({
		target: root,
	});
}

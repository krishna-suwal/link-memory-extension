import PopupView from './PopupView';
import { bootstrap } from './bootstrap/bootstrap';

bootstrap();

const root = document.getElementById('root');

if (root) {
	new PopupView({
		target: root,
	});
}

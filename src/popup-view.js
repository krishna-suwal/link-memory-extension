import PopupView from './PopupView';
import { bootstrap } from './bootstrap/bootstrap';

bootstrap();

const app = new PopupView({
	target: document.body,
});

export default app;

import core from '.';
import coreEmulator from './core-emulator';

if (window.storage || chrome.storage) {
	window.lm = core;
} else {
	window.lm = coreEmulator;
}

import core from '.';
import coreEmulator from './core-emulator';

if (chrome.storage) {
	window.lm = core;
} else {
	window.lm = coreEmulator;
}

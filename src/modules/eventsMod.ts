import EventEmitter from 'events';
import type { Events } from '../types';

export const events: Events = new EventEmitter();

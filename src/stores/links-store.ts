import { writable } from 'svelte/store';
import type { SavedLinkData } from '../types';

export const isFetchingLinks = writable<boolean>(true);
export const links = writable<SavedLinkData[]>([]);

import { writable } from 'svelte/store';
import { events } from '../modules/eventsMod';
import type { SavedLinkData } from '../types';

export const isFetchingLinks = writable<boolean>(true);
export const isFetchingTrashLinks = writable<boolean>(true);
export const links = writable<SavedLinkData[]>([]);
export const linksTrash = writable<SavedLinkData[]>([]);

events.addListener('saved-links-changed', links.set);
events.addListener('trash-links-changed', linksTrash.set);

import type EventEmitter from 'events';

export interface SavedLinkData {
	id: string;
	label: string;
	url: string;
	image_url: string;
	description?: string;
	faviconUrl?: string;
	storeLocation?: 'sync' | 'local';
}

export interface TabInfo {
	tabId: number;
	title: string;
	url: string;
	featuredImageUrl: string;
	faviconUrl: string;
	description: string;
}

export interface Events extends EventEmitter {
	emit(eventName: 'saved-links-changed', savedLinks: SavedLinkData[]): boolean;
	emit(eventName: 'trash-links-changed', trashLinks: SavedLinkData[]): boolean;
	addListener(
		eventName: 'saved-links-changed',
		callback: (savedLinks: SavedLinkData[]) => void
	): any;
	addListener(
		eventName: 'trash-links-changed',
		callback: (trashLinks: SavedLinkData[]) => void
	): any;
}

export interface AppOptions {
	sync: {};
	local: {};
}

export type StorageType = {
	type: 'sync' | 'local';
	key: string;
};

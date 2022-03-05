import queryString from 'query-string';

export function getTargetAction() {
	return queryString.parse(location.search).targetAction;
}

export function getTargetTab() {
	return queryString.parse(location.search).targetTab;
}

(function () {
	// jshint esnext: true
	'use strict';

	if (!isObject(angular)) {
		return;
	}

	const internals = {};

	if (!findApp()) {
		return;
	}

	findPodcastFilter();
	findPodcastSearchForm();
	initShortcuts();

	function dispatchShortcut(event) {
		if (areShortcutsDisabled()) {
			return;
		}
		const shortcuts = getShortcuts();
		if (!shortcuts) {
			return;
		}
		const keyCode = event.keyCode;
		if (!shortcuts.hasOwnProperty(keyCode)) {
			return;
		}
		if (!isFunction(shortcuts[keyCode])) {
			return;
		}
		shortcuts[keyCode](event);
	}

	function getShortcuts() {
		return isObject(internals.shortcuts) ? internals.shortcuts : undefined;
	}

	function initShortcuts() {
		const KEYCODE_J = 74;
		const KEYCODE_K = 75;
		const KEYCODE_L = 76;
		const KEYCODE_SLASH = 191;
		const KEYCODE_MINUS = 189;
		const KEYCODE_PLUS = 187;
		const KEYCODE_M = 77;
		const KEYCODE_S = 83;
		internals.shortcuts = {};
		internals.shortcuts[KEYCODE_J] = skipBack;
		internals.shortcuts[KEYCODE_K] = togglePlayback;
		internals.shortcuts[KEYCODE_L] = skipForward;
		internals.shortcuts[KEYCODE_SLASH] = togglePodcastFilter;
		internals.shortcuts[KEYCODE_MINUS] = decreaseVolume;
		internals.shortcuts[KEYCODE_PLUS] = increaseVolume;
		internals.shortcuts[KEYCODE_M] = toggleMute;
		internals.shortcuts[KEYCODE_S] = togglePodcastSearch;
		window.addEventListener('keyup', dispatchShortcut, false);
		const textInputs = document.querySelectorAll('input[type="text"]');
		if (!textInputs.length) {
			return;
		}
		textInputs.forEach(function (input) {
			input.addEventListener('focus', disableShortcuts, false);
			input.addEventListener('blur', enableShortcuts, false);
		});
	}

	function areShortcutsDisabled() {
		return internals.areShortcutsDisabled;
	}

	function enableShortcuts() {
		internals.areShortcutsDisabled = false;
	}

	function disableShortcuts() {
		internals.areShortcutsDisabled = true;
	}

	function toggleMute() {
		if (!isPlayerLoaded()) {
			return;
		}
		const player = getPlayer();
		if (isMuted()) {
			player.unmute();
			return;
		}
		player.mute();
	}

	function isMuted() {
		if (!isPlayerLoaded()) {
			return;
		}
		return getPlayer().muted;
	}

	function increaseVolume() {
		if (!isPlayerLoaded()) {
			return;
		}
		setVolume(getVolume() + 0.1);
	}

	function decreaseVolume() {
		if (!isPlayerLoaded()) {
			return;
		}
		setVolume(getVolume() - 0.1);
	}

	function setVolume(volume) {
		if (!isPlayerLoaded()) {
			return;
		}
		if (!isNumber(volume)) {
			return;
		}
		const player = getPlayer();
		if (!player) {
			return;
		}
		if (!isFunction(player.setVolume)) {
			return;
		}
		const MAX_VOLUME = 1;
		const MIN_VOLUME = 0;
		if (volume > MAX_VOLUME) {
			player.setVolume(MAX_VOLUME);
			return;
		}
		if (volume < MIN_VOLUME) {
			player.setVolume(MIN_VOLUME);
			return;
		}
		player.setVolume(volume);
	}

	function getVolume() {
		const player = getPlayer();
		if (!player) {
			return 0;
		}
		return isNumber(player.volume) ? player.volume : 0;
	}

	function togglePlayback() {
		if (!isPlayerLoaded()) {
			return;
		}
		if (isPlayerPlaying()) {
			getPlayer().pause();
			return;
		}
		getPlayer().play();
	}

	function isPlayerPlaying() {
		const player = getPlayer();
		if (!player) {
			return;
		}
		return player.playing;
	}

	function isPlayerLoaded() {
		const player = getPlayer();
		if (!player) {
			return;
		}
		return player.loaded;
	}

	function getPlayer() {
		const app = getApp();
		if (!app) {
			return;
		}
		if (!isObject(app.mediaPlayer)) {
			return;
		}
		return app.mediaPlayer;
	}

	function skipForward() {
		if (!isPlayerLoaded()) {
			return;
		}
		const player = getPlayer();
		if (!isFunction(player.jumpForward)) {
			return;
		}
		player.jumpForward();
	}

	function skipBack() {
		if (!isPlayerLoaded()) {
			return;
		}
		const player = getPlayer();
		if (!isFunction(player.jumpBack)) {
			return;
		}
		player.jumpBack();
	}

	function findPodcastSearchForm() {
		const container = document.querySelector('[ng-controller="SearchController"]');
		const podcastSearch = getScope(container);
		if (!podcastSearch) {
			return;
		}
		internals.podcastSearch = podcastSearch;
		const searchInput = container.querySelector('[ng-model="searchStr"]');
		if (searchInput) {
			searchInput.addEventListener('blur', togglePodcastSearch, false);
		}
		return getPodcastSearch();
	}

	function togglePodcastSearch() {
		const podcastSearch = getPodcastSearch();
		if (!podcastSearch) {
			return;
		}
		podcastSearch.$apply(function () {
			podcastSearch.openCloseSearch();
		});
	}

	function getPodcastSearch() {
		return internals.podcastSearch;
	}

	function togglePodcastFilter() {
		const podcastFilter = getPodcastFilter();
		if (!podcastFilter) {
			return;
		}
		podcastFilter.focus();
	}

	function getPodcastFilter() {
		return internals.podcastFilter;
	}

	function findPodcastFilter() {
		const podcastFilter = document.querySelector('input[ng-model="search.title"]');
		if (!podcastFilter) {
			return;
		}
		internals.podcastFilter = podcastFilter;
		return getPodcastFilter();
	}

	function getApp() {
		return internals.app;
	}

	function findApp() {
		const app = getScope(document.body);
		if (!app) {
			return;
		}
		internals.app = app;
		return getApp();
	}

	function getScope(element) {
		const ngElement = angular.element(element);
		if (!hasScope(ngElement)) {
			return;
		}
		return ngElement.scope();
	}

	function hasScope(item) {
		return isObject(item) && isFunction(item.scope);
	}

	function isNumber(item) {
		return (toStringCall(item) === '[object Number]') &&
			isFinite(item);
	}

	function isFunction(item) {
		return toStringCall(item) === '[object Function]';
	}

	function isObject(item) {
		return toStringCall(item) === '[object Object]';
	}

	function toStringCall(item) {
		return Object.prototype.toString.call(item);
	}

})();

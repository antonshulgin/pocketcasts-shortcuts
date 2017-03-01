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

	findSearchField();
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
		internals.shortcuts = {};
		internals.shortcuts[KEYCODE_J] = skipBack;
		internals.shortcuts[KEYCODE_K] = togglePlayback;
		internals.shortcuts[KEYCODE_L] = skipForward;
		internals.shortcuts[KEYCODE_SLASH] = focusAtSearchField;
		internals.shortcuts[KEYCODE_MINUS] = decreaseVolume;
		internals.shortcuts[KEYCODE_PLUS] = increaseVolume;
		internals.shortcuts[KEYCODE_M] = toggleMute;
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

	function focusAtSearchField() {
		const searchField = getSearchField();
		if (!searchField) {
			return;
		}
		searchField.focus();
	}

	function getSearchField() {
		return internals.searchField;
	}

	function findSearchField() {
		const SELECTOR_SUBSCRIPTION_SEARCH = 'input[ng-model="search.title"]';
		const searchField = document.querySelector(SELECTOR_SUBSCRIPTION_SEARCH);
		if (!searchField) {
			return;
		}
		internals.searchField = searchField;
		return getSearchField();
	}

	function getApp() {
		return internals.app;
	}

	function findApp() {
		const app = angular.element(document.body);
		if (!hasScope(app)) {
			return;
		}
		internals.app = app.scope();
		return getApp();
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

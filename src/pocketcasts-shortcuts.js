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

	window.shortcuts = {
		internals: internals
	};

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
		internals.shortcuts = {};
		internals.shortcuts[KEYCODE_J] = skipBack;
		internals.shortcuts[KEYCODE_K] = togglePlayback;
		internals.shortcuts[KEYCODE_L] = skipForward;
		internals.shortcuts[KEYCODE_SLASH] = focusAtSearchField;
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
		const player = getPlayer();
		if (!player) {
			return;
		}
		player.jumpForward();
	}

	function skipBack() {
		const player = getPlayer();
		if (!player) {
			return;
		}
		player.jumpBack();
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

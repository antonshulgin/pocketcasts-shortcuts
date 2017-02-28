(function () {
	// jshint esnext: true
	'use strict';

	if (!isObject(angular)) {
		return;
	}

	const internals = {};

	setApp(findApp());
	if (!getApp()) {
		return;
	}

	initShortcuts();

	function dispatchShortcut(event) {
		if (areShortcutsDisabled()) {
			return;
		}
		const keyCode = event.keyCode;
		const shortcuts = getShortcuts();
		if (!shortcuts.hasOwnProperty(keyCode)) {
			return;
		}
		if (!isFunction(shortcuts[keyCode])) {
			return;
		}
		shortcuts[keyCode](event);
	}

	function getShortcuts() {
		return internals.shortcuts;
	}

	function initShortcuts() {
		const KEYCODE_J = 74;
		const KEYCODE_K = 75;
		const KEYCODE_L = 76;
		const KEYCODE_SLASH = 191;
		const shortcuts = {};
		shortcuts[KEYCODE_J] = skipBack;
		shortcuts[KEYCODE_K] = togglePlayback;
		shortcuts[KEYCODE_L] = skipForward;
		shortcuts[KEYCODE_SLASH] = focusAtSearchField;
		internals.shortcuts = shortcuts;
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
		const SELECTOR_SUBSCRIPTION_SEARCH = 'input[ng-model="search.title"]';

		const searchField = document.querySelector(SELECTOR_SUBSCRIPTION_SEARCH);
		if (!searchField) {
			return;
		}
		searchField.focus();
	}

	function togglePlayback(event) {
		console.log({
			togglePlayback: event
		});
	}

	function skipForward(event) {
		console.log({
			skipForward: event
		});
	}

	function skipBack(event) {
		console.log({
			skipBack: event
		});
	}

	function getApp() {
		return internals.app;
	}

	function setApp(app) {
		if (!hasScope(app)) {
			return;
		}
		internals.app = app.scope();
	}

	function findApp() {
		return angular.element(document.body);
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

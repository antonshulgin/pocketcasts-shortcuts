(function () {
	// jshint esnext: true
	'use strict';

	if (!isObject(angular)) {
		return;
	}

	const KEYCODE_J = 74;
	const KEYCODE_K = 75;
	const KEYCODE_L = 76;
	const KEYCODE_SLASH = 191;

	const internals = {};

	setApp(findApp());
	if (!getApp()) {
		return;
	}

	initShortcutHandlers();

	function dispatchShortcut(event) {
		const keyCode = event.keyCode;
		if (!hasShortcutHandler(keyCode)) {
			return;
		}
		const shortcutHandlers = getShortcutHandlers();
		shortcutHandlers[keyCode](event);
	}

	function hasShortcutHandler(keyCode) {
		if (!isNumber(keyCode)) {
			return;
		}
		const shortcutHandlers = getShortcutHandlers();
		return isObject(shortcutHandlers) &&
			shortcutHandlers.hasOwnProperty(keyCode) &&
			isFunction(shortcutHandlers[keyCode]);
	}

	function getShortcutHandlers() {
		return internals.shortcutHandlers;
	}

	function initShortcutHandlers() {
		const shortcutHandlers = {};
		shortcutHandlers[KEYCODE_J] = skipBack;
		shortcutHandlers[KEYCODE_K] = togglePlayback;
		shortcutHandlers[KEYCODE_L] = skipForward;
		shortcutHandlers[KEYCODE_SLASH] = focusAtSearchField;
		internals.shortcutHandlers = shortcutHandlers;
		window.addEventListener('keyup', dispatchShortcut, false);
	}

	function focusAtSearchField(event) {
		console.log({
			focusAtSearchField: event
		});
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

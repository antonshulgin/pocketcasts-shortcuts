(function () {
	// jshint esnext: true
	'use strict';

	window.addEventListener('load', getOutside, false);

	function getOutside() {
		const script = document.createElement('script');
		script.textContent = '(' + init.toString() +')(this)';
		document.body.appendChild(script);
	}

	function init(window) {
		const angular = window.angular;

		if (!isObject(angular)) {
			return;
		}

		const internals = {};

		setApp(findApp());
		if (!getApp()) {
			return;
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
	}

})();

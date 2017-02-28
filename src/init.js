(function () {
	// jshint esnext: true
	'use strict';

	window.addEventListener('load', init, false);

	function init() {
		const script = document.createElement('script');
		/* global chrome */
		script.src = chrome.extension.getURL('pocketcasts-shortcuts.js');
		document.body.appendChild(script);
	}

})();

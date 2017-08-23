(function(){

	'use strict';

	angular
		.module('i94')
		.config(function ($translateProvider) {
			$translateProvider.useStaticFilesLoader({
					prefix: 'app/data/i18n/',
				    suffix: '.json'
			});
			$translateProvider.preferredLanguage('en');
			$translateProvider.useSanitizeValueStrategy('sanitize');
		});
	
})();
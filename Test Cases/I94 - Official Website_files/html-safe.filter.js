(function(){

	'use strict';
	
	angular
	.module("i94")
	.filter('htmlsafe', ['$sce', function($sce) {
		return function(val) {
			return $sce.trustAsHtml(val);
		};
    }]);

})();
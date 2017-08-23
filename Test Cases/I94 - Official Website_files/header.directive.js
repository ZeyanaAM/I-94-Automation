(function(){
	
	'use strict';
	angular
	.module('i94')
	.directive('headerDirective', headerDirective);
	
	function headerDirective() {
		return {
		    restrict: 'EA',
		    templateUrl: 'app/components/common/header/header.html'
		};
	};
	
})();

(function(){
	
	'use strict';
	angular
	.module('i94')
	.directive('footerDirective', footerDirective);
	
	function footerDirective() {
		return {
		    restrict: 'EA',
		    templateUrl: 'app/components/common/footer/footer.html'
		};
	};
	
})();

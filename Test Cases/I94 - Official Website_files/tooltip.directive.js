
(function(){

	'use strict';
	angular
	.module('i94')
	.directive('tooltip', tooltipDirective);

	function tooltipDirective() {
		return {
			restrict: 'E',
			controller: 'TooltipController',
			controllerAs: 'tc',
			scope: {
				body: '=body'
			},
			replace: true,
			templateUrl: 'app/components/common/tooltip/tooltip.html'
		};
	};

})();

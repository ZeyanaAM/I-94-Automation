// DIRECTIVE ~ Progress Tracker
(function(){

	'use strict';
	angular
	.module('i94')
	.directive('progressTrackerDirective', progressTrackerDirective);

	function progressTrackerDirective() {
		return {
			restrict: 'EA',	
			controller: 'ProgressController',
			controllerAs: 'vm',
			scope: {
				currentStep: '='
			},
			templateUrl: 'app/components/common/progress/progress.html'
		};
	};
	
})();
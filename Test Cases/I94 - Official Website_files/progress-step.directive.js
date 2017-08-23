// DIRECTIVE ~ Progress Step
(function(){

	'use strict';
	angular
	.module('i94')
	.directive('progressStepDirective', progressStepDirective);

	function progressStepDirective() {
		return {
			restrict: 'EA',
			require: 'ngModel',
			controller: 'ProgressController',
			controllerAs: 'vm',
			scope: {
				currentStep: '=ngModel',
				stepLabel: '@',
				stepPosition: '@'
			},
			link: initTracker,
			templateUrl: 'app/components/common/progress/progress-step.html'
		};
	};

	function initTracker(scope, element, attributes) {
		scope.adjustStep = parseInt(attributes.stepIndex) + 1;

		scope.$watch('currentStep', function() {
			updateStyle();
		}, true);

		function updateStyle() {
			if (attributes.stepIndex == scope.currentStep) {
				scope.statusClass =  "current";
			};

			if (scope.currentStep == 0 && attributes.stepIndex != scope.currentStep) {
				scope.statusClass = "";
			};

			if (scope.currentStep > attributes.stepIndex) {
				scope.adjustStep = '<span class="fa fa-check"></span>';
				scope.statusClass = "done";

				if (attributes.stepIndex == (scope.currentStep - 1)) {
					scope.statusClass += " current-bar previous";
				} else {
					scope.statusClass += " done-bar";
				}
			};
		};
	};

})();

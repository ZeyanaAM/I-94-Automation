// DIRECTIVE ~ FAQ Panel
(function(){

	'use strict';
	angular
	.module('i94')
	.directive('faqPanelContainerDirective', faqPanelContainerDirective);

	function faqPanelContainerDirective() {
		return {
			restrict: 'EA',
			replace: true,
			scope: {
				section: '@'
			},
			templateUrl: 'app/components/common/faq-panel/faq-panel-container.html'
		}
	}

})();
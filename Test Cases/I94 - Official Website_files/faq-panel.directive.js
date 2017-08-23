// DIRECTIVE ~ FAQ Panel
(function(){

	'use strict';
	angular
	.module('i94')
	.directive('faqPanelDirective', faqPanelDirective);

	function faqPanelDirective() {
		return {
			restrict: 'EA',
			replace: true,
			controller: 'FAQPanelController',
			controllerAs: 'vm',
			scope: {
				panelTitle: '@',
				panelContent: '@'
			},
			templateUrl: 'app/components/common/faq-panel/faq-panel.html'
		}
	}

})();
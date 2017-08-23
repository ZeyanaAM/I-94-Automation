/**
 * Security of data, privacy, and consent to monitoring
 */

(function(){

	'use strict';
	angular
	.module('i94')
	.controller('FaqModalController', FaqModalController);

	FaqModalController.$inject = ['$log', '$rootScope', '$state', '$uibModalInstance', '$location', '$anchorScroll', 'title', 'content'];

	function FaqModalController($log, $rootScope, $state, $uibModalInstance, $location, $anchorScroll, title, content) {

		var vm = this;

		vm.title = title;
		vm.content = content;

		vm.cancelClick = cancelClick;
		vm.cancelKeypress = cancelKeypress;

		// scope passing in state to go to on ok

		init();

		function init(){
			//
		}

		// event handlers for keyboard and mouse
		function cancelClick(event){
			event.preventDefault();
			cancel();
		}
		function cancelKeypress(event){
			if(event.which==13 || event.which==32){
				event.preventDefault();
				cancel();
			}
		}

		// methods to execute
		function cancel(event){
			// Scroll to top
			$location.hash('section');
			$anchorScroll();

			$uibModalInstance.close();
		}

	};

})();

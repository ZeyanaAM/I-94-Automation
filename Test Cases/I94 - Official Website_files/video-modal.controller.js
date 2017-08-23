/**
 * Security of data, privacy, and consent to monitoring
 */

(function(){

	'use strict';
	angular
	.module('i94')
	.controller('VideoModalController', VideoModalController);

	VideoModalController.$inject = ['$log', '$rootScope', '$state', '$uibModalInstance', '$location', '$anchorScroll'];

	function VideoModalController($log, $rootScope, $state, $uibModalInstance, $location, $anchorScroll) {

		var vm = this;

		vm.cancelClick = cancelClick;
		vm.cancelKeypress = cancelKeypress;
		vm.okClick = okClick;
		vm.okKeypress = okKeypress;

		// scope passing in state to go to on ok

		init();

		function init(){

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

		function okClick(event){
			event.preventDefault();
			ok();
		}

		function okKeypress(event){
			if(event.which==13 || event.which==32){
				event.preventDefault();
				ok();
			}
		}

		// methods to execute
		function cancel(event){
			// Scroll to top
			$location.hash('refreshRegion');
			$anchorScroll();

			$uibModalInstance.close();
		}

		function ok(event){
			// Scroll to top
			$location.hash('refreshRegion');
			$anchorScroll();

			$uibModalInstance.close();
		}

	};

})();

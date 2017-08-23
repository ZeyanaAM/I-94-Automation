/**
 * Security of data, privacy, and consent to monitoring
 */

(function(){

	'use strict';
	angular
	.module('i94')
	.controller('ErrorModalController', ErrorModalController);

	ErrorModalController.$inject = ['$log', '$rootScope', '$state', '$uibModalInstance', '$location', '$anchorScroll', 'title', 'content'];

	function ErrorModalController($log, $rootScope, $state, $uibModalInstance, $location, $anchorScroll, title, content) {

		var vm = this;

		vm.title = title;
		vm.content = content;

		vm.okClick = okClick;
		vm.okKeypress = okKeypress;

		// scope passing in state to go to on ok

		init();

		function init(){

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

		function ok(event){
			// Scroll to top
			$location.hash('section');
			$anchorScroll();

			$uibModalInstance.close();
		}

	};

})();

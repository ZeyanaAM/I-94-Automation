/**
 * Sample - Border Crossing Card
 */

(function(){

	'use strict';
	angular
	.module('i94')
	.controller('BCCModalController', BCCModalController);

	BCCModalController.$inject = ['$uibModalInstance'];

	function BCCModalController($uibModalInstance) {

		var vm = this;

		vm.cancelClick = cancelClick;
		vm.cancelKeypress = cancelKeypress;

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

		// methods to execute
		function cancel(event){
			$uibModalInstance.close();
		}

	};

})();

/** 
 * Security of data, privacy, and consent to monitoring
 */

(function(){
	
	'use strict';
	angular
	.module('i94')
	.controller('SecurityModalController', SecurityModalController);
	
	SecurityModalController.$inject = ['$log', '$rootScope', '$state', '$uibModalInstance', 'destination', 'securityNotificationService', '$uibModal'];
	
	function SecurityModalController($log, $rootScope, $state, $uibModalInstance, destination, securityNotificationService, $uibModal) {
		
		var vm = this;
		
		var stateTarget = destination;
		
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
			$uibModalInstance.close();
			openModal("ERROR.DECLINE", "ERROR_MODAL.DECLINE_I94_TERMS");

		}
		
		function ok(event){
			securityNotificationService.recordNotified();
			$state.go(stateTarget);
			$uibModalInstance.close();
		}
		
		function openModal(title, content) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/error/error-modal.html',
				controller: 'ErrorModalController',
				controllerAs: 'vm',
				size: 'md',
				resolve: {
					title: function() {
						return title;
					},
					content: function() {
						return content;
					}
				}
			});
		}		
		
	};
	
})();
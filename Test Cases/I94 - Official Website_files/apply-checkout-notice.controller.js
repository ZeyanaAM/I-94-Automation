(function(){
	
	'use strict';
	angular.module('i94').controller('ApplyCheckoutNoticeController', ApplyCheckoutNoticeController);
	
	ApplyCheckoutNoticeController.$inject = ['$translate', 'applicationService', '$uibModal'];
	
	function ApplyCheckoutNoticeController($translate, applicationService, $uibModal) {
		
		var vm = this;
		vm.cost = 6;

		vm.onSubmit = onSubmit;
		vm.onCancel = onCancel;
		
		function onSubmit(){
			
			// validate
			if (vm.form.$valid) {
				var nonRefundable = vm.document.nonRefundable; 
				applicationService.setStepFinished('apply-checkout-notice', nonRefundable);
				applicationService.requestNextStep();
			}
			else {
				openModal("ERROR.ERROR", "ERROR_MODAL.FIELDS_DO_NOT_MEET_CRITERIA");
			}
			
		}
		
		function onCancel(){
			// todo: 
			// modal saying all entered data will be lost, continue? 
			applicationService.cancel();
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
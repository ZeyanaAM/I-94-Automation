(function(){
	
	'use strict';
	angular.module('i94').controller('ApplyCheckoutPayController', ApplyCheckoutPayController);
	
	ApplyCheckoutPayController.$inject = ['$translate', 'applicationService', '$window', '$uibModal', '$log'];
	
	function ApplyCheckoutPayController($translate, applicationService, $window, $uibModal, $log) {
		
		var vm = this;
		vm.trackingId = applicationService.getApplicationStatus().trackingId;
		vm.paymentAmount = applicationService.getApplicationPayment().amount;
		vm.paymentMethod = applicationService.getApplicationPayment().type;

		vm.onSubmit = onSubmit;
		vm.onCancel = onCancel;
		vm.onPreviousButton = onPreviousButton;
		
		
		// Call the payment rest controller on the backend to initiate payment 
		// ui -> i94 backend -> payment service -> pay.gov -> pay pal / credit card 
		// Amount and language hardcoded.
		function pay (data) {
			//$window.location.href='services/app/payment/6';
			$window.location.href=data;

		}
		
		function onPreviousButton(){
			applicationService.setPreviousButtonSteps('apply-checkout-pay', vm.document.chargeAuthorization);
		}
		
    //Prod onSubmit()
	function onSubmit(){
		// validate
		if (vm.form.$valid) {
			var chargeAuthorization = vm.document.chargeAuthorization; 
			if(chargeAuthorization == true){
				
				applicationService.makePayment(vm.document).then(success, failed);
			
				function success(data){
					if(data == 'PAYMENT_NOT_AVAILABLE'){
						openModal("ERROR.ERROR", "ERROR_MODAL.PAYMENT_NOT_AVAILABLE");
					}else if(data != 'error'){
						applicationService.setStepFinished('apply-checkout-pay', chargeAuthorization);
						applicationService.requestNextStep();
						pay(data);
					}else {
						openModal("ERROR.ERROR", "ERROR_MODAL.PROCESSING_REQUEST");
					}
				}
				
				function failed(data){
					$log.error("data back", data);
					openModal("ERROR.ERROR", "ERROR_MODAL.PROCESSING_REQUEST");
				}
			} else {
				openModal("ERROR.ERROR", "ERROR_MODAL.AGREE_TO_PAY");
			}
			
		}
		else {
			openModal("ERROR.ERROR", "ERROR_MODAL.FIELDS_DO_NOT_MEET_CRITERIA");
		}
	}
	
		
	/*
		//Developer testing onSubmit() without Payment services
		function onSubmit(){
			// validate
			if (vm.form.$valid) {
				var chargeAuthorization = vm.document.chargeAuthorization; 
				if(chargeAuthorization == true){
					
					applicationService.testSubmitApplicationAndPay(vm.document).then(success, failed);
				
					function success(data){
						if(data==true){
							applicationService.setStepFinished('apply-checkout-pay', chargeAuthorization);
							applicationService.requestNextStep();
							openModal("TESTING", "Developer test submitted");
						}else if(data=="INSERT_ERROR") {
							openModal("ERROR.ERROR", "ERROR_MODAL.CREATE_SERVICE_PROBLEM");
						}else {
							openModal("ERROR.ERROR", "ERROR_MODAL.PROCESSING_REQUEST");
						}
					}
					
					function failed(data){
						$log.error("data back", data);
						openModal("ERROR.ERROR", "ERROR_MODAL.PROCESSING_REQUEST");
					}
				} else {
					openModal("ERROR.ERROR", "ERROR_MODAL.AGREE_TO_PAY");
				}
				
			}
			else {
				openModal("ERROR.ERROR", "ERROR_MODAL.FIELDS_DO_NOT_MEET_CRITERIA");
			}
		}
		*/
		
		function onCancel(){
			openCancelModal('APPLY');
		}

		function openCancelModal(pageToCancel) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/cancel/cancel-modal.html',
				controller: 'CancelModalController',
				controllerAs: 'vm',
				size: 'md',
				resolve: {
					pageToCancel: function() {
						return pageToCancel;
					}
				}
			});
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
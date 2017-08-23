(function(){
	
	'use strict';
	angular.module('i94').controller('ApplyCheckoutMethodController', ApplyCheckoutMethodController);
	
	ApplyCheckoutMethodController.$inject = ['$translate', 'applicationService'];
	
	function ApplyCheckoutMethodController($translate, applicationService) {
		
		var vm = this;
		vm.cost = 6;
		vm.document = {};

		vm.paymentStates = {
			paypal: false,
			credit: false,
		}

		vm.onSubmit = onSubmit;
		vm.onCancel = onCancel;
		vm.updatePaymentType = updatePaymentType;
		vm.onKeyPressUpdatePaymentType = onKeyPressUpdatePaymentType;
		
		function onSubmit() {
			// validate
			if (vm.form.$valid) {
				applicationService.setStepFinished('apply-checkout-method', vm.document.paymentType);
				applicationService.requestNextStep();
			}
			else {
				// todo: modal instead
				alert("Fields do not meet valid criteria, please apply changes to continue");
			}
		}
		
		function onCancel() {
			// todo: 
			// modal saying all entered data will be lost, continue? 
			applicationService.cancel();
		}
		
		function updatePaymentType(type) {
			for (var state in vm.paymentStates) {
				vm.paymentStates[state] = false;
			}

			vm.paymentStates[type] = true;
			vm.form.paymentType = type;
			vm.document.paymentType = type;
		}
		
		function onKeyPressUpdatePaymentType(type, event){
			if(event.which == 13 || event.which == 32){
				
				if(type == "credit" || type == "paypal"){
					event.preventDefault();
					updatePaymentType(type);
				} 
				
			}
		}
		
	};
	
})();
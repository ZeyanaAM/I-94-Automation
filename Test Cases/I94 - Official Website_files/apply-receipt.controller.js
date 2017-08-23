(function(){
	
	'use strict';
	angular.module('i94').controller('ApplyReceiptController', ApplyReceiptController);
	
	ApplyReceiptController.$inject = ['$translate', 'applicationService', '$stateParams'];
	
	function ApplyReceiptController($translate, applicationService, $stateParams) {
		
		var vm = this;
		
		var receipt = angular.copy(applicationService.getApplicationReceipt());
		
		/*vm.createDate = receipt.paymentCreatedDate;
		vm.completedDate = receipt.paymentCompletedDate;
		vm.trackingId = receipt.paymentTrackingId;
		vm.paymentType = receipt.paymentType;
		vm.paymentStatus = receipt.paymentStatus;
		vm.paymentName = receipt.payerName;
		vm.totalCost = receipt.totalCost;
		*/
		
		vm.completedDate =  $stateParams.paymentDate;
		vm.paymentType = "Credit Card or PayPal";
		vm.paymentStatus = "Approved";
		vm.trackingId =  $stateParams.trackingId;
		vm.applicantName = $stateParams.applicantName;
		vm.totalCost = 6;
		
		applicationService.reset(); // done now

		vm.onPrint = onPrint;
		
		function onPrint(event){
			event.preventDefault();
			window.print();
		}
		
	};
	
})();
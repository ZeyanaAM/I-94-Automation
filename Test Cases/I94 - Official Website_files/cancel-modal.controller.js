(function(){
	
	'use strict';
	angular
	.module('i94')
	.controller('CancelModalController', CancelModalController);
	
	CancelModalController.$inject = ['$log', '$rootScope', '$uibModalInstance', '$location', '$anchorScroll', 'applicationService', 'historySearchService', 'pageToCancel'];
	
	function CancelModalController($log, $rootScope, $uibModalInstance, $location, $anchorScroll, applicationService, historySearchService, pageToCancel) {
		
		var vm = this;
		vm.pageToCancel = pageToCancel;
		
		vm.onClickCancelYes= onClickCancelYes;
		vm.onClickCancelNo = onClickCancelNo;
		vm.onKeypressCancelYes = onKeypressCancelYes;
		vm.onKeypressCancelNo = onKeypressCancelNo;
		
		
		function onClickCancelYes(event){
			event.preventDefault();
			if(vm.pageToCancel == 'APPLY'){
				applicationService.cancel();
			}else if(vm.pageToCancel == 'SEARCH') {
				historySearchService.cancel();	
			}else{
				historySearchService.cancel();	
				applicationService.cancel();
			}
			
			closeModal(event);
		}
		
		function onClickCancelNo(event){
			event.preventDefault();
			closeModal(event);
		}	
		
		function onKeypressCancelNo(event){
			if(event.which==13 || event.which==32){  //detect return/enter key
				event.preventDefault();
				closeModal(event);
			}
		}

		function onKeypressCancelYes(event){
			if(event.which==13 || event.which==32){  //detect return/enter key
				event.preventDefault();
				if(vm.pageToCancel == 'APPLY'){
					applicationService.cancel();
				}else if(vm.pageToCancel == 'SEARCH') {
					historySearchService.cancel();	
				}else{
					historySearchService.cancel();	
					applicationService.cancel();
				}
				
				closeModal(event);
			}
		}
		
		function closeModal(event){
			// Scroll to top
			$location.hash('section');
			$anchorScroll();

			$uibModalInstance.close();
		}
		
	};
	
})();
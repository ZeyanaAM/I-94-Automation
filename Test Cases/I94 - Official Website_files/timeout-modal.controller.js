(function(){
	
	'use strict';
	angular
	.module('i94')
	.controller('TimeoutModalController', TimeoutModalController);
	
	TimeoutModalController.$inject = ['$log', '$rootScope', '$uibModalInstance', 'securityTimeoutService'];
	
	function TimeoutModalController($log, $rootScope, $uibModalInstance, securityTimeoutService) {
		
		var vm = this;
		vm.secondsRemaining = securityTimeoutService.getCountDownTotal();
		
		vm.exit = exit;
		vm.renew = renew;
		
		init();
		
		function init(){
			$rootScope.$on(securityTimeoutService.SECURITY_TIMEOUT_STOP, onSecurityStop); 
			$rootScope.$on(securityTimeoutService.SECURITY_TIMEOUT_WARNING_INTERVAL, onSecurityWarningInterval); 
		}
		
		function onSecurityStop(){
			$log.log("TimeoutModalController onSecurityStop");
			$uibModalInstance.close();
		}
		
		function onSecurityWarningInterval(event, count){
			vm.secondsRemaining = count;
		}
		
		function exit(event){
			securityTimeoutService.finish();
			$uibModalInstance.close();
		}
		
		function renew(event){
			securityTimeoutService.renew();
			$uibModalInstance.close();
		}
		
	};
	
})();
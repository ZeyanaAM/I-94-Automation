(function(){
	
	'use strict';
	angular
	.module('i94')
	.controller('MainController', MainController);
	
	MainController.$inject = ['$log', 'cssDisabledService', '$uibModal', '$rootScope', 'securityTimeoutService'];
	
	function MainController($log, cssDisabledService, $uibModal, $rootScope, securityTimeoutService) {
		
		var main = this;
		
		init();
		
		function init(){
			//$log.log($rootScope);
			$rootScope.$on(cssDisabledService.STYLES_DISABLED, onStylesDisabled); // debug binding
			$rootScope.$on(cssDisabledService.STYLES_ENABLED, onStylesEnabled); // debug binding
			$rootScope.$on(securityTimeoutService.SECURITY_TIMEOUT_WARNING, onSecurityWarning);  
		}
		
		function onStylesEnabled(event){
			$log.log("onStylesEnabled from main controller");
		}

		function onStylesDisabled(event){
			$log.log("onStylesDisabled from main controller");
		}
		
		function onSecurityWarning(){
			
			$log.log("MainController onSecurityWarning");
			
			$uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/timeout/timeout-modal.html',
				controller: 'TimeoutModalController',
				controllerAs: 'vm',
				backdrop: 'static',
				size: 'md'
			});
			
		}
		
	};
	
})();
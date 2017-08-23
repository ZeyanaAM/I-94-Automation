(function(){
	'use strict';
	angular
		.module('i94')
		.service('securityNotificationService', securityNotificationService);
		
			securityNotificationService.$inject = ['$log'];
			
			function securityNotificationService($log){
				
				var service = this;
				
				var notified = false;
				
				service.didNotify = didNotify;
				service.recordNotified = recordNotified;
				
				function recordNotified(){
					notified = true;
				}
				
				function didNotify(){
					return notified;
				}
				
			}
})();
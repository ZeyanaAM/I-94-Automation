(function(){
	'use strict';
	angular
		.module('i94')
		.service('securityTimeoutService', securityTimeoutService);
		
			securityTimeoutService.$inject = ['$log', '$state', '$rootScope', '$timeout', '$interval', 'applicationService', 'historySearchService'];
			
			function securityTimeoutService($log, $state, $rootScope, $timeout, $interval, applicationService, historySearchService){
				
				var instance = this;
				
				instance.SECURITY_TIMEOUT_START = "securityTimeoutStart";
				instance.SECURITY_TIMEOUT_WARNING = "securityTimeoutWarning";
				instance.SECURITY_TIMEOUT_WARNING_INTERVAL = "securityTimeoutWarningInterval";
				instance.SECURITY_TIMEOUT_STOP = "securityTimeoutStop";
				
				var isCountingDown = false;
				
				var timeFromStartToWarning = 1000 * 60 * 15; // 15 minutes
				
				// once in warning, values
				var intervalWarningSpacing = 1000; // 1 second
				var intervalWarningCount = 20; // 20 seconds

				var countDownTotal = 20;
				
				var countDownValueFromWarning = countDownTotal;
				
				// promises for timers/intervals
				var timeoutFromStartToWarningPromise = null;
				var intervalFromWarningToFinishPromise = null;
				
				// public methods
				instance.getCountDownTotal = getCountDownTotal;
				//instance.getCountDownTotal = getCountDownTotal;
				instance.renew = renew;
				instance.finish = finish;
				
				init();
				
				function init(){
					
					// listen for certain state changes to start the countdown or cancel it
					$rootScope.$on('$stateChangeStart', onURLStateChange);
					
				}
				
				function getCountDownTotal(){
					return countDownTotal;
				}
				
				function start(){
					
					stop();
					
					isCountingDown = true;
					
					timeoutFromStartToWarningPromise = $timeout(onTimeoutFromStartToWarning, timeFromStartToWarning);
					$rootScope.$emit(instance.SECURITY_TIMEOUT_START);
					
				}
				
				function onTimeoutFromStartToWarning(){
					$rootScope.$emit(instance.SECURITY_TIMEOUT_WARNING);
					countDownValueFromWarning = countDownTotal;
					intervalFromWarningToFinishPromise = $interval(emitWarningCountdownInterval, intervalWarningSpacing, countDownTotal);
				}
				
				function emitWarningCountdownInterval(){
					countDownValueFromWarning--;
					$rootScope.$emit(instance.SECURITY_TIMEOUT_WARNING_INTERVAL, countDownValueFromWarning);
					$log.log("countDownValueFromWarning", countDownValueFromWarning);
					if(countDownValueFromWarning == 0){
						onTimeoutFinish();
					}
				}
				
				function stop(){
					
					isCountingDown = false;
					
					if(timeoutFromStartToWarningPromise){
						$timeout.cancel(timeoutFromStartToWarningPromise);
						timeoutFromStartToWarningPromise = null;
					}
					
					if(intervalFromWarningToFinishPromise){
						$interval.cancel(intervalFromWarningToFinishPromise);
						intervalFromWarningToFinishPromise = null;
					}
					
					$rootScope.$emit(instance.SECURITY_TIMEOUT_STOP);
					
				}
				
				function onURLStateChange(event, toState, toParams, fromState, fromParams){
					
					if(isTimeoutForState('home', toState.name)){
						if(isCountingDown){
							applicationService.reset();
							historySearchService.reset();
							stop();
						}
					} 
					
					if(isTimeoutForState('apply', toState.name)){
						start();
					}
					
					if(isTimeoutForState('recent', toState.name)){
						start();
					}
					
					if(isTimeoutForState('history', toState.name)){
						start();
					}
					
					if(isTimeoutForState('faq', toState.name)){
						if(isCountingDown){
							applicationService.reset();
							historySearchService.reset();
							stop();
						}
					}
					
					if(isTimeoutForState('compliance-results', toState.name)){
						start();
					}

					if(isTimeoutForState('compliance', toState.name)){
						start();
					}
						
				}
				
				function isTimeoutForState(navItem, toState){
					
					if(navItem == "home" && (toState == 'home' || toState == '')){
						return true;
					} else if(navItem == "apply" && (toState == 'apply-document'
						  || toState == 'apply-traveler'
						  || toState == 'apply-checkout-notice'
						  || toState == 'apply-checkout-method'
						  || toState == 'apply-checkout-pay'
						  || toState == 'apply-receipt')){
						return true;
					} else if(navItem == "recent" && (toState == 'recent'
						|| toState == 'recent-results')) {
						return true;
					} else if(navItem == "history" && (toState == 'history'
						|| toState == 'history-results')) {
						return true;
					} else if(navItem == "compliance" && (toState == 'compliance'
						|| toState == 'compliance-results')) {
						return true;
					} else if(navItem == "faq" && toState == 'faq') {
						return true;
					}
					
				}
				
				// gets called from UI element when requesting more time
				function renew(){
					start();
				}
				
				// gets called from UI element when exiting before the countdown
				function finish(){
					onTimeoutFinish();
				}
				
				function onTimeoutFinish(){
					
					stop();
					
					// clear out front-end memory
					applicationService.reset();
					historySearchService.reset();
					
					$log.log("onTimeoutFinish");
					$state.go("home");
					
				}
				
			}
})();
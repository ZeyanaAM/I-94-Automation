(function(){

	'use strict';

	angular
		.module('i94')
		.run(function($rootScope, $log, applicationService, historySearchService, securityNotificationService, $uibModal) { // instance-injector
			// also see main controller for timeout
			$rootScope.$on('$stateChangeStart',
				function(event, toState, toParams, fromState, fromParams){
					
				$log.info("security didNotify = " + securityNotificationService.didNotify() );
				
					if((toState.name == 'apply-document' || toState.name == 'recent' || toState.name == 'history') 
							&& securityNotificationService.didNotify() == false){
						
						event.preventDefault();
						showSecurityWarning(toState.name);
						
					}
					
					//reset application state when user clicks apply for new I-94
					if(toState.name == 'apply-document'){
						if( toParams.previous != true){ //do not reset page values when previous button is clicked
						applicationService.reset();
					}
					}
					

					if(toState.name == 'apply-traveler'
						|| toState.name == 'apply-checkout-notice'
						|| toState.name == 'apply-checkout-method'
						|| toState.name == 'apply-checkout-pay'){
						if(applicationService.getStepStarted(toState.name) == false){
							// if the application process hasn't started
							// through the service properly then prevent the
							// url change. 
							event.preventDefault();
						}
						
					} 
					
					
					if(toState.name == 'history-results' || toState.name == 'recent-results'){
						
						if(historySearchService.isReady(toState.name) == false){
							// if the search process hasn't finished
							// then prevent the url change. 
							event.preventDefault();
						}	
					} 
					
				});
			
			function showSecurityWarning(destination){
					
				$uibModal.open({
					animation: true,
					templateUrl: 'app/components/common/modals/security/security-modal.html',
					controller: 'SecurityModalController',
					controllerAs: 'vm',
					size: 'lg', 
					resolve: {
						destination: function () {
						  return destination;
						}
					}
				});
				
			}
			
		})
		.config(function($stateProvider, $urlRouterProvider) {
			
			$urlRouterProvider.otherwise('/home');
			
			$stateProvider
				.state('home', {
					url : '/home',
				    templateUrl: 'app/components/pages/home/home.html',
				    controller: 'HomeController',
				    controllerAs: 'vm'
				})
				.state('apply-document', {
					url : '/apply-document',
				    params: {                 
				        previous: false,  //default value
				        squash: false  //set squash to false, to force injecting even the default value into url
				      },					
				    templateUrl: 'app/components/pages/apply/apply-document.html',
				    controller: 'ApplyDocumentController',
				    controllerAs: 'vm'
				})
				.state('apply-traveler', {
					url : '/apply-traveler',
				    templateUrl: 'app/components/pages/apply/apply-traveler.html',
				    controller: 'ApplyTravelerController',
				    controllerAs: 'vm'
				})
				.state('apply-checkout-notice', {
					url : '/apply-checkout-notice',
				    templateUrl: 'app/components/pages/apply/checkout/apply-checkout-notice.html',
				    controller: 'ApplyCheckoutNoticeController',
				    controllerAs: 'vm'
				})
				.state('apply-checkout-method', {
					url : '/apply-checkout-method',
				    templateUrl: 'app/components/pages/apply/checkout/apply-checkout-method.html',
				    controller: 'ApplyCheckoutMethodController',
				    controllerAs: 'vm'
				})
				.state('apply-checkout-pay', {
					url : '/apply-checkout-pay',
				    templateUrl: 'app/components/pages/apply/checkout/apply-checkout-pay.html',
				    controller: 'ApplyCheckoutPayController',
				    controllerAs: 'vm'
				})
				.state('apply-receipt', {
					url : '/apply-receipt?trackingId&paymentDate&applicantName',
				    templateUrl: 'app/components/pages/apply/apply-receipt.html',
				    controller: 'ApplyReceiptController',
				    controllerAs: 'vm'
				})
				.state('recent', {
					url : '/recent-search',
				    params: {                 //PINF-459
				        from: null ,
				        errorMsg:null
				      },				    
				    templateUrl: 'app/components/pages/history/search.html',
				    controller: 'RecentController',
				    controllerAs: 'vm'
				})
				.state('recent-results', {
					url : '/recent-results',
				    templateUrl: 'app/components/pages/history/recent-results.html',
				    controller: 'RecentResultsController',
				    controllerAs: 'vm'
				})
				.state('history', {
					url : '/history-search',
				    params: {                 //PINF-459
				        from: null,
				        errorMsg:null
				      },				    
				    templateUrl: 'app/components/pages/history/search.html',
				    controller: 'HistoryController',
				    controllerAs: 'vm'
				})
				.state('history-results', {
					url : '/history-results',
				    templateUrl: 'app/components/pages/history/history-results.html',
				    controller: 'HistoryResultsController',
				    controllerAs: 'vm'
				})
				.state('apply-payment-failure', {
					url : '/apply-payment-failure',
				    templateUrl: 'app/components/pages/apply/apply-payment-failure.html',
				    controller: 'ApplyPaymentFailureController',
				    controllerAs: 'vm'
				})		
				.state('apply-payment-cancel', {
					url : '/apply-payment-cancel',
				    templateUrl: 'app/components/pages/home/home.html',
				    controller: 'ApplyPaymentCancelController',
				    controllerAs: 'vm'
				})								
				.state('faq', {
					url : '/faq',
				    templateUrl: 'app/components/pages/faq/faq.html',
				    controller: 'FaqController',
				    controllerAs: 'vm'
				})
				.state('compliance', {
					url : '/compliance-search',
				    params: {                 //PINF-622
				        from: null
				      },				    
				    templateUrl: 'app/components/pages/history/search.html',
				    controller: 'SearchComplianceController',
				    controllerAs: 'vm'
				})
				.state('compliance-results', {
					url : '/compliance-results',
				    templateUrl: 'app/components/pages/history/compliance-results.html',
				    controller: 'ComplianceResultsController',
				    controllerAs: 'vm'
				});
		});
	
})();
(function(){
	'use strict';
	angular
		.module('i94')
		.service('faqService', faqService);
		
			faqService.$inject = ['$http', '$log'];
			
			function faqService($http, $log){
				
				this.getFaqs = function(lang){
					
					return $http.get('app/data/i18n/faq-'+lang+'.json')
						.then(function(response){
							return response.data;
						})
						.catch(function(error){
							$log.error("ERROR :", error.status);
							return "error";
						});
				};
				
			}
})();
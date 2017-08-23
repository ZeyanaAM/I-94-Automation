(function(){
	'use strict';
	angular
		.module('i94')
		.service('cancelFOIAService', cancelFOIAService);
		
			cancelFOIAService.$inject = ['$http', '$log', '$rootScope', '$state', 'historySearchService'];
			
			function cancelFOIAService($http, $log, $rootScope, $state, historySearchService){
				
				var service = this;
				
				var data = {};
				data.message = "";
				data.success = false;
				
				service.sendRequest = sendRequest;
				
				function sendRequest(foiaNumber){
					
					// prepare data to send
					
					//PINF-385
					var postData = historySearchService.getSearchData();
					postData.foiaNumber = foiaNumber;
					
					var dataSerialized = angular.toJson(postData);
					
					$rootScope.$emit("httpRequestStart");
					 
					return $http.post('services/app/search/history', dataSerialized)
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
/*	arsalan						if(typeof response.data.success !== 'undefined')
							{  

								data.success = response.data.success;
								data.message = response.data.message;
								
								return data;
								
							} else
							{
								$log.error("response.data.success undefined, bad server response");
								return data;
							}*/

						})
						.catch(function(error){
							
							$rootScope.$emit("httpRequestEnd");
							$log.error('ERROR:', error.status);
							data.message = "Server error, "+error.status;
							
					});
					
					
				}
				
			}
})();
(function(){
	'use strict';
	angular
		.module('i94')
		.service('historySearchService', historySearchService);
		
			historySearchService.$inject = ['$http', '$log', '$rootScope', '$state'];
			
			
			
			function historySearchService($http, $log, $rootScope, $state){
				
				var results = {};
				results.sysError= false;
				results.recentSysError= false;
				var searchData = {};
				var expDateResult = {};
				var recent_search=false;
				
				this.searchRecent = searchRecent;
				this.searchHistory = searchHistory;
				this.searchOverstayCompliance = searchOverstayCompliance;
				this.requestResults = requestResults;
				this.searchForRecentFromHistoryResults = searchForRecentFromHistoryResults;
				this.getResults = getResults;
				this.getExpDateResult = getExpDateResult;
				this.cancel = cancel;
				this.isReady = isReady;
				this.reset = reset;
				this.getExpirationDate=getExpirationDate;
				this.getSearchData=getSearchData;   //PINF-385
				
				
				var states = {};
				states["history-results"] = {state: 'history-results', started: false};
				states["recent-results"] = {state: 'recent-results', started: false};
                //PINF-387
				states["history"] = {state: 'history', started: false};
				states["recent"] = {state: 'recent', started: false};
							
				
				function searchOverstayCompliance(formData){
	
					searchData = formData;
					var dataSerialized = angular.toJson(formData);
					
					$rootScope.$emit("httpRequestStart");
					
					return $http.post('services/app/v1.0/violation', dataSerialized)      
						.then(function(response){  
	
							$rootScope.$emit("httpRequestEnd");						
							results = response.data;	
						     if (results.message == "USER_NOT_FOUND")
						     {
						    	    formData.hasError=true;
//									formData.errorMsg="User " + formData.firstName.toUpperCase() + " " + formData.lastName.toUpperCase() + " is not found";
									formData.errorMsg="No record found for traveler.";
							  }
						      else if(results.message == "MULTIPLE_PERSON_RESULT") 
						      {
						    	    formData.hasError=true;
//									formData.errorMsg="Information not available for user " + formData.firstName.toUpperCase() + " " + formData.lastName.toUpperCase();
									formData.errorMsg="No record found for traveler.";
						      }
						      else if (results.error != null && results.error != "") //error message
						      {
						    	  formData.hasError=true; 
						    	  formData.errorMsg=results.error;
							  }
								
							
						     
							return true; // could be empty but will reveal on results page
							
						})
						.catch(function(error){
							$rootScope.$emit("httpRequestEnd");
							$log.error('ERROR:', error.status);
							return false;
						});
				}
				
				function getExpirationDate(){
					
					$rootScope.$emit("httpRequestStart");
					
					return $http.get('services/app/OMBDate')      
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
							if(typeof response.data !== 'undefined'){
								expDateResult = response.data;
							   return true;
							}else{
								return false;
							}
							
						})
						.catch(function(error){
							$rootScope.$emit("httpRequestEnd");
							$log.error('ERROR:', error.status);
							return false;
						});
					
				}

				
				
				
				function getExpDateResult(){
					return expDateResult;
				}
				
				function getResults(){
					return results;
				}
				
				function searchRecent(formData){
					recent_search=true;
					searchData = formData;
					var dataSerialized = angular.toJson(formData);
					
					$rootScope.$emit("httpRequestStart");
					
					return $http.post('services/app/search/recent', dataSerialized)      
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
/*	arsalan						if(typeof response.data.success === 'undefined'){
								return false;
							}
*/							
							results = response.data;
							
							//PINF-387
							if(results.dob != null)
								states["recent-results"].started = true;
							else
							{	
//							  alert("recent error returned =" + results.error);
							  if (results.error != null)
							  {
								formData.errorMsg=results.error;
								results.recentSysError=true;
							  }
							  else
							    formData.errorMsg="No record found for traveler.";
							
							  states["recent"].started = true;
							  states["history-results"].started=false;
							  states["recent-results"].started=false;
							}							
							
							return true; // could be empty but will reveal on results page
							
						})
						.catch(function(error){
							$rootScope.$emit("httpRequestEnd");
							$log.error('ERROR:', error.status);
							return false;
						});
					
				}
				
				function searchForRecentFromHistoryResults(){
					
					recent_search=true;
					var dataSerialized = angular.toJson(searchData);
					
					reset();
					
					$rootScope.$emit("httpRequestStart");
					
					return $http.post('services/app/search/recent', dataSerialized)
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
/*	arsalan						if(typeof response.data.success === 'undefined'){
								return false;
							}*/
							
							results = response.data;
							if (results.i94Number != null && results.i94Number != "")
							{
								states["recent-results"].started = true;
							}
							else
							{
								if (results.error != null)
								{
								  results.recentSysError=true;
								}
//								alert("states['recent-results'].started="+states["recent-results"].started);
								states["recent-results"].started = false;
							}
							
							
							
							return true; // could be empty but will reveal on results page
							
						})
						.catch(function(error){
							$rootScope.$emit("httpRequestEnd");
							$log.error('ERROR:', error.status);
							return false;
						});
				}
				
				function searchHistory(formData){
					
					//PINF-385
					reset();
					
					recent_search=false;
					
					if ((Object.keys(formData).length == 0))
					{
					   formData = searchData;	
					}
					else
					{
					searchData = formData;
					}
					
					var dataSerialized = angular.toJson(formData);
					
					$rootScope.$emit("httpRequestStart");
					//return $http.post('services/app/search/history', dataSerialized)
					return $http.post('services/app/v1.0/search/adis/history', dataSerialized)
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
/* arsalan					if(typeof response.data.success === 'undefined'){
								return false;
							}
*/
							results = response.data;

							if(results.resultCode != null && results.resultCode == "1"){//found results to display
								states["history-results"].started = true;
								states["history"].started = false;
							}else if(results.resultCode != null && results.resultCode == "2" ){//no results or multiple person records without the same person id
								formData.errorMsg="No record found for traveler." ;
						        
								states["history"].started = true;
							    states["history-results"].started=false;
							    states["recent-results"].started=false;
//							    alert("go to history search page");

							}else{//error message
								if (results.error != null && results.error != ""){
									formData.errorMsg=results.error;
//									alert(formData.errorMsg);
									results.sysError = true;
								}else{
									results.sysError = true;
									formData.errorMsg="I-94 View Travel History service is not available.  Please try again later.";
								}
//								alert("ADIS down for travel hisory");
						        states["history"].started = true;
							    states["history-results"].started=false;
							    states["recent-results"].started=false;
							}
							
							return true; // could be empty but will reveal on results page
							
						})
						.catch(function(error){
							
							$rootScope.$emit("httpRequestEnd");
							
							$log.error('ERROR:', error.status);
							return false;
						});
					
					
				}
				
				function requestResults(){
//					alert("recent_search="+recent_search);
					if (!states["recent-results"].started && recent_search)
					{
//					  alert("go to recent search");
					  if (results.recentSysError)
					    $state.go("recent", {from:'previous', errorMsg:'Get Most Recent I-94 service is not available.  Please try again later.'});
					  else
						  $state.go("recent", {from:'previous', errorMsg:'No record found for traveler.'}); 
					}
					
					if (states["history"].started )
					{
//					  alert("go to history search - prv");	
					 // $state.go(states["history"].state);  
						  if (results.sysError)	
						  {
							  results.sysError=false;
							  $state.go("history", {from:'previous', errorMsg:'I-94 View Travel History service is not available.  Please try again later.'});
						  }
						  else
						       $state.go("history", {from:'previous', errorMsg:'No record found for traveler.'});
					}
					
					if(states["history-results"].started){
						$state.go(states["history-results"].state);
					}
					
					if(states["recent-results"].started){
						$state.go(states["recent-results"].state);
					}
	               
					states["history"].started = false;
					
	
				}
				
				function isReady(stateTo){
					
					if(typeof stateTo !== 'undefined'){
						if(typeof states[stateTo] !== 'undefined'){
							return states[stateTo].started;
						}
					}
					
					return false;
					
				}
				
				function reset(){
					results = {};
					//searchData = {};   PINF-385
					states["history-results"].started = false;
					states["recent-results"].started = false;
				}
				
				function cancel(){
					reset();
					$state.go('home');
				}
				
				//PINF-385
				function getSearchData()
				{
					return searchData;
			}
				
			}
})();
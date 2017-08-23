(function(){
	'use strict';
	angular
		.module('i94')
		.service('applicationService', applicationService);
		
			applicationService.$inject = ['$http', '$log', '$rootScope', '$state', '$q'];
			
			function applicationService($http, $log, $rootScope, $state, $q){
				var data = {};
				
				var receipt = {};
				
				initData();
				var estaLink ="";
				var evusLink = "";
				
				var step = [];
				step.push({state: 'apply-document', started: true, finished: false});
				step.push({state: 'apply-traveler', started: false, finished: false});
				//step.push({state: 'apply-checkout-notice', started: false, finished: false});
				//step.push({state: 'apply-checkout-method', started: false, finished: false});
				step.push({state: 'apply-checkout-pay', started: false, finished: false});
				step.push({state: 'apply-receipt', started: false, finished: false});
				
				this.applicationInProgress = false;
				
				this.submitApplicationAndPay = submitApplicationAndPay;
				this.testSubmitApplicationAndPay = testSubmitApplicationAndPay;
				this.makePayment = makePayment;
				this.validateTravelDocument = validateTravelDocument;
				this.setStepFinished = setStepFinished;
				this.getStepFinished = getStepFinished;
				this.requestNextStep = requestNextStep;
				this.getStepStarted = getStepStarted;
				this.setPreviousButtonSteps = setPreviousButtonSteps;
				this.isPaymentSystemAvailable = isPaymentSystemAvailable;
				this.isTdedServiceAvailable = isTdedServiceAvailable;
				this.isProvisionalServicesAvailable = isProvisionalServicesAvailable;
				//this.validateUser = validateUser;
				
				this.cancel = cancel;
				this.reset = reset;
				
				this.getApplicationDocumentData = getApplicationDocumentData;
				this.getApplicationTravelData = getApplicationTravelData;
				this.getApplicationStatus = getApplicationStatus;
				this.getApplicationPayment = getApplicationPayment;
				this.getApplicationReceipt = getApplicationReceipt;
				this.getEstaLink = getEstaLink;
				this.getEvusLink = getEvusLink;
				this.setEstaLink = setEstaLink;
				this.setEvusLink = setEvusLink;
				this.initializeAppProperties = initializeAppProperties;
				
				//initialize application properties
				var appPropertyRet = initializeAppProperties();
				if(appPropertyRet == 'error'){ //set links to PROD
					setEstaLink("https://esta.cbp.dhs.gov");
					setEvusLink("https://www.evus.gov/evus");
				}
				
				function getApplicationDocumentData() {
					return data.document;
				}

				function getApplicationTravelData() {
					return data.traveler;
				}

				function getApplicationStatus(){
					return data.status;
				}
				
				function getApplicationPayment(){
					return data.payment;
				}
				
				function getApplicationReceipt(){
					return receipt;
				}
				

				//Developer testing version 
				function testSubmitApplicationAndPay(){
					
					var dataSerialized = angular.toJson(data);
					
					$rootScope.$emit("httpRequestStart");
					
					//return $http.post('services/v1.0/application/complete', dataSerialized)
					return $http.post('services/app/v1.0/insert/testprovisional', dataSerialized)
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
							if(typeof response.data !== 'undefined'){
								
								if(typeof response.data.paymentTrackingId === 'undefined'){
									return false;
								}
								if(typeof response.data.paymentStatus === 'undefined'){
									return false;
								}
								
								if(response.data.returnStatus == "INSERT_ERROR"){
									$log.error("response.data.returnStatus INSERT_ERROR");
									return "INSERT_ERROR";
								}
								receipt = response.data;
								
								return true;
								
							} else {
								$log.error("response.data undefined");
								return false;
							}
							
						})
						.catch(function(error){
							
							$rootScope.$emit("httpRequestEnd");
							
							$log.error('ERROR:', error.status);
							return "error";
					});
				};

				
				//PROD version of submitApplicationAndPay()
				function submitApplicationAndPay(){
					
					var dataSerialized = angular.toJson(data);
					
					$rootScope.$emit("httpRequestStart");
					
					//return $http.post('services/v1.0/application/complete', dataSerialized)
					return $http.post('services/app/v1.0/insert/provisional', dataSerialized)
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
							if(typeof response.data !== 'undefined'){
								
								if(typeof response.data.paymentTrackingId === 'undefined'){
									return false;
								}
								if(typeof response.data.paymentStatus === 'undefined'){
									return false;
								}
								
								if(response.data.returnStatus == "INSERT_ERROR"){
									$log.error("response.data.returnStatus INSERT_ERROR");
									return "INSERT_ERROR";
								}
								receipt = response.data;
								
								return true;
								
							} else {
								$log.error("response.data undefined");
								return false;
							}
							
						})
						.catch(function(error){
							
							$rootScope.$emit("httpRequestEnd");
							
							$log.error('ERROR:', error.status);
							return "error";
					});
				};
				
				//PROD version of makePayment()
				function makePayment(){
					
					var dataSerialized = angular.toJson(data);
					
					$rootScope.$emit("httpRequestStart");
					
					return $http.post('services/app/paymentRedirectToken', dataSerialized)
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
							if(typeof response.data !== 'undefined'){
								
								if(response.data.status == "FAIL"){
									$log.error("response.data.status FAIL");
									return "error";
								}else if(response.data.status == "PAYMENT_NOT_AVAILABLE"){
									$log.error("response.data.status PAYMENT_NOT_AVAILABLE");
									return "PAYMENT_NOT_AVAILABLE";
								}
								
								return response.data.url;
								
							} else {
								$log.error("response.data undefined");
								return "error";
							}
							
						})
						.catch(function(error){
							
							$rootScope.$emit("httpRequestEnd");
							
							$log.error('ERROR:', error.status);
							return "error";
					});
				};
											
				//valid travel document (passport or bcc)
				function validateTravelDocument(){
					
					var dataSerialized = angular.toJson(data);
					
					$rootScope.$emit("httpRequestStart");
					
					return $http.post('services/app/v1.0/validate/document', dataSerialized)
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
							if(typeof response.data !== 'undefined'){
								
								//$log.log("response.data.returnStatus = " + response.data.returnStatus);
								
								if(response.data.returnStatus == "VALID_DOCUMENT"){
									//$log.log("response.data.returnStatus = VALID_DOCUMENT");
									return "valid";
								}else if(response.data.returnStatus == "INVALID_DOCUMENT"){
									//$log.log("response.data.returnStatus = INVALID_DOCUMENT");
									return "invalid";
								}
								
								return "error";
								
							} else {
								$log.error("response.data undefined");
								return "error";
							}
							
						})
						.catch(function(error){
							
							$rootScope.$emit("httpRequestEnd");
							
							$log.error('ERROR:', error.status);
							return "error";
					});
				};

				//check status of payment system;  true=ONLINE; false=OFFLINE
				function isPaymentSystemAvailable(){
					
					$rootScope.$emit("httpRequestStart");
					
					return $http.get('services/app/v1.0/payment/status')
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
							if(typeof response.data !== 'undefined'){
								
								//$log.log("response.data.status = " + response.data.status);
								
								if(response.data.status == "200"){
									//$log.log("response.data.status (YES) = " + response.data.returnStatus);
									return "ONLINE";
								}else {
									//$log.log("response.data.status  (NO)= " + response.data.returnStatus );
									return "OFFLINE";
								}
								
							} else {
								$log.error("response.data undefined");
								return "error";
							}
							
						})
						.catch(function(error){
							
							$rootScope.$emit("httpRequestEnd");
							
							$log.error('ERROR:', error.status);
							return "error";
					});
				};

				//check status of TDED;  true=ONLINE; false=OFFLINE
				function isTdedServiceAvailable(){
					
					$rootScope.$emit("httpRequestStart");
					
					return $http.get('services/app/v1.0/tded/status')
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
							if(typeof response.data !== 'undefined'){
								
								//$log.log("response.data.status = " + response.data.status);
								
								if(response.data.status == "ONLINE"){
									//$log.log("response.data.status (YES) = " + response.data.returnStatus);
									return "ONLINE";
								}else {
									//$log.log("response.data.status  (NO)= " + response.data.returnStatus );
									return "OFFLINE";
								}
								
							} else {
								$log.error("response.data undefined");
								return "error";
							}
							
						})
						.catch(function(error){
							
							$rootScope.$emit("httpRequestEnd");
							
							$log.error('ERROR:', error.status);
							return "error";
					});
				};
				
				//check status of Payment and TDED
				function isProvisionalServicesAvailable(){
					
					$rootScope.$emit("httpRequestStart");
					
					return $http.get('services/app/v1.0/provisionalservices/status')
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
							if(typeof response.data !== 'undefined'){
								
								//$log.log("response.data.status = " + response.data.status);
								
								if(response.data.status == "400"){ //400=payment system offline
									return "PAYMENT_OFFLINE";
								}else if(response.data.status == "OFFLINE"){ //TDED offline
									return "TDED_OFFLINE";
								}else{
									return "ONLINE";
								}
								
							} else {
								$log.error("response.data undefined");
								return "error";
							}
							
						})
						.catch(function(error){
							
							$rootScope.$emit("httpRequestEnd");
							
							$log.error('ERROR:', error.status);
							return "error";
					});
				};				
				
				function setEvusLink(link){
					evusLink = link;
				}
				
				function getEvusLink(){
					return evusLink;
				}
				
				function setEstaLink(link){
					estaLink = link;
				}
				
				function getEstaLink(){
					return estaLink;
				}

				//get data from app.properties 
				function initializeAppProperties(){
					
					$rootScope.$emit("httpRequestStart");

					return $http.get('services/app/v1.0/application/properties')
						.then(function(response){
							
							$rootScope.$emit("httpRequestEnd");
							
							if(typeof response.data !== 'undefined'){
								
								//$log.log("response.data.estaLink = " + response.data.estaLink);
								//$log.log("response.data.evusLink = " + response.data.evusLink);
								
								setEstaLink(response.data.estaLink);
								setEvusLink(response.data.evusLink);
							} else {
								$log.error("response.data undefined");
								return "error";
							}
							
						})
						.catch(function(error){
							
							$rootScope.$emit("httpRequestEnd");
							
							$log.error('ERROR:', error.status);
							return "error";
					});
				};				
				
				function setStepFinished(state, formData){
					
					for (var i = 0; i < step.length; i++) {
					   if(step[i].state == state){
							
							if(state=='apply-document'){
								data.document = formData;
							} else if(state=='apply-traveler'){
								data.traveler = formData;
							} else if(state=='apply-checkout-notice'){
								data.disclaimers.nonRefundable = formData;
							} else if(state=='apply-checkout-method'){
								data.payment.type = formData;
							} else if(state=='apply-checkout-pay'){
								data.disclaimers.authorizeCharge = formData;
							}
							
							$log.log(data);
							step[i].finished = true;
							
							return;
							
					   }
					}
					
					$log.error("undefined step, could not set finished for state "+state);
	
				}
				
				
				//reset steps for previous button
				function setPreviousButtonSteps(state, formData){
					
					for (var i = 0; i < step.length; i++) {
					   if(step[i].state == state){
							
							if(state=='apply-document'){
								data.document = formData;
								step[i].started = true;
							} else if(state=='apply-traveler'){
								data.traveler = formData;
								step[i].started = false;
							} else if(state=='apply-checkout-pay'){
								data.disclaimers.authorizeCharge = formData;
								step[i].started = false;
							}
							
							step[i].finished = false;
							
							return;
							
					   }
					}
					
					$log.error("undefined step, could not set previous button steps for state "+state);
	
				}
				
				
				function getStepFinished(state){
					
					for (var i = 0; i < step.length; i++) {
					   if(step[i].state == state){
						   return step[i].finished;
					   }
					}
					
					$log.error("undefined step, could not get finished for state "+state);
				}
				
				function getStepStarted(state){
					
					for (var i = 0; i < step.length; i++) {
					   if(step[i].state == state){
						   return step[i].started;
					   }
					}
					
					$log.error("undefined step, could not get finished for state "+state);
				}
				
				function resetAllSteps(){
					for (var i = 0; i < step.length; i++) {
					   
					   if(i==0){
						   step[i].started = true;
					   } else {
						   step[i].started = false;
					   }
					   step[i].finished = false;
					   
					}
				}
				
				function initData(){
					
					data.document = {
						travelDoc:  { passport: false, bcc: false }
					};
					data.status = {};
					data.status.valid = false;
					data.status.trackingId = "undefined";
					data.traveler = {};
					data.disclaimers = {};
					data.disclaimers.nonRefundable = false;
					data.disclaimers.authorizeCharge = false;
					data.payment = {};
					data.payment.type = "undefined";
					data.payment.amount = 6;
					
					receipt.paymentCreatedDate = '';
					receipt.paymentCompletedDate = '';
					receipt.paymentTrackingId = '';
					receipt.paymentType = ''; 
					receipt.paymentStatus = '';
					receipt.payerName = '';
					receipt.success = false; 
					receipt.totalCost = 0;
					
				}
				
				function reset(){
					resetAllSteps();
					initData();
				}
				
				function requestNextStep(){
					for (var i = 0; i < step.length; i++) {
					   if(i > 0 && step[i].finished == false){
						   step[i].started = true;
						   if( step[i].state != 'apply-receipt'){
							   $state.go(step[i].state);
						   }
						   return;
					   }
					}
					// otherwise
					cancel();
				}
				
				function cancel(){
					resetAllSteps();
					initData();
					$state.go('home');
				}
				
			}
})();
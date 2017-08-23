(function(){
	
	'use strict';
	angular.module('i94').controller('ApplyTravelerController', ApplyTravelerController);
	
	ApplyTravelerController.$inject = ['$translate', 'applicationService', '$uibModal', '$log'];
	
	function ApplyTravelerController($translate, applicationService, $uibModal, $log) {
		
		var vm = this;
		vm.document = applicationService.getApplicationTravelData();

		vm.months = [0,1,2,3,4,5,6,7,8,9,10,11];
		vm.genders = [0,1,2];
		vm.countries = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253];
		vm.states = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50];
		vm.occupations = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97];
		vm.cost = 6;

		vm.onKeyPress = onKeyPress;
		vm.onSubmit = onSubmit;
		vm.onCancel = onCancel;
		vm.openPrivacy=openPrivacy;
		vm.openSamplePassport = openSamplePassport;
		vm.onPreviousButton = onPreviousButton;
		
		
		function onSubmit(){
			// validate
			if (vm.form.$valid) {
				applicationService.setStepFinished('apply-traveler', vm.document);
				applicationService.requestNextStep();
			}
			else {
				openModal("ERROR.ERROR", "ERROR_MODAL.FIELDS_DO_NOT_MEET_CRITERIA");
			}
		}
		
		function onKeyPress(callbackFunc, event){
			// 13 is enter
			// 32 is spacebar
			if(event.which == 13 || event.which == 32){
				event.preventDefault();
				callbackFunc();
			}
		}

		function openPrivacy() {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/privacy/privacy-modal.html',
				controller: 'PrivacyModalController',
				controllerAs: 'vm',
				size: 'lg'
			});
		}			
		
		function onCancel(){
			openCancelModal('APPLY');
		}
		
		function onPreviousButton(){
			applicationService.setPreviousButtonSteps('apply-traveler', vm.document);
		}
		
		function openModal(title, content) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/error/error-modal.html',
				controller: 'ErrorModalController',
				controllerAs: 'vm',
				size: 'md',
				resolve: {
					title: function() {
						return title;
					},
					content: function() {
						return content;
					}
				}
			});
		}
		
		function openCancelModal(pageToCancel) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/cancel/cancel-modal.html',
				controller: 'CancelModalController',
				controllerAs: 'vm',
				size: 'md',
				resolve: {
					pageToCancel: function() {
						return pageToCancel;
					}
				}
			});
		}

		function openSamplePassport() {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/samples/passport/passport-modal.html',
				controller: 'PassportModalController',
				controllerAs: 'vm',
				size: 'lg'
			});
		}
		
	};
	
})();
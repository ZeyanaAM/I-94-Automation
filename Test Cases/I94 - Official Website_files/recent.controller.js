(function(){

	'use strict';
	angular.module('i94').controller('RecentController', RecentController);

	RecentController.$inject = ['historySearchService', '$uibModal', '$scope','$state', '$translate'];

	function RecentController(historySearchService, $uibModal, $scope, $state, $translate) {
		var vm = this;
		vm.controllerName = "RecentController";
		vm.months = [0,1,2,3,4,5,6,7,8,9,10,11];
		vm.countries = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253];

		vm.onSubmit = onSubmit;
		vm.onCancel = onCancel;
		vm.openSamplePassport = openSamplePassport;
		vm.openPrivacy = openPrivacy;
		vm.isValidDate = isValidDate;
		vm.isNullOrEmptyOrUndefined = isNullOrEmptyOrUndefined;
		vm.setIsSubmitButtonDisabled = setIsSubmitButtonDisabled;
		vm.getIsSubmitButtonDisabled = getIsSubmitButtonDisabled;
		vm.isMinimumYear = isMinimumYear;   //PINF-506
		vm.minimumYearValid=true;
		vm.isSubmitButtonDisabled = false;
		
		var searchData = historySearchService.getSearchData();

		setIsSubmitButtonDisabled(false); //initialize search submit label
		
		//PINF-459
		vm.document = {};
		vm.validation=true;
		if (Object.keys(searchData).length != 0 && $state.params.from == 'previous')
		{
			if ($state.params.errorMsg != null && $state.params.errorMsg != "")
			{
			  vm.document.errorMsg=$state.params.errorMsg;
			}
			vm.document.firstName=searchData.firstName;
			vm.document.lastName=searchData.lastName;
			vm.document.birthDay=searchData.birthDay;
			vm.document.birthMonth=searchData.birthMonth;
			vm.document.birthYear=searchData.birthYear;
			vm.document.passportNumber=searchData.passportNumber;
			vm.document.passportCountry=searchData.passportCountry;
			
		}
		
		vm.birthDateValid = true;
		
		$scope.compareDates = function() 
		{    
			
			var dateObj = new Date();
			var curMonth = dateObj.getUTCMonth() + 1; //months from 1-12
			var curDay = dateObj.getUTCDate();
			var curYear = dateObj.getUTCFullYear();
			
			
			$scope.validation=true;
			if( vm.document.birthYear > curYear)
			{
				  $scope.validation=false;
			}
			else if(vm.document.birthYear == curYear )
			{
				if(vm.document.birthMonth > curMonth)
				{
					 $scope.validation=false;
				}
				else if(vm.document.birthMonth == curMonth && vm.document.birthDay > curDay)
				{
					 $scope.validation=false;
				}
					
				
			}
		
			
			vm.validation=$scope.validation;
		};			

		//reset error message on page
		$scope.resetBirthDateValidFlag= function()
	    {
			if(vm.birthDateValid == false){
				vm.birthDateValid = true;
			}
			
	    }

		// PINF-581
		$scope.nameContainsAnyChar = function(name)
		{
			
			if (!/[a-zA-z]+/.test(name))
			{
				vm.form.$valid = false;
   				return false
			}
			else
			{
				return true;
				
			}

		}	
		
		//PINF-506
		//Birth year less than 125 years by just checking year field
		//Prevent entries of 0, 00, 000, or 0000
		function isMinimumYear(inputYear){
			var yearNum = 0;
			var dateObj;
			var curYear;
			
			vm.minimumYearValid = true;
	        if(!(vm.isNullOrEmptyOrUndefined(inputYear)) ){
				try{
					dateObj = new Date();
					curYear = dateObj.getUTCFullYear();
			        if(angular.isString(inputYear)){
			        	yearNum =  parseInt(inputYear, 10);
			        }else{
			        	yearNum = inputYear;  //already a number
			        }
			        if( yearNum < (curYear - 125) ){ 
			        	vm.minimumYearValid = false;
			        	vm.form.$valid = false;
			        }
				} catch(ex){
					
				}
	        }
			return true;

		}
		

		

		function isNullOrEmptyOrUndefined( value){
		    if (value === "" || value === null || typeof value === "undefined") {
		        return true;
		    }			
		}
		
		function isValidDate(month, day, year){
	        //$log.log('isValidDate called');
	        var dateResult = true;
	        
	        	
	       // if(angular.isDefined(day) && angular.isDefined(month) && angular.isDefined(year)){
	        if(!(vm.isNullOrEmptyOrUndefined(day) && vm.isNullOrEmptyOrUndefined(month) && vm.isNullOrEmptyOrUndefined(year))){
		        //convert input parameters to numbers
		        var mm = parseInt(month, 10);
		        var dd = 0;
		        var yyyy = parseInt(year, 10);
		        
		        if(angular.isString(day)){
		        	dd =  parseInt(day, 10);
		        }else{
		        	 dd = day;  //already a number
		        }

		        
		        
	            // months are intended from 1 to 12
	            var months31 = [1,3,5,7,8,10,12]; // months with 31 days
	            var months30 = [4,6,9,11]; // months with 30 days
	            var months28 = [2]; // the only month with 28 days (29 if year isLeap)

	            var isLeap = ((yyyy % 4 === 0) && (yyyy % 100 !== 0)) || (yyyy % 400 === 0);

	            var valid = (months31.indexOf(mm)!==-1 && dd <= 31) || (months30.indexOf(mm)!==-1 && dd <= 30) || (months28.indexOf(mm)!==-1 && dd <= 28) || (months28.indexOf(mm)!==-1 && dd <= 29 && isLeap);

	            if( !valid){
	        		dateResult= false;
	        		vm.form.$valid = false;
	            }
	        }
	        return dateResult
		
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
		
		function setIsSubmitButtonDisabled( value){
			
			//change search submit button label
			try{
				if(value){
					$translate('HISTORY_SEARCH.WAIT').then(function (label) {
						$scope.searchButtonLabel = label;
					});	
				}else{
					$translate('HISTORY_SEARCH.NEXT').then(function (label) {
						$scope.searchButtonLabel = label;
					});				
				}
			}catch(err){
				$scope.searchButtonLabel = "NEXT";
			}

			//disable search submit button
			vm.isSubmitButtonDisabled = value;	
			
		}
		
		function getIsSubmitButtonDisabled(){
			return vm.isSubmitButtonDisabled;
		}		
		
		function onSubmit(){
			//date validation
			vm.birthDateValid = vm.isValidDate(vm.document.birthMonth, vm.document.birthDay, vm.document.birthYear);

			
			// validate
			if (vm.form.$valid && vm.validation &&  vm.minimumYearValid) {
				
				//PINF-387
				vm.document.errorMsg="";
				
				vm.setIsSubmitButtonDisabled(true);
				historySearchService.searchRecent(vm.document).then(success, failed);

				function success(data){
					if(data==true){
						historySearchService.requestResults();
					} else {
						openModal("ERROR.ERROR", "ERROR_MODAL.SERVER_DATA_INCORRECT");
					}
					vm.setIsSubmitButtonDisabled(false);
				}

				function failed(data){
					$log.error("data back", data);
					openModal("ERROR.ERROR", "ERROR_MODAL.SEARCH_SERVICE_PROBLEM");
					vm.setIsSubmitButtonDisabled(false);
				}

			}
			else {
				// todo: modal instead
				openModal("ERROR.ERROR", "ERROR_MODAL.FIELDS_DO_NOT_MEET_CRITERIA");
			}
			
			
			historySearchService.getExpirationDate().then(success, failed);

			function success(data){
				if(data==true){
					return true;
				} 
			}

			function failed(data){
				$log.error("data back", data);
				
			}
			
			
			
		}

		
		function onCancel(){
			if(!(vm.getIsSubmitButtonDisabled())){
				openCancelModal('SEARCH');
			}
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

		function openSamplePassport() {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/samples/passport/passport-modal.html',
				controller: 'PassportModalController',
				controllerAs: 'vm',
				size: 'lg'
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

	};

})();

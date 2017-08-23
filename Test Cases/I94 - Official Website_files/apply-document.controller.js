(function(){

	'use strict';
	angular.module('i94').controller('ApplyDocumentController', ApplyDocumentController);

	ApplyDocumentController.$inject = ['$translate', '$log', '$uibModal', 'applicationService', '$scope'];

	function ApplyDocumentController($translate, $log, $uibModal, applicationService, $scope) {

		var vm = this;
		vm.document = applicationService.getApplicationDocumentData();
		vm.estaLink = applicationService.getEstaLink();
		vm.evusLink = applicationService.getEvusLink();
		
		if(typeof(vm.document.entry) != 'undefined')
			vm.entryType = vm.document.entry; 
		else
		vm.entryType = "unspecified";

		vm.entranceStates = {
			air: false,
			land: false,
			sea: false
		}

		vm.genderStates = [false, false, false];

		vm.months = [0,1,2,3,4,5,6,7,8,9,10,11];
		vm.countries = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253];
		vm.countriesOfVisaIssuance = [239];
		vm.states = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50];
		vm.genders = [0,1,2];
		vm.genderNames = {};

		//The first two countries codes are for Bermuda and Canada.  The other codes are for VISA Waiver Countries.
		vm.waiverCountries=['BMU','CAN','IRL','KOR','AND','AUS','AUT','BEL','BRN','CHL','DNK','EST','FIN','FRA','DEU','HUN','ISL','ITA','JPN','LIE','LTU','MCO','CZE','GRC','LVA','LUX','MLT','NLD','NZL','NOR','PRT','SMR','SGP','SVK','SVN','ESP','SWE','CHE','TWN','GBR'];

		
		var asyncIndex = vm.genders.length;
		for(var i = vm.genders.length; i >= 0; i--){
			$translate('GLOBAL.GENDER_LIST.' + vm.genders[i] + '.VAL').then(function (value) {
				asyncIndex--;
				vm.genderNames[asyncIndex] = value;
			});
		}

		vm.cost = 6;

		vm.onEntryTypeClick = onEntryTypeClick;
		vm.onGenderTypeClick = onGenderTypeClick;
		vm.onPassportBCCClick = onPassportBCCClick;
		vm.onSubmit = onSubmit;
		vm.onCancel = onCancel;

		vm.onKeyPress = onKeyPress;
		vm.openPrivacy = openPrivacy;
		vm.openSamplePassport = openSamplePassport;
		vm.openSampleVisa = openSampleVisa;
		vm.openSampleBCC = openSampleBCC;
		vm.isValidDate = isValidDate;
		vm.isNullOrEmptyOrUndefined = isNullOrEmptyOrUndefined;
		vm.calculateAge = calculateAge;
		vm.compareDates = compareDates;
		vm.isMinimumYear = isMinimumYear;
		vm.customPassportValidation = customPassportValidation;
		vm.isDocumentValidationRequired = isDocumentValidationRequired;

		vm.birthDateValidation = true;
		vm.birthDateValid = true;
		vm.passportIssueDateValid = true;
		vm.passportExpireDateValid = true;
		vm.visaIssueDateValid = true;
		vm.canLiveDateValidation = true;
		vm.passportExpireGtIssue = true;
		vm.passportIssueGtEqBirthDate = true;
		vm.visaIssueGtEqBirthDate = true;
		vm.passportExpireDateGtCurrentDateValid = true;
		vm.passportIssueDateLtEqCurrentDateValid = true;
		vm.minimumYearValid= true;
		vm.visaIssuanceDateValidation=true;
		
		
		$scope.makeVisaInfoRequired= function()
	    {
	        //$log.log('makeVisaInfoRequired called');
	        
	        if(!vm.isNullOrEmptyOrUndefined($scope.vm.document.passportCountry)){
	        	for (var i = 0; i < vm.waiverCountries.length; i++) {
					if(vm.waiverCountries[i] == $scope.vm.document.passportCountry){
						return false;
					}
				}
				return true;
	        }
	        return true;
			
	    }
		
		
		// PINF-537
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

		$scope.isBirthDateLessThanCurrentDate = function() 
		{    
			
			vm.birthDateValidation=true;
        	if(!(vm.isNullOrEmptyOrUndefined($scope.vm.document.birthMonth)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.birthDay)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.birthYear)) )
			{
        		if(isValidDate($scope.vm.document.birthMonth, $scope.vm.document.birthDay, $scope.vm.document.birthYear)){
			
				var dateObj = new Date();
				var curMonth = dateObj.getUTCMonth() + 1; //months from 1-12
				var curDay = dateObj.getUTCDate();
				var curYear = dateObj.getUTCFullYear();
				
				
					vm.birthDateValidation=true;
				if( vm.document.birthYear > curYear)
				{
						  vm.birthDateValidation=false;
				}
				else if(vm.document.birthYear == curYear )
				{
					if(vm.document.birthMonth > curMonth)
					{
							 vm.birthDateValidation=false;
					}
					else if(vm.document.birthMonth == curMonth && vm.document.birthDay > curDay)
					{
							 vm.birthDateValidation=false;
					}
						
					
				}
			}
			}
		
		}			
		
		$scope.isVisaIssuanceDateLessThanCurrentDate = function() 
		{    
		
        	if(!(vm.isNullOrEmptyOrUndefined($scope.vm.document.visaIssuanceMonth)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.visaIssuanceDay)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.visaIssuanceYear)) )
			{
				var dateObj = new Date();
				var curMonth = dateObj.getUTCMonth() + 1; //months from 1-12
				var curDay = dateObj.getUTCDate();
				var curYear = dateObj.getUTCFullYear();
				
				
				vm.visaIssuanceDateValidation=true;
				if( vm.document.visaIssuanceYear > curYear)
				{
					  vm.visaIssuanceDateValidation=false;
				}
				else if(vm.document.visaIssuanceYear == curYear )
				{
					if(vm.document.visaIssuanceMonth > curMonth)
					{
						 vm.visaIssuanceDateValidation=false;
					}
					else if(vm.document.visaIssuanceMonth == curMonth && vm.document.visaIssuanceDay > curDay)
					{
						 vm.visaIssuanceDateValidation=false;
					}
						
					
				}
			}
		
		}		
					
		
		//reset error message on page
		$scope.resetBirthDateValidFlag= function()
	    {
			if(vm.birthDateValid == false){
				vm.birthDateValid = true;
			}
			
	    }
		
		//reset error message on page
		$scope.resetPassportIssueDateValidFlag= function()
	    {
			if(vm.passportIssueDateValid == false){
				vm.passportIssueDateValid = true;
			}
			
	    }
		
		//reset error message on page
		$scope.resetPassportExpireDateValidFlag= function()
	    {
			if(vm.passportExpireDateValid == false){
				vm.passportExpireDateValid = true;
			}
			
		/*	if(vm.passportExpireDateGtCurrentDateValid == false){
				vm.passportExpireDateGtCurrentDateValid = true;
	    }
		
		*/	
	    }
		
		//reset error message on page
		$scope.resetVisaIssueDateValidFlag= function()
	    {
			if(vm.visaIssueDateValid == false){
				vm.visaIssueDateValid = true;
			}
			
	    }		
		
		
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
		
		//check person age...cannot be 125 years or older
		$scope.isAgePersonCanLive = function(){  
	        
	     	vm.canLiveDateValidation = true;
	        if(vm.birthDateValidation && vm.minimumYearValid){ //only do this validation if birthDateValidation is true
	        	if(!(vm.isNullOrEmptyOrUndefined($scope.vm.document.birthMonth)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.birthDay)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.birthYear)) ){
	        		if(isValidDate($scope.vm.document.birthMonth, $scope.vm.document.birthDay, $scope.vm.document.birthYear)){
		        		var personAge = vm.calculateAge(vm.document.birthMonth, vm.document.birthDay, vm.document.birthYear);
				        if( personAge >= 125){
				        	vm.form.$valid = false;
				        	vm.canLiveDateValidation = false;
				        }
	        		}
	        	}
	        }
	
		}		
	
		
		$scope.isPassportExpireDateGtCurrentDate= function()
	    {
			vm.passportExpireDateGtCurrentDateValid = true;
			 
	       	if(!(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportExpirationMonth)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportExpirationDay)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportExpirationYear)) )
			{
	       		
	       		if(isValidDate($scope.vm.document.passportExpirationMonth, $scope.vm.document.passportExpirationDay, $scope.vm.document.passportExpirationYear)){
	        		var passportExpireMonth = 0;
	        		var passportExpireDay = 0;
	        		
					var dateObj = new Date();
					var curMonth = dateObj.getUTCMonth() + 1; //months from 1-12
					var curDay = dateObj.getUTCDate();
					var curYear = dateObj.getUTCFullYear();
	        		
	        		try{
			        	//convert to number
				        if(angular.isString($scope.vm.document.passportExpirationMonth)){
				        	passportExpireMonth =  parseInt($scope.vm.document.passportExpirationMonth, 10);
				        }else{
				        	passportExpireMonth = $scope.vm.document.passportExpirationMonth;  //already a number
				        }
		
				        
			        	//convert to number
				        if(angular.isString($scope.vm.document.passportExpirationDay)){
				        	passportExpireDay =  parseInt($scope.vm.document.passportExpirationDay, 10);
				        }else{
				        	passportExpireDay = $scope.vm.document.passportExpirationDay;  //already a number
				        }
		        		
				        
				        //prefix "0" to month and day and create a date string YYYY-MM-DD
				        var expireDate = $scope.vm.document.passportExpirationYear + "-" +  (passportExpireMonth < 10 ? "0"+passportExpireMonth : passportExpireMonth) + "-" + (passportExpireDay < 10 ? "0"+passportExpireDay : passportExpireDay);	
				        var curDate = curYear + "-" +  (curMonth < 10 ? "0"+ curMonth : curMonth) + "-" + (curDay < 10 ? "0"+curDay : curDay);
				        
				        //$log.log("expireDate string = " + expireDate);
				        //$log.log("curDate string = " + curDate);
				        
				        if( vm.compareDates(expireDate, curDate) == 2 ){
				        	vm.passportExpireDateGtCurrentDateValid = true;
				        }else{
				        	vm.form.$valid = false;
				        	vm.passportExpireDateGtCurrentDateValid = false;
				        }
	        		}catch(ex){
	        			
	        		}
	       		}
		        
			}
        	
	    }
		

		$scope.isPassportIssueDateLtEqCurrentDate= function()
	    {
			vm.passportIssueDateLtEqCurrentDateValid = true;
			 
	       	if(!(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportIssuanceMonth)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportIssuanceDay)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportIssuanceYear)) )
			{
	       		if(isValidDate($scope.vm.document.passportIssuanceMonth, $scope.vm.document.passportIssuanceDay, $scope.vm.document.passportIssuanceYear)){
	        		var passportIssueMonth = 0;
	        		var passportIssueDay = 0;
	        		
					var dateObj = new Date();
					var curMonth = dateObj.getUTCMonth() + 1; //months from 1-12
					var curDay = dateObj.getUTCDate();
					var curYear = dateObj.getUTCFullYear();
	        		
	        		try{
			        	//convert to number
				        if(angular.isString($scope.vm.document.passportIssuanceMonth)){
				        	passportIssueMonth =  parseInt($scope.vm.document.passportIssuanceMonth, 10);
				        }else{
				        	passportIssueMonth = $scope.vm.document.passportIssuanceMonth;  //already a number
				        }
		
				        
			        	//convert to number
				        if(angular.isString($scope.vm.document.passportIssuanceDay)){
				        	passportIssueDay =  parseInt($scope.vm.document.passportIssuanceDay, 10);
				        }else{
				        	passportIssueDay = $scope.vm.document.passportIssuanceDay;  //already a number
				        }
		        		
				        
				        //prefix "0" to month and day and create a date string YYYY-MM-DD
				        var issueDate = $scope.vm.document.passportIssuanceYear + "-" +  (passportIssueMonth < 10 ? "0"+passportIssueMonth : passportIssueMonth) + "-" + (passportIssueDay < 10 ? "0"+passportIssueDay : passportIssueDay);	
				        var curDate = curYear + "-" +  (curMonth < 10 ? "0"+ curMonth : curMonth) + "-" + (curDay < 10 ? "0"+curDay : curDay);
				        
				        //$log.log("issueDate string = " + issueDate);
				        //$log.log("curDate string = " + curDate);
				        
				        if( vm.compareDates(issueDate, curDate) < 2 ){
				        	vm.passportIssueDateLtEqCurrentDateValid = true;
				        }else{
				        	vm.form.$valid = false;
				        	vm.passportIssueDateLtEqCurrentDateValid = false;
				        }
	        		}catch(ex){
	        			
	        		}
	       		}
		        
			}
        	
	    }
		
		$scope.isPassportExpireDateGtPassportIssueDate= function()
	    {
			vm.passportExpireGtIssue = true;
			
        	if(!(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportExpirationMonth)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportExpirationDay)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportExpirationYear)) &&
        			!(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportIssuanceMonth)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportIssuanceDay)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportIssuanceYear)) )
			{
        		
        		if((isValidDate($scope.vm.document.passportIssuanceMonth, $scope.vm.document.passportIssuanceDay, $scope.vm.document.passportIssuanceYear)) &&
        				(isValidDate($scope.vm.document.passportExpirationMonth, $scope.vm.document.passportExpirationDay, $scope.vm.document.passportExpirationYear))){
	        		var expireDay = 0;
	        		var expireMonth = 0;
	        		var issueDay = 0;
	        		var issueMonth = 0;
	        		
	        		try{
			        	//convert to number
				        if(angular.isString($scope.vm.document.passportExpirationMonth)){
				        	expireMonth =  parseInt($scope.vm.document.passportExpirationMonth, 10);
				        }else{
				        	expireMonth = $scope.vm.document.passportExpirationMonth;  //already a number
				        }
		
			        	//convert to number
				        if(angular.isString($scope.vm.document.passportIssuanceMonth)){
				        	issueMonth =  parseInt($scope.vm.document.passportIssuanceMonth, 10);
				        }else{
				        	issueMonth = $scope.vm.document.passportIssuanceMonth;  //already a number
				        }
				        
			        	//convert to number
				        if(angular.isString($scope.vm.document.passportExpirationDay)){
				        	expireDay =  parseInt($scope.vm.document.passportExpirationDay, 10);
				        }else{
				        	expireDay = $scope.vm.document.passportExpirationDay;  //already a number
				        }
		        		
			        	//convert to number
				        if(angular.isString($scope.vm.document.passportIssuanceDay)){
				        	issueDay =  parseInt($scope.vm.document.passportIssuanceDay, 10);
				        }else{
				        	issueDay = $scope.vm.document.passportIssuanceDay;  //already a number
				        }
				        
				        //prefix "0" to month and day and create a date string YYYY-MM-DD
				        var expireDate = $scope.vm.document.passportExpirationYear + "-" +  (expireMonth < 10 ? "0"+expireMonth : expireMonth) + "-" + (expireDay < 10 ? "0"+expireDay : expireDay);	
				        var issueDate = $scope.vm.document.passportIssuanceYear + "-" +  (issueMonth < 10 ? "0"+issueMonth : issueMonth) + "-" + (issueDay < 10 ? "0"+issueDay : issueDay);
				        
				        if( vm.compareDates(expireDate, issueDate) == 2){
				        	vm.passportExpireGtIssue = true;
				        }else{
				        	vm.form.$valid = false;
				        	vm.passportExpireGtIssue = false;
				        }
	        		}catch(ex){
	        			
	        		}
        		}
		        
			}
        	
	    }	
		
		$scope.isPassportIssueDateGreaterEqualToBirthDate= function()
	    {
			vm.passportIssueGtEqBirthDate = true;
			 
        	if(!(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportIssuanceMonth)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportIssuanceDay)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.passportIssuanceYear)) &&
        			!(vm.isNullOrEmptyOrUndefined($scope.vm.document.birthMonth)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.birthDay)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.birthYear)) )
			{
        		
        		if((isValidDate($scope.vm.document.passportIssuanceMonth, $scope.vm.document.passportIssuanceDay, $scope.vm.document.passportIssuanceYear)) &&
        				(isValidDate($scope.vm.document.birthMonth, $scope.vm.document.birthDay, $scope.vm.document.birthYear))){
	        		var issueDay = 0;
	        		var issueMonth = 0;
	        		var birthDay = 0;
	        		var birthMonth = 0;
	        		
	        		try{
			        	//convert to number
				        if(angular.isString($scope.vm.document.passportIssuanceMonth)){
				        	issueMonth =  parseInt($scope.vm.document.passportIssuanceMonth, 10);
				        }else{
				        	issueMonth = $scope.vm.document.passportIssuanceMonth;  //already a number
				        }
		
			        	//convert to number
				        if(angular.isString($scope.vm.document.birthMonth)){
				        	birthMonth =  parseInt($scope.vm.document.birthMonth, 10);
				        }else{
				        	birthMonth = $scope.vm.document.birthMonth;  //already a number
				        }
				        
			        	//convert to number
				        if(angular.isString($scope.vm.document.birthDay)){
				        	birthDay =  parseInt($scope.vm.document.birthDay, 10);
				        }else{
				        	birthDay = $scope.vm.document.birthDay;  //already a number
				        }
		        		
			        	//convert to number
				        if(angular.isString($scope.vm.document.passportIssuanceDay)){
				        	issueDay =  parseInt($scope.vm.document.passportIssuanceDay, 10);
				        }else{
				        	issueDay = $scope.vm.document.passportIssuanceDay;  //already a number
				        }
				        
				        //prefix "0" to month and day and create a date string YYYY-MM-DD
				        var issueDate = $scope.vm.document.passportIssuanceYear + "-" +  (issueMonth < 10 ? "0"+issueMonth : issueMonth) + "-" + (issueDay < 10 ? "0"+issueDay : issueDay);	
				        var birthDate = $scope.vm.document.birthYear + "-" +  (birthMonth < 10 ? "0"+ birthMonth : birthMonth) + "-" + (birthDay < 10 ? "0"+birthDay : birthDay);
				        
				       // $log.log("issuedate string = " + issueDate);
				       // $log.log("birthdate string = " + birthDate);
				        
				        if( vm.compareDates(issueDate, birthDate) > 0 ){
				        	vm.passportIssueGtEqBirthDate = true;
				        }else{
				        	vm.form.$valid = false;
				        	vm.passportIssueGtEqBirthDate = false;
				        }
	        		}catch(ex){
	        			
	        		}
        		}
		        
			}
        	//$log.log("vm.passportIssueGtEqBirthDate= " + vm.passportIssueGtEqBirthDate);
        	
	    }
		
		$scope.isVisaIssueDateGreaterEqualToBirthDate= function()
	    {
			vm.visaIssueGtEqBirthDate = true;
			 
        	if(!(vm.isNullOrEmptyOrUndefined($scope.vm.document.visaIssuanceMonth)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.visaIssuanceDay)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.visaIssuanceYear)) &&
        			!(vm.isNullOrEmptyOrUndefined($scope.vm.document.birthMonth)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.birthDay)) && !(vm.isNullOrEmptyOrUndefined($scope.vm.document.birthYear)) )
			{
        		var issueDay = 0;
        		var issueMonth = 0;
        		var birthDay = 0;
        		var birthMonth = 0;
        		
        		try{
		        	//convert to number
			        if(angular.isString($scope.vm.document.visaIssuanceMonth)){
			        	issueMonth =  parseInt($scope.vm.document.visaIssuanceMonth, 10);
			        }else{
			        	issueMonth = $scope.vm.document.visaIssuanceMonth;  //already a number
			        }
	
		        	//convert to number
			        if(angular.isString($scope.vm.document.birthMonth)){
			        	birthMonth =  parseInt($scope.vm.document.birthMonth, 10);
			        }else{
			        	birthMonth = $scope.vm.document.birthMonth;  //already a number
			        }
			        
		        	//convert to number
			        if(angular.isString($scope.vm.document.birthDay)){
			        	birthDay =  parseInt($scope.vm.document.birthDay, 10);
			        }else{
			        	birthDay = $scope.vm.document.birthDay;  //already a number
			        }
	        		
		        	//convert to number
			        if(angular.isString($scope.vm.document.visaIssuanceDay)){
			        	issueDay =  parseInt($scope.vm.document.visaIssuanceDay, 10);
			        }else{
			        	issueDay = $scope.vm.document.visaIssuanceDay;  //already a number
			        }
			        
			        //prefix "0" to month and day and create a date string YYYY-MM-DD
			        var issueDate = $scope.vm.document.visaIssuanceYear + "-" +  (issueMonth < 10 ? "0"+issueMonth : issueMonth) + "-" + (issueDay < 10 ? "0"+issueDay : issueDay);	
			        var birthDate = $scope.vm.document.birthYear + "-" +  (birthMonth < 10 ? "0"+ birthMonth : birthMonth) + "-" + (birthDay < 10 ? "0"+birthDay : birthDay);
			        
			       // $log.log("issuedate string = " + issueDate);
			       // $log.log("birthdate string = " + birthDate);
			        
			        if( vm.compareDates(issueDate, birthDate) > 0 ||  vm.compareDates(issueDate, birthDate != -1)){
			        	vm.visaIssueGtEqBirthDate = true;
			        }else{
			        	vm.form.$valid = false;
			        	vm.visaIssueGtEqBirthDate = false;
			        }
        		}catch(ex){
        			
        		}
		        
			}
        	//$log.log("vm.visaIssueGtEqBirthDate= " + vm.visaIssueGtEqBirthDate);
        	
	    }
		
		
		vm.passportIssueDateLtEqCurrentDateValid 
		
		/* -1 = Error
		 *  0 = date1 < date2
		 *  1 = date1 == date2
		 *  2 = date1 > date2
		 */
		function compareDates( date1, date2){ //date parameter format yyyy-MM-dd

			try{
				
				var result = -1;  //error
				var dateObj1 = new Date(date1);
				var dateObj2 = new Date(date2);
				
				//$log.log("dateObj1 = " + dateObj1);
				//$log.log("dateObj2 = " + dateObj2);
				
				if(dateObj1.getTime() < dateObj2.getTime()){
					result = 0;
					//$log.log("less than");
				}else if (dateObj1.getTime() == dateObj2.getTime()){
					result = 1;
					//$log.log("equal to");
				}else if (dateObj1.getTime() > dateObj2.getTime()){
					result = 2;
					//$log.log("greater than");
				}
			} catch(ex){
				
			}
			return result;
		}
	    
		function isNullOrEmptyOrUndefined( value){
		    if (value === "" || value === null || typeof value === "undefined") {
		        return true;
		    }			
		}
		
		function isValidDate(month, day, year){
	        //$log.log('isValidDate called');
	        var dateResult = true;
	        
	        if((vm.isNullOrEmptyOrUndefined(day)) && !(vm.isNullOrEmptyOrUndefined(month)) && !(vm.isNullOrEmptyOrUndefined(year)) ){
	        	vm.document.birthDay = ""; //reset to blank to trigger required field error message
        		dateResult= false;
        		vm.form.$valid = false;
	        }else if(!(vm.isNullOrEmptyOrUndefined(day)) && !(vm.isNullOrEmptyOrUndefined(month)) && !(vm.isNullOrEmptyOrUndefined(year)) ){
	        	try{
		        //convert input parameters to numbers
		        var mm = parseInt(month, 10);
		        var dd = 0;
		        var yyyy = parseInt(year, 10);
		        
		        if(angular.isString(day)){
		        	dd =  parseInt(day, 10);
		        }else{
			        	//dd = day;  //already a number
			        	dd = parseInt(day, 10);
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
	        	}catch (ex){
	        		
	        }
	        }
	        return dateResult
		
		}		
		
		function calculateAge(month, day, year){  
	        var age =0;
	        
	        if(!(vm.isNullOrEmptyOrUndefined(day)) && !(vm.isNullOrEmptyOrUndefined(month)) && !(vm.isNullOrEmptyOrUndefined(year)) ){
	        	try{
		        	var dd=0;
		        	var mm=0;
		        	
		        	//convert to number
			        if(angular.isString(month)){
			        	mm =  parseInt(month, 10);
			        }else{
			        	mm = month;  //already a number
			        }
	
		        	//convert to number
			        if(angular.isString(day)){
			        	dd =  parseInt(day, 10);
			        }else{
			        	dd = day;  //already a number
			        }
	
			        //prefix "0" to month and day and create a date string YYYY-MM-DD
		        	var dateString = year +"-" +  (mm < 10 ? "0"+mm : mm) + "-" + (dd < 10 ? "0"+dd : dd);
		            var today = new Date();
		            var birthDate = new Date(dateString);
		            age = today.getFullYear() - birthDate.getFullYear();
		            var monthDiff = today.getMonth() - birthDate.getMonth();
		            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		                age--;
		            }
	        	}catch(ex) {
	        		
	        	}
	        }
	        return age
		
		}

		function onPassportBCCClick(val){
			if(val == 1){
				vm.document.travelDoc.passport = true;
				vm.document.travelDoc.bcc = false;
				
				//reset fields to blank
				vm.document.visaNumber = "";
			}
			if(val == 2){
				vm.document.travelDoc.passport = false;
				vm.document.travelDoc.bcc = true;
				
				//reset fields to blank
				vm.document.passportNumber = "";
				vm.document.passportCountry = "";
				vm.document.passportIssuanceDay = "";
				vm.document.passportIssuanceMonth = "";
				vm.document.passportIssuanceYear = "";
				vm.document.passportExpirationDay = ""; 
				vm.document.passportExpirationMonth = "";
				vm.document.passportExpirationYear = "";
				vm.document.visaNumber = "";
				vm.document.visaIssuanceCountry = "";
				vm.document.visaIssuanceDay = "";
				vm.document.visaIssuanceMonth = "";
				vm.document.visaIssuanceYear = "";
			}
		}
		
		function onEntryTypeClick(val){
			for (var state in vm.entranceStates) {
				vm.entranceStates[state] = false;
			}

			if (val == "entryLand"){
				//vm.entryType = "entryLand";
				vm.entranceStates.land = true;

				var paymentSystemStatus = applicationService.isProvisionalServicesAvailable().then(success, failed);
				
				function success(returnData){
					
					if(returnData == 'ONLINE'){
						vm.entryType = "L"; //for all others, set to 'L'
						vm.document.entry ='L'; //set value in document object to activate radio button
					}else if(returnData == 'PAYMENT_OFFLINE'){ //payment system not available
						vm.entryType = "PAYMENT_OFFLINE"; 
						vm.document.entry ='PAYMENT_OFFLINE';
					}else{//TDED service not available or other error
						vm.entryType = "TDED_OFFLINE";  
						vm.document.entry ='TDED_OFFLINE';
					}
				}

				function failed(returnData){
					vm.entryType = "TDED_OFFLINE";  //set to TDED_OFFLINE because the message is general to display to user
					vm.document.entry ='TDED_OFFLINE';  
					$log.error("Failure on payment system or TDED services status check....returnData = ", returnData);				
				}				
				
			} else if (val == "entrySeaport") {
				//vm.entryType = "entrySeaport";
				vm.entryType = "S";
				vm.entranceStates.sea = true;
			} else if (val == "entryAir"){
				//vm.entryType = "entryAir";
				vm.entryType = "A";
				vm.entranceStates.air = true;
			} else {
				vm.entryType = "unspecified";
			}

			//vm.form.entry = val;
			//vm.document.entry = val;

			vm.form.entry = val;
			vm.document.entry = vm.entryType ;

		}

		function onGenderTypeClick(index) {
			for (var i = 0; i < vm.genderStates.length; i++) {
				vm.genderStates[i] = false;
			}
			vm.genderStates[index] = true;
			vm.form.gender = vm.genderNames[index];
			vm.document.gender = vm.genderNames[index];
		}

		function onKeyPress(buttonName, other, event){
			if(event.which == 13 || event.which == 32){

				if(buttonName == "gender"){
					event.preventDefault();
					var index = other;
					onGenderTypeClick(index);
				} else if(buttonName == "passportOrBcc") {
					event.preventDefault();
					onPassportBCCClick(other);
				} else if(buttonName == "entry"){
					event.preventDefault();
					var val = other;
					onEntryTypeClick(val);
				} else if(buttonName == "submit"){

					// angular listens for 13 and 32, pass through

				} else if(buttonName == "cancel"){

					// todo
					$log.log("todo: keyboard cancel");

				}
			}
		}


		//skip validation for VISA Waiver countries and Canada
		function isDocumentValidationRequired()
	    {
			var exemptFlag = true;
		
	        if(!vm.isNullOrEmptyOrUndefined(vm.document.passportCountry)){
	        	for (var i = 0; i < vm.waiverCountries.length; i++) {
					if(vm.waiverCountries[i] == vm.document.passportCountry){
						exemptFlag = false;
					}
				}
				
	        }
	        return exemptFlag;
			
	    }

	    function customPassportValidation(){
	    	
	    	if(vm.passportIssueDateLtEqCurrentDateValid && vm.passportIssueGtEqBirthDate && vm.passportExpireGtIssue && vm.passportExpireDateGtCurrentDateValid){
	    		return true;
	    	}else{
	    		return false;
	    	}
	    }
	    
		function onSubmit(){

			vm.birthDateValid = vm.isValidDate(vm.document.birthMonth, vm.document.birthDay, vm.document.birthYear);
			
			if (vm.document.travelDoc.passport == true){
			vm.passportIssueDateValid = vm.isValidDate( vm.document.passportIssuanceMonth, vm.document.passportIssuanceDay, vm.document.passportIssuanceYear);
			vm.passportExpireDateValid = vm.isValidDate(vm.document.passportExpirationMonth, vm.document.passportExpirationDay,  vm.document.passportExpirationYear);
			vm.visaIssueDateValid = vm.isValidDate(vm.document.visaIssuanceMonth, vm.document.visaIssuanceDay, vm.document.visaIssuanceYear);
			
				if (!vm.visaIssueDateValid)
				{
					vm.form.$valid = false;
				}

				if( !vm.customPassportValidation()) {
					vm.form.$valid = false;
				} 	
			}
			
			if( !(vm.birthDateValidation && vm.canLiveDateValidation && vm.visaIssuanceDateValidation)){
				vm.form.$valid = false;
			}
			
			if (vm.form.$valid) {
				
				if( vm.isDocumentValidationRequired()){
					//isDocumentValidationRequired
					var tdedValidationStatus = applicationService.validateTravelDocument().then(success, failed);
					
					function success(returnData){
						//$log.log("returnData = " + returnData);
						if(returnData == 'valid'){
							applicationService.setStepFinished('apply-document', vm.document);
							applicationService.requestNextStep();
						}else if(returnData == 'invalid'){
							openModal("ERROR.VALIDATION", "ERROR_MODAL.TRAVEL_DOC_VALIDATION");
						}else {
							openModal("ERROR.ERROR", "ERROR_MODAL.PROCESSING_REQUEST");
						}
					}

					function failed(returnData){
						$log.error("data back", returnData);
						openModal("ERROR.ERROR", "ERROR_MODAL.PROCESSING_REQUEST");
			}
				}else{ //no validation for VISA Waiver countries and Canada
					applicationService.setStepFinished('apply-document', vm.document);
					applicationService.requestNextStep();
				} 	

			}
			else {
				// todo: modal instead
				openModal("ERROR.ERROR", "ERROR_MODAL.FIELDS_DO_NOT_MEET_CRITERIA");
			}

		}


		function onCancel(){
			openCancelModal('APPLY');
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

		function openPrivacy() {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/privacy/privacy-modal.html',
				controller: 'PrivacyModalController',
				controllerAs: 'vm',
				size: 'lg'
			});
		}

		// function onKeyPress(callbackFunc, event){
		// 	// 13 is enter
		// 	// 32 is spacebar
		// 	if(event.which == 13 || event.which == 32){
		// 		event.preventDefault();
		// 		callbackFunc();
		// 	}
		// }

		function openSamplePassport() {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/samples/passport/passport-modal.html',
				controller: 'PassportModalController',
				controllerAs: 'vm',
				size: 'lg'
			});
		}

		function openSampleVisa() {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/samples/visa/visa-modal.html',
				controller: 'VisaModalController',
				controllerAs: 'vm',
				size: 'lg'
			});
		}

		function openSampleBCC() {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/samples/bcc/bcc-modal.html',
				controller: 'BCCModalController',
				controllerAs: 'vm',
				size: 'lg'
			});
		}

		
		$scope.isVisaNumberValid=function(visaNumber)
		{

			if (!isNaN(visaNumber))
			{
				return true;
			}
			
			var firstChar = visaNumber.substr(0, 1);
			if(firstChar.match(/[A-Za-z]/))
			{
			  	var rest = visaNumber.substr(1,8);
			  	if (!isNaN(rest))
			  	{
			  	   return true;
			  	}
			  	else
			  	{
			  		vm.form.$valid = false;
			  		return false;
			  	}
			}

			vm.form.$valid = false;
			return false;

		
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

(function(){
	
	'use strict';
	angular.module('i94').controller('HistoryResultsController', HistoryResultsController);
	
	HistoryResultsController.$inject = ['historySearchService', '$log', '$filter', '$uibModal', 'cancelFOIAService', '$scope', '$translate','$state'];
	
	function HistoryResultsController(historySearchService, $log, $filter, $uibModal, cancelFOIAService, $scope, $translate, $state) {
		
		var vm = this;

		
		var result = historySearchService.getResults();
		
		vm.setIsSubmitButtonDisabled = setIsSubmitButtonDisabled;
		vm.getIsSubmitButtonDisabled = getIsSubmitButtonDisabled;
		vm.isSubmitButtonDisabled = false;
		
		vm.onPrint = onPrint;		
		vm.errorMsg="";
		vm.successMsg="";
		vm.name = result.firstName + " " + result.lastName;
		vm.firstName=result.firstName;
		vm.lastName=result.lastName;
		vm.dob=result.dob;
		vm.passportNumber = result.passportNumber;
		vm.passportIssueCountryName=result.passportIssueCountry;
		vm.isNullOrEmptyOrUndefined = isNullOrEmptyOrUndefined;
		vm.onPrevious=onPrevious;   //PINF-459
		
		var ARRIVAL_DATE = "arrivalDate";
		var PORT_OF_ENTRY = "portOfEntry";
		
		vm.documents = {};
		
		vm.dateAscending = true;
		vm.portsAscending = true;
		vm.dateSortActive = true;
		vm.portSortActive = false;
		
		vm.resultSuccess = result.success;
		vm.records = $filter('orderBy')(result.records, ARRIVAL_DATE, vm.dateAscending);
		
		vm.documents.arrivalDate=[];
		vm.documents.arrivalPort=[];
	
		vm.recs=result.travelHistory;
		
		vm.onGetRecentHistoryClick = onGetRecentHistoryClick;
		vm.onGetRecentHistoryKeypress = onGetRecentHistoryKeypress;
		vm.toggleSortDate = toggleSortDate;
		vm.toggleSortPort = toggleSortPort;
		vm.onKeyPress = onKeyPress;
		
		vm.onFOIACancelKeypress = onFOIACancelKeypress;
		vm.onFOIARequestCancelSubmit = onFOIARequestCancelSubmit;
		

//		if(!vm.isNullOrEmptyOrUndefined(result.error))
//		{
//			vm.errorMsg=result.error;
//			vm.name=" ";
//		}
//		else if (vm.isNullOrEmptyOrUndefined(result.firstName))
//		{
//		   vm.errorMsg="No travel history was found for this user.";	
//		   vm.name=" ";
//		}
		//PINF-459
		function onPrevious()
		{
             $state.go("history", {from:'previous'});			
		}
		
		function isNullOrEmptyOrUndefined( value){
		    if (value === "" || value === null || typeof value === "undefined") {
		        return true;
		    }			
		}

		
		
		function onFOIACancelKeypress(event){
			onFOIARequestCancelSubmit(null);
		}
		

		$scope.validateFoiaNumber = function() 
		{    
			vm.validation=true;
			if (!/^[Cc][Bb][Pp]-[0-9]{4}-[0-9a-zA-z]{6}$/.test(vm.document.foiaNumber))
			{
				vm.validation=false;      
			}

		};	
		
		
		function onFOIARequestCancelSubmit(event){
			
			if (vm.form.$valid) {
				
				// get foia number and pass into service
				var foiaNumber = vm.document.foiaNumber;
				if (!/^[Cc][Bb][Pp]-[0-9]{4}-[0-9a-zA-z]{6}$/.test(foiaNumber))
				{
					vm.validation=false;      
				}
				else
				  cancelFOIAService.sendRequest(foiaNumber).then(success, failed);
				
				function success(data){
					vm.successMsg="Request for FOIA cancellation successfully submitted for the FOIA number " + foiaNumber;
					vm.document.foiaNumber="  ";
					if(data.success){
						openModal("SUCCESS.SUCCESS", "SUCCESS.REQUEST_SUBMITTED_SUCCESSFULLY");
					} else {
						openModal("ERROR.ERROR", "ERROR_MODAL.REQUEST_NOT_PROCESSED");
					}
				}
				
				function failed(data){
					$log.error("data back", data);
					openModal("ERROR.ERROR", "ERROR_MODAL.FORM_DATA_SERVICE_PROBLEM");
				}
				
			}
			else {
				// todo: modal instead
				openModal("ERROR.ERROR", "ERROR_MODAL.FIELDS_DO_NOT_MEET_CRITERIA");
			}
			
		}

		vm.foiaResponses = {
			yes: false,
			no: false
		};
		vm.onFoiaSelection = onFoiaSelection;
		vm.onFoiaClick = onFoiaClick;
		vm.onFoiaKeypress = onFoiaKeypress;
		
		function onFoiaClick(event, selection){
			event.preventDefault();
			onFoiaSelection(selection);
		}
		
		function onFoiaKeypress(event, selection){
			if(event.which == 13 || event.which == 32){
				event.preventDefault();
				onFoiaSelection(selection);
			}
		}
	
		function onFoiaSelection(response) {
			for (var state in vm.foiaResponses) {
				vm.foiaResponses[state] = false;
			}

			vm.foiaResponses[response] = true;
			
		}
		
		function toggleSortDate(event){
			//
			vm.dateAscending = !vm.dateAscending;
			vm.dateSortActive = true;
			vm.portSortActive = false;
			
			vm.records = $filter('orderBy')(vm.records, ARRIVAL_DATE, vm.dateAscending);
			
		}
		
		function toggleSortPort(event){
			//
			vm.portsAscending = !vm.portsAscending;
			vm.dateSortActive = false;
			vm.portSortActive = true;
			
			vm.records = $filter('orderBy')(vm.records, PORT_OF_ENTRY, vm.portsAscending);
			
		}
		
/*		function onKeyPress(functionToCall, event){
			if(event.which == 13 || event.which == 32){
				if(functionToCall == "toggleSortPort"){
					event.preventDefault();
					toggleSortPort();
				} else if(functionToCall == "toggleSortDate"){
					event.preventDefault();
					toggleSortDate();
				}
			}
			
		}*/
		
		function onKeyPress(buttonName, other, event){
			if(event.which == 13 || event.which == 32){
				
				if(buttonName == "gender"){
					event.preventDefault();
					var index = other;
					onGenderTypeClick(index);
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
		
		function setIsSubmitButtonDisabled( value){
			//disable search submit button
			vm.isSubmitButtonDisabled = value;	
			
		}
		
		function getIsSubmitButtonDisabled(){
			
			return vm.isSubmitButtonDisabled;	
		}
		
		function onPrint(event){
			event.preventDefault();
			window.print();
		}		
		
		
		function onGetRecentHistoryKeypress(event){
			if(event.which==13 || event.which == 32){
				event.preventDefault();
				onGetRecentHistory();
			}
		}
		
		function onGetRecentHistoryClick(event){
			event.preventDefault();
			onGetRecentHistory();
		}
		
		function onGetRecentHistory(){

			if(vm.getIsSubmitButtonDisabled() == false){
				vm.setIsSubmitButtonDisabled(true);
				historySearchService.searchForRecentFromHistoryResults().then(success, failed);
				
				function success(data){
					vm.setIsSubmitButtonDisabled(false);
					if(data==true){
						historySearchService.requestResults();
					} else {
						openModal("ERROR.ERROR", "ERROR_MODAL.SERVER_DATA_INCORRECT");
					}
				}
				
				function failed(data){
					$log.error("data back", data);
					vm.setIsSubmitButtonDisabled(false);
					openModal("ERROR.ERROR", "ERROR_MODAL.SEARCH_SERVICE_PROBLEM");
				}
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
		
	};
	
})();
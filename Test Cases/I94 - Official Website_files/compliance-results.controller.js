(function(){
	
	'use strict';
	angular.module('i94').controller('ComplianceResultsController', ComplianceResultsController);
	
	ComplianceResultsController.$inject = ['historySearchService', '$log', '$filter', '$uibModal', 'cancelFOIAService', '$scope', '$translate','$state'];
	
	function ComplianceResultsController(historySearchService, $log, $filter, $uibModal, cancelFOIAService, $scope, $translate, $state) {
		var vm = this;
		vm.profile = {
			firstName: '',
			lastName: '',
			dob: '',
			citizenshipCountry: ''
		};
		vm.daysOverstayed = 0;
		vm.daysLeft = "0";
		vm.stayExpiration = '';
		vm.error = ''; // system error message in case information was not retrievable
		vm.message = '';

		vm.onPrevious = onPrevious;

		init();

		$scope.violationData = {
			stayExpiration: vm.stayExpiration,
			days: vm.daysOverstayed
		};

		

		function init() {
			var results = historySearchService.getResults();
			// console.log(results);
			// // hard code results for now
			// var results = {
			// 	firstName: 'James',
			// 	lastName: 'Smith',
			// 	dob: '01/01/1980',
			// 	citizenshipCountry: 'Spain',
			// 	birthDay: '01',
			// 	birthMonth: '05',
			// 	birthYear: '1980',
			// 	countryOfCitizenship: 'United States',
			// 	lastDateAuthorizedToStayDay: 0,
			// 	lastDateAuthorizedToStayMonth: 0,
			// 	lastDateAuthorizedToStayYear: 0,
			// 	error: '',
			// 	message: 'NO_VIOLATION'
			// };

			// set profile
			vm.profile.firstName = results.firstName;
			vm.profile.lastName = results.lastName;
			vm.profile.dob = results.birthMonth + '/' + results.birthDay + '/' + results.birthYear;
			vm.profile.passportCountryOfIssuance = results.passportCountryOfIssuance;
			vm.profile.passportNumber = results.passportNumber;

			// set error (if exists)
			if(results.error != '' && results.error != undefined){
				vm.error = 'COMP_SEARCH_RESULTS.' + results.error;
			}

			// calculate days overstayed / left 
			if(vm.error == ''){
				if(results.message != '' && results.message != undefined) {
					vm.message = 'COMP_SEARCH_RESULTS.' + results.message;
				}
				if(results.lastDateAuthorizedToStayDay != 0) {
					var lastDate = new Date(results.lastDateAuthorizedToStayYear, results.lastDateAuthorizedToStayMonth-1, results.lastDateAuthorizedToStayDay);
					vm.stayExpiration = lastDate.getMonth()+1 + '/' + lastDate.getDate() + '/' + lastDate.getFullYear();
					var today = new Date();
					vm.daysOverstayed = results.daysOverstayed;
//					if(lastDate < today){
//						vm.daysOverstayed = daysBetween(lastDate, today);
//					}
				}

			}
		}

		function daysBetween( date1, date2 ) {
		  //Get 1 day in milliseconds
		  var one_day=1000*60*60*24;

		  // Convert both dates to milliseconds
		  var date1_ms = date1.getTime();
		  var date2_ms = date2.getTime();

		  // Calculate the difference in milliseconds
		  var difference_ms = date2_ms - date1_ms;
		    
		  // Convert back to days and return
		  return Math.round(difference_ms/one_day); 
		}

		function onPrevious()
		{
           $state.go('compliance', {from:'previous'});			
		}

	}
})();
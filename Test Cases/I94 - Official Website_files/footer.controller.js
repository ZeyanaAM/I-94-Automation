(function(){
	
	'use strict';
	angular.module('i94').controller('FooterController', FooterController);
	
	FooterController.$inject = ['$window', '$http', '$timeout', '$scope'];
	
	function FooterController($window, $http, $timeout, $scope) {
		var vm = this;
		vm.onExternalWebsiteKeyPress = onExternalWebsiteKeyPress;
		
    	var results={};
    	vm.date="";
		
		return $http.get('services/app/OMBDate')      
		.then(function(response)
		{
			
		    $timeout(function()
		    {
				results = response.data;
		    	$scope.vm.date ="OMB No. 1651-0111 Expiration Date: " + results.ombdate;
		    });			

		})			
		
		
		function onExternalWebsiteKeyPress(url, event){
			// 13, enter is already taken care of automatically 
			// 32 is spacebar
			if(event.which == 32){
				event.preventDefault();
				$window.location.href = url;
			}
		}
	};
	
})();
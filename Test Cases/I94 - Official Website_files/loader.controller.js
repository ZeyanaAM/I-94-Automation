(function(){

	'use strict';
	angular.module('i94').controller('LoaderController', LoaderController);
	
	LoaderController.$inject = ['$log', '$rootScope', '$scope'];

	function LoaderController($log, $rootScope, $scope) {
		
		var vm = this;
		vm.isLoaderEnabled = false;
		
		init(); //event, toState, toParams, fromState, fromParams
		
		function init(){
			
			$log.log("LoaderController init");
            $rootScope.$on('$stateChangeStart', onStateChangeStart);
            $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
			
			$rootScope.$on('httpRequestStart', onHttpRequestStart);
			$rootScope.$on('httpRequestEnd', onHttpRequestEnd);

		}
		
		function onStateChangeStart(event, toState, toParams, fromState, fromParams){
			$log.log("vm.isLoaderEnabled", vm.isLoaderEnabled);
			vm.isLoaderEnabled = true;
			//$scope.$digest();
		}

		function onStateChangeSuccess(event, toState, toParams, fromState, fromParams){
			$log.log("vm.isLoaderEnabled", vm.isLoaderEnabled);
			vm.isLoaderEnabled = false;
			//$scope.$digest();
		}
		
		function onHttpRequestStart(){
			$log.log("onHttpRequestStart vm.isLoaderEnabled", vm.isLoaderEnabled);
			vm.isLoaderEnabled = true;
			//$scope.$digest();
		}

		function onHttpRequestEnd(){
			$log.log("onHttpRequestEnd vm.isLoaderEnabled", vm.isLoaderEnabled);
			vm.isLoaderEnabled = false;
			//$scope.$digest();
		}
		
	};
	
})();
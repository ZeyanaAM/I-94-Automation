// CONTROLLER ~ Progress Tracker
(function(){

	'use strict';
	angular.module('i94').controller('TooltipController', TooltipController);
	
	TooltipController.$inject = ['$log', 'cssDisabledService', '$rootScope', '$scope'];

	function TooltipController($log, cssDisabledService, $rootScope, $scope) {
		
		var tc = this;
		tc.onClickPreventDefault = onClickPreventDefault;
		tc.isCSSDisbled = cssDisabledService.isCSSEnabled()==false ? true : false;
		
		init();
		
		function init(){
			$rootScope.$on(cssDisabledService.STYLES_DISABLED, onStylesDisabled); 
			$rootScope.$on(cssDisabledService.STYLES_ENABLED, onStylesEnabled); 
		}

		function onClickPreventDefault(event){
			event.preventDefault();
		}
		
		function onStylesEnabled(event){
			tc.isCSSDisbled = false;
			$scope.$digest();
		}

		function onStylesDisabled(event){
			tc.isCSSDisbled = true;
			$scope.$digest();
		}
		
	};
	
})();
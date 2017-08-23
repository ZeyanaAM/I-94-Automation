(function(){
	
	'use strict';
	angular.module('i94').controller('FaqController', FaqController);
	
	FaqController.$inject = ['$translate', '$rootScope', 'faqService', '$filter', '$window', 'cssDisabledService', '$scope', '$log', '$timeout'];
	
	function FaqController($translate, $rootScope, faqService, $filter, $window, cssDisabledService, $scope, $log, $timeout) {
		
		var vm = this;
		vm.faqs = {};
		vm.isCSSDisabled = cssDisabledService.isCSSEnabled()==false ? true : false;
		vm.collapseAll = collapseAll;
		vm.expandAll = expandAll;
		vm.onKeyPressCollapseAll = onKeyPressCollapseAll;
		vm.onKeyPressExpandAll = onKeyPressExpandAll;
		vm.onExternalWebsiteKeyPress = onExternalWebsiteKeyPress;
		vm.reloadPage=reloadPage;
		
		console.log("faq controller");
		
		init();
		
		function init(){
			
			var lang = $translate.use();
			console.log("current lang "+lang);
			faqService.getFaqs(lang).then(
				function(data){
					onGetFaqs(data);
				}
			);
			
			// listen to any future changes and load data
			$rootScope.$on('$translateChangeSuccess', function () {
	
				lang = $translate.use();
				faqService.getFaqs(lang).then(
					function(data){
						onGetFaqs(data);
					}
				);
				console.log("current language is "+lang);
				
			});
			
			$rootScope.$on(cssDisabledService.STYLES_DISABLED, onStylesDisabled); 
			$rootScope.$on(cssDisabledService.STYLES_ENABLED, onStylesEnabled);
			
			if(vm.isCSSDisabled){
				$timeout(expandAll, 1000);
			}
			
		}
		
		function reloadPage()
		{
			location.reload();
		}
		
		function collapseAll(){
			for (var i = 0; i < vm.faqs.length; i++) {
				vm.faqs[i].content.forEach(function (item) {
				  item.open = false;
				});
			}
		}
		
		function expandAll(){
			for (var i = 0; i < vm.faqs.length; i++) {
				vm.faqs[i].content.forEach(function (item) {
				  item.open = true;
				});
			}
		}
		
		function onKeyPressCollapseAll(event){
			if(event.which == 13 || event.which == 32){
				event.preventDefault();
				collapseAll();
			}
		}
		
		function onKeyPressExpandAll(event){
			if(event.which == 13 || event.which == 32){
				event.preventDefault();
				expandAll();
			}
		}
		
		function onGetFaqs(data){
			console.log("onGetFaqs with data ", data);
			if(typeof data.faq !== "undefined"){
				vm.faqs = data.faq;
			} else {
				console.error("faq data is not correct");
			}
		}
		
		function onExternalWebsiteKeyPress(url, event){
			// 13, enter is already taken care of automatically 
			// 32 is spacebar
			if(event.which == 32){
				event.preventDefault();
				$window.location.href = url;
			}
		}
		
		function onStylesEnabled(event){
			vm.isCSSDisabled = false;
			$scope.$digest();
		}

		function onStylesDisabled(event){
			vm.isCSSDisabled = true;
			$scope.$digest();
			expandAll();
		}
		
	}
	
})();
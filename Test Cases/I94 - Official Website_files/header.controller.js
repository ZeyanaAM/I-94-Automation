(function(){

	'use strict';
	angular
	.module('i94')
	.controller('HeaderController', HeaderController);

	HeaderController.$inject = ['$http', '$state', '$window', '$rootScope', '$uibModal', 'securityNotificationService'];

	function HeaderController($http, $state, $window, $rootScope, $uibModal, securityNotificationService) {

		var vm = this;
		vm.toTop = toTop;

		// keyboard accessibility
		vm.skipToContentKeyboard = toContentKeyboard;
		vm.skipToContentClick = toContentClick;
		vm.onKeyPress = onKeyPress;
		vm.onExternalWebsiteKeyPress = onExternalWebsiteKeyPress;
		vm.onClickI94Icon = onClickI94Icon;

		vm.homeActive = isNavActiveForState('home', $state.current.name);
		vm.applyDocumentActive = isNavActiveForState('apply', $state.current.name);
		vm.recentActive = isNavActiveForState('recent', $state.current.name);
		vm.historyActive = isNavActiveForState('history', $state.current.name);
		vm.complianceActive = isNavActiveForState('compliance', $state.current.name);
		vm.faqActive = isNavActiveForState('faq', $state.current.name);
		vm.onModalKeyPress = onModalKeyPress;
		vm.onModalClick = onModalClick;
		vm.hidden=true;

		// highlights
		$rootScope.$on('$stateChangeStart', onURLStateChange);

		//PINF-384 - Alerts and Announcements
		$http.get('services/app/news')      
		.then(function(response)
		{
			var results = response.data;
	    	vm.news=results.news;  //PINF-384
	    	vm.hidden=false;

		})		

		function onModalClick(modalType, destination, event) {
			//
			event.preventDefault();
			navigate(modalType, destination);
		}

		function onModalKeyPress(modalType, destination, event){
			// 13 is enter
			// 32 is spacebar
			if(event.which == 13 || event.which == 32){
				event.preventDefault();
				navigate(modalType, destination);
			}
		}

		function navigate(modalType, destination) {

			if(modalType == "security"){

				if(securityNotificationService.didNotify() == false){
					$uibModal.open({
						animation: true,
						templateUrl: 'app/components/common/modals/security/security-modal.html',
						controller: 'SecurityModalController',
						controllerAs: 'vm',
						size: 'lg',
						resolve: {
							destination: function () {
							  return destination;
							}
						}
					});

				} else{
					$state.go(destination);
				}

			} 

		}
		
		function onURLStateChange(event, toState, toParams, fromState, fromParams){

			vm.homeActive = false;
			vm.applyDocumentActive = false;
			vm.recentActive = false;
			vm.historyActive = false;
			vm.faqActive = false;
			vm.complianceActive = false;

			if(isNavActiveForState('home', toState.name)){
				vm.homeActive = true;
			}

			if(isNavActiveForState('apply', toState.name)){
				vm.applyDocumentActive = true;
			}

			if(isNavActiveForState('recent', toState.name)){
				vm.recentActive = true;
			}

			if(isNavActiveForState('history', toState.name)){
				vm.historyActive = true;
			}

			if(isNavActiveForState('faq', toState.name)){
				vm.faqActive = true;
			}

			if(isNavActiveForState('compliance', toState.name)){
				vm.complianceActive = true;
			}
			resetFocus();

		}

		function resetFocus(){
			$("body").focus();
		}

		function isNavActiveForState(navItem, toState){
			if(navItem == "home" && (toState == 'home' || toState == '')){
				return true;
			} else if(navItem == "apply" && (toState == 'apply-document'
				  || toState == 'apply-traveler'
				  || toState == 'apply-checkout-notice'
				  || toState == 'apply-checkout-method'
				  || toState == 'apply-checkout-pay'
				  || toState == 'apply-receipt')){
				return true;
			} else if(navItem == "recent" && (toState == 'recent'
				|| toState == 'recent-results')) {
				return true;
			} else if(navItem == "history" && (toState == 'history'
				|| toState == 'history-results')) {
				return true;
			} else if(navItem == "faq" && toState == 'faq') {
				return true;
			} else if(navItem == 'compliance' && (toState == 'compliance' 
				|| toState == 'compliance-results')) {
				return true;
			}

		}


		// Scroll to Top
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});

		function toTop(event){
			event.preventDefault();

			$('body,html').animate({
				scrollTop: 0
			}, 800);

			/*
			$('#back-top a').click(function () {
				$('body,html').animate({
					scrollTop: 0
				}, 800);

				return false;
			});
			*/
		};

		function toContentClick(event){
			event.preventDefault();
			$("#content").focus();
		}

		function toContentKeyboard(event){
			if(event.which == 13 || event.which == 32){
				event.preventDefault();
				$("#content").focus();
			}
		}

		function onKeyPress(section, event){
			// 13, enter is already taken care of automatically by ui-sref
			// 32 is spacebar
			if(event.which == 13 && event.which == 32){
				event.preventDefault();
				$state.go(section);
			}
		}

		function onExternalWebsiteKeyPress(url, event){
			// 13, enter is already taken care of automatically
			// 32 is spacebar
			if(event.which == 32){
				event.preventDefault();
				//$window.location.href = url;
				$window.open(url, "_blank");
			}
		}

		function onClickI94Icon(url, event){
			event.preventDefault();
			$state.go(url);
		}

	};

})();

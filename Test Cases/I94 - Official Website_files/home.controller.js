// CONTROLLER ~ HOME
(function($){

	'use strict';
	angular.module('i94').controller('HomeController', HomeController);

	HomeController.$inject = ['$uibModal', '$log', '$state', 'securityNotificationService' ,'$http',  '$scope'];

	function HomeController($uibModal, $log, $state, securityNotificationService, $http, $scope) {

		var vm = this;
		vm.onModalKeyPress = onModalKeyPress;
		vm.onModalClick = onModalClick;

		console.log("Home controller");

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

				$log.log("security");

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



			} else if(modalType == "video"){

				$log.log("video");

				$uibModal.open({
					animation: false,
					templateUrl: 'app/components/common/modals/video/video-modal.html',
					controller: 'VideoModalController',
					controllerAs: 'vm',
					size: 'lg'
				});

			} else {
				$log.error("unsupported modalType navigation ", modalType);
			}

		}

		// Enable parallax scrolling.
		$('.parallax-window').parallax({imageSrc: 'assets/images/bg-home-updated.jpg'});
	};

})(jQuery);

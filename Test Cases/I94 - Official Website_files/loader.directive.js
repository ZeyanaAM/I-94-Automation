
(function(){

	'use strict';
	angular
	.module('i94')
	.directive('loader', loader);

	function loader() {
		return {
			restrict: 'EA',
			controller: 'LoaderController',
			controllerAs: 'vm',
			replace: true,
			templateUrl: 'app/components/common/loader/loader.html'
		};
	};

})();

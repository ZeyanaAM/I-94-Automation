// SERVICE ~ Modal
(function(){

	angular.module('i94')
	.factory('modalService', modalService);

	modalService.$inject = ['$http'];

	function modalService($http) {
		var service = {
			getModalData: getModalData
		};

		return service;

		////////////

		function getModalData(modalName, dataPath, dataFile) {
			console.log("Modal data requested");

			return $http.get(dataPath + dataFile)
				.then(completed)
				.catch(failed);

			function completed(response) {
				return response.data[modalName];
			}

			function failed(error) {
				console.log('XHR failed for the modal windows.\n\tData: ' + error.data);
			}
		}
	}
})();
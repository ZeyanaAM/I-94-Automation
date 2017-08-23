// SERVICE ~ Progress Tracker
(function(){

	angular.module('i94')
	.factory('progressService', progressService);

	progressService.$inject = ['$http'];

	function progressService($http) {
		var service = {
			getProgressData: getProgressData
		};

		return service;

		////////////

		function getProgressData(sectionName, dataPath, dataFile) {
			console.log("Progress Tracker data requested");

			return $http.get(dataPath + dataFile)
				.then(completed)
				.catch(failed);

			function completed(response) {
				return response.data[sectionName];
			}

			function failed(error) {
				console.log('XHR failed for progress tracker.\n\tData: ' + error.data);
			}
		}
	}
})();
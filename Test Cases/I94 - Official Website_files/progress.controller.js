// CONTROLLER ~ Progress Tracker
(function(){

	'use strict';
	angular.module('i94').controller('ProgressController', ProgressController);

	ProgressController.$inject = ['progressService'];

	function ProgressController(progressService) {
		var dataPath = 'app/data/progress/';
		var dataFile = 'progress.json';
		var vm = this;

		vm.steps = {};
		vm.stepPosition = ["first", "second", "third", "fourth"];
		vm.sectionName = "";

		vm.initialize = initialize;
		vm.updateStep = updateStep;

		////////////


		// Public
		function initialize(sectionName) {
			vm.sectionName = sectionName;
			vm.steps = getData();
		};

		function updateStep() {
			vm.currentStep++;

			if (vm.currentStep > (vm.steps.length - 1)) {
				vm.currentStep = 0;
			}
		}


		// Private
		function getData() {
			return queryData()
				.then(function() {
					console.log('Progress Tracker data received successfully.');
				});
		}

		function queryData() {
			return progressService.getProgressData(vm.sectionName, dataPath, dataFile)
				.then(function(data) {
					vm.steps = data;
					return data;
				});
		}

		console.log('progress tracker controller');
	};
})();

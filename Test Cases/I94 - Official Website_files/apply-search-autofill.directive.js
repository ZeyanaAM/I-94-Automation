(function(){

	'use strict';
	angular
	.module('i94')
	.directive('searchAutofill', searchAutofill);

	function searchAutofill() {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'app/components/pages/autofill/autofill-button.html', 
			link: function(scope, element, attr){
			  element.on('mousedown', function(event) {
				event.preventDefault();

				$('#firstName').val("Jim");
				$('#firstName').change();
				$('#lastName').val("Anderson");
				$('#lastName').change();
				$('#birthDay').val("1");
				$('#birthDay').change();
				$('#birthMonth').val("january");
				$('#birthMonth').change();
				$('#birthYear').val("1980");
				$('#birthYear').change();
				$('#passportNumber').val("123456789");
				$('#passportNumber').change();
				$('#passportCountry').val("CAN");
				$('#passportCountry').change();
				
			  });
			}
		}
	}

})();
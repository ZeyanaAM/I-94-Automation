(function(){

	'use strict';
	angular
	.module('i94')
	.directive('applyTravelerAutofill', applyTravelerAutofill);

	function applyTravelerAutofill() {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'app/components/pages/autofill/autofill-button.html', 
			link: function(scope, element, attr){
			  element.on('mousedown', function(event) {
				// Prevent default dragging of selected content
				event.preventDefault();

				$('#countryCitizenship').val("CAN");
				$('#countryCitizenship').change();
				
				$('#countryResidence').val("CAN");
				$('#countryResidence').change();
				
				$('#address1').val("101 Park Place");
				$('#address1').change();
				
				$('#address2').val("Apt 2");
				$('#address2').change();
				
				$('#city').val("Riverside");
				$('#city').change();
				
				$('#state').val("CA");
				$('#state').change();
				
				$('#zipCode').val("92504");
				$('#zipCode').change();
				
				$('#telephone').val("555 555-3333 ");
				$('#telephone').change();
				
				$('#telephoneExtension').val("");
				$('#telephoneExtension').change();
				
				$('#occupation').val("037");
				$('#occupation').change();

			  });
			}
		}
	}

})();
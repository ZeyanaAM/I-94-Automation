(function(){

	'use strict';
	angular
	.module('i94')
	.directive('applyDocumentAutofill', applyDocumentAutofill);

	function applyDocumentAutofill() {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'app/components/pages/autofill/autofill-button.html', 
			link: function(scope, element, attr){
			  element.on('mousedown', function(event) {
				// Prevent default dragging of selected content
				event.preventDefault();
				
				$('#entryLand').click();
				
				$('#firstName').val("Joe");
				$('#firstName').change();
				
				$('#lastName').val("Smith");
				$('#lastName').change();
				
				$('#birthDay').val("1");
				$('#birthDay').change();
				
				$('#birthMonth').val("01");
				$('#birthMonth').change();
				
				$('#birthYear').val("1980");
				$('#birthYear').change();
				
				$('#male').click();

				$('[name="passportNumber"]').val("123456789");
				$('[name="passportNumber"]').change();
				$('[name="passportCountry"]').val("CAN");
				$('[name="passportCountry"]').change();
				$('[name="passportIssuanceDay"]').val("1");
				$('[name="passportIssuanceDay"]').change();
				$('[name="passportIssuanceMonth"]').val("01");
				$('[name="passportIssuanceMonth"]').change();
				$('[name="passportIssuanceYear"]').val("2010");
				$('[name="passportIssuanceYear"]').change();
				$('[name="passportExpirationDay"]').val("2");
				$('[name="passportExpirationDay"]').change();
				$('[name="passportExpirationMonth"]').val("01");
				$('[name="passportExpirationMonth"]').change();
				$('[name="passportExpirationYear"]').val("2020");
				$('[name="passportExpirationYear"]').change();
				$('[name="visaNumber"]').val("113456");
				$('[name="visaNumber"]').change();
				$('[name="visaIssuanceDay"]').val("1");
				$('[name="visaIssuanceDay"]').change();
				$('[name="visaIssuanceMonth"]').val("01");
				$('[name="visaIssuanceMonth"]').change();
				$('[name="visaIssuanceYear"]').val("2010");
				$('[name="visaIssuanceYear"]').change();
				$('[name="visaIssuanceCountry"]').val("CAN");
				$('[name="visaIssuanceCountry"]').change();
				$('[name="visaIssuanceCity"]').val("Ottowa");
				$('[name="visaIssuanceCity"]').change();

			  });
			}
		}
	}

})();
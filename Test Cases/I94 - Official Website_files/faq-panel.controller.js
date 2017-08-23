// CONTROLLER ~ FAQ PANEL
(function(){

	'use strict';
	angular.module('i94').controller('FAQPanelController', FAQPanelController);

	FAQPanelController.$inject = ['$translate', 'faqService', '$uibModal', '$filter'];

	function FAQPanelController($translate, faqService, $uibModal, $filter) {
		
		var faqList = {};
		
		var vm = this;

		vm.matchTerm = "";
		vm.featuredList = [];
		
		vm.setSection = setSection;
		vm.onOpenFaqClick = onOpenFaqClick;
		vm.onOpenFaqKeyPress = onOpenFaqKeyPress;

		init();
		
		function init() {
			var lang = $translate.use();
			faqService.getFaqs(lang)
				.then(function(data) {
					onGetFaqs(data);
				});
		}
		
		function setSection(term) {
			vm.matchTerm = term;
		}
		
		function onOpenFaqKeyPress(title, content, event){
			if(event.which == 13 || event.which == 32){
				event.preventDefault();
				openFAQ(title, content);
			}
		}
		
		function onOpenFaqClick(title, content, event){
			event.preventDefault();
			openFAQ(title, content);
		}

		function openFAQ(title, content) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/components/common/modals/faq/faq-modal.html',
				controller: 'FaqModalController',
				controllerAs: 'vm',
				size: 'md',
				resolve: {
					title: function() {
						return title;
					},
					content: function() {
						return content;
					}
				}
			});
		}

		function onGetFaqs(data){
			if (typeof data.faq !== "undefined"){
				vm.faqList = data.faq;
				filterQuestions(vm.faqList);
			} else {
				console.error("faq data is not correct");
			}
		}

		function filterQuestions(listData) {
			for (var i = 0; i < vm.faqList.length; i++) {
				var contentObj = vm.faqList[i].content;

				if (contentObj) {
					for (var j = 0; j < contentObj.length; j++) {
						var keywordObj = contentObj[j].keywords;
						
						if (keywordObj) {
							for (var k = 0; k < keywordObj.length; k++) {
								if (keywordObj[k] == vm.matchTerm) {
									vm.featuredList.push(contentObj[j]);
								}
							}
						} else {
							console.log("The keyword object does not exist.");
						}
					}
				} else {
					console.log("The content object does not exist.");
				}

			}
		}

	}

})();
(function() {

    'use strict';
    angular.module('i94').controller('RecentResultsController', RecentResultsController);

    RecentResultsController.$inject = ['$log', 'historySearchService', '$uibModal', '$translate', '$http', '$timeout', '$scope', '$state'];

    var vm;

    function RecentResultsController($log, historySearchService, $uibModal, $translate, $http, $timeout, $scope, $state) {

        vm = this;
        vm.user = {};
        vm.omdate = {};

        vm.setIsSubmitButtonDisabled = setIsSubmitButtonDisabled;
        vm.getIsSubmitButtonDisabled = getIsSubmitButtonDisabled;
        vm.isSubmitButtonDisabled = false;

        var result = historySearchService.getResults();
        var searchData = historySearchService.getSearchData();
        vm.onGetSeachHistoryClick = onGetSeachHistoryClick;
        vm.onGetSeachHistoryKeypress = onGetSeachHistoryKeypress;
        vm.onGetSearchHistory = onGetSearchHistory;
        vm.isNullOrEmptyOrUndefined = isNullOrEmptyOrUndefined;
        vm.onPrevious = onPrevious; //PINF-459

        vm.onCancel = onCancel;
        vm.errorMsg = "";
        vm.onPrint = onPrint;

        var expdate = historySearchService.getExpDateResult();

        vm.omdate.expire = expdate.ombdate;

        function isNullOrEmptyOrUndefined(value) {
            if (value === "" || value === null || typeof value === "undefined") {
                return true;
            }
        }


        function isNullOrEmptyOrUndefined(value) {
            if (value === "" || value === null || typeof value === "undefined") {
                return true;
            }
        }

        if (!vm.isNullOrEmptyOrUndefined(result.i94Number)) {

            vm.user.name = result.firstName + " " + result.lastName;
            vm.user.lastName = result.lastName;
            vm.user.firstName = result.firstName;

            vm.user.applicationIdArray = result.i94Number;

            vm.user.entryYear = result.arrivalYear;
            vm.user.entryMonthWord = result.arrivalMonth;
            vm.user.entryDay = result.arrivalDay;

            vm.user.classOfAdmission = result.classOfAdmission;

            vm.user.untilMonth = result.admitUntil;

            if (!vm.isNullOrEmptyOrUndefined(result.admitUntilYear)) {
                vm.user.untilMonth = result.admitUntilMonth;
                vm.user.untilDay = result.admitUntilDay;
                vm.user.untilYear = result.admitUntilYear;
            }

            vm.user.dobYear = result.dobYear;
            vm.user.dobMonthWord = result.dobMonth;
            vm.user.dobDay = result.dobDay;

            vm.user.passportNumber = result.passportNumber;
            vm.passportIssueCountryName = result.passportIssueCountry;

            vm.resultSuccess = result.success;
            vm.record = result.record;
        } else {
            if (!vm.isNullOrEmptyOrUndefined(result.error))
                vm.errorMsg = error
            else
                vm.errorMsg = "No I94 record was found for this user.";
        }



        vm.historySearchService = historySearchService;

        $log.log("vm.records ", vm.record);


        historySearchService.reset();

        //PINF-459
        function onPrevious() {
            $state.go("recent", { from: 'previous' });
        }

        //test data only - do not uncomment
        // vm.user.name = 'James Bond';
        // vm.user.lastName = 'James';
        // vm.user.firstName = 'Bond';

        // vm.user.applicationIdArray = '12312312131231';

        // vm.user.entryYear = '2000';
        // vm.user.entryMonthWord = '01';
        // vm.user.entryDay = '30';

        // vm.user.classOfAdmission = 'Class of Admission';

        // vm.user.untilMonth = '10';

        // if (!vm.isNullOrEmptyOrUndefined(result.admitUntilYear)) {
        //     vm.user.untilMonth = '2010';
        //     vm.user.untilDay = '01';
        //     vm.user.untilYear = '15';
        // }

        // vm.user.dobYear = '1980';
        // vm.user.dobMonthWord = '02';
        // vm.user.dobDay = '22';

        // vm.user.passportNumber = '1231313';
        // vm.passportIssueCountryName = 'Canada';

    };


    function setIsSubmitButtonDisabled(value) {
        //disable search submit button
        vm.isSubmitButtonDisabled = value;

    }

    function getIsSubmitButtonDisabled() {

        return vm.isSubmitButtonDisabled;
    }


    function onGetSeachHistoryKeypress(event) {

        if (event.which == 13 || event.which == 32) {
            event.preventDefault();
            onGetSearchHistory(event);
        }
    }


    function onGetSeachHistoryClick(event) {
        event.preventDefault();
        onGetSearchHistory();


    }



    function onGetSearchHistory(event) {
        var formData = {};

        if (vm.getIsSubmitButtonDisabled() == false) {
            vm.setIsSubmitButtonDisabled(true);
            vm.historySearchService.searchHistory(formData).then(success, failed);

            function success(data) {
                vm.setIsSubmitButtonDisabled(false);
                if (data == true) {
                    vm.historySearchService.requestResults(event);
                } else {
                    openModal("ERROR.ERROR", "ERROR_MODAL.SERVER_DATA_INCORRECT");
                }
            }

            function failed(data) {
                $log.error("data back", data);
                vm.setIsSubmitButtonDisabled(false);
                openModal("ERROR.ERROR", "ERROR_MODAL.SEARCH_SERVICE_PROBLEM");
            }
        }

    }


    function openModal(title, content) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/common/modals/error/error-modal.html',
            controller: 'ErrorModalController',
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


    function onPrint(event) {
        event.preventDefault();
        window.print();
    }

    function onCancel() {
        //applicationService.cancel();
    }

})();

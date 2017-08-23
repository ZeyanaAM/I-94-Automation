(function(){
	'use strict';
	angular
		.module('i94')
		.service('cssDisabledService', cssDisabledService);
		
			cssDisabledService.$inject = ['$log', '$rootScope'];
			
			function cssDisabledService($log, $rootScope){
				
				var instance = this;
				
				var isMonitoring = false;
				var cssEnabled = true;

				var INTERVAL = 1000;
				
				instance.STYLES_DISABLED = "i94_styles_disabled";
				instance.STYLES_ENABLED = "i94_styles_enabled";
				
				instance.isRunning = isRunning;
				instance.isCSSEnabled = isCSSEnabled;
				
				init();
				
				function isRunning(){
					return isMonitoring;
				}
				
				function isCSSEnabled(){
					return cssEnabled;
				}

				function init(){

					if (isMonitoring == false){
						monitorStyleChange();
						isMonitoring = true;
					}

				};

				function monitorStyleChange(){
					$rootScope.$on(instance.STYLES_DISABLED, onStylesDisabled); // debug binding
					$rootScope.$on(instance.STYLES_ENABLED, onStylesEnabled); // debug binding
					setInterval(function(){ checkForStyleChange() }, INTERVAL);
				}

				function checkForStyleChange(){

					// computed style features
					var bodyBoxSizing = $("body").css("box-sizing"); // border-box
					var bodyOverflowX = $("body").css("overflow-x"); // hidden

					var documentHasi94CssFeatures = (bodyBoxSizing == "border-box") && (bodyOverflowX == "hidden");

					if (documentHasi94CssFeatures == true && cssEnabled == false) {
						$rootScope.$emit(instance.STYLES_ENABLED); // trigger once
					} else if(documentHasi94CssFeatures == false && cssEnabled == true) {
						$rootScope.$emit(instance.STYLES_DISABLED); // trigger once
					}

					cssEnabled = documentHasi94CssFeatures;

				}

				function onStylesEnabled(event){
					$log.log("onStylesEnabled");
				}

				function onStylesDisabled(event){
					$log.log("onStylesDisabled");
				}
				
			}
			
})();
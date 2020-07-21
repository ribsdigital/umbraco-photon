(function () {
	'use strict';

	function photonController($scope, entityResource, editorService) {

		$scope.page = {};
		$scope.page.loading = true;
		$scope.model.hideLabel = $scope.model.config.hideLabel;

		var defaultValue = { imageId: 0, imageSrc: "", tags: [] };

		function init() {
			$scope.tmpModel = $scope.model.value || angular.copy(defaultValue);
			$scope.tmpModel.imageSrc = "";

			if ($scope.model.value && $scope.model.value.imageId > 0) {
				entityResource.getById($scope.model.value.imageId, "Media").then(function (media) {

					// Extract media url
					var src = media.hasOwnProperty("metaData") ? media.metaData.MediaPath : "";

					// Check for image cropper
					if (typeof src === 'object' && src.hasOwnProperty("PropertyEditorAlias") && src["PropertyEditorAlias"] === "Umbraco.ImageCropper") {
						src = src.Value.src;
					}

					// Src is some other object so set to empty string
					if (typeof src === 'object') {
						src = "";
					}

					// Update scope
					$scope.tmpModel.imageSrc = src;
					$scope.tmpModel.trashed = media.trashed;
				});
			}
		}

		$scope.showAdd = function () {
			return !$scope.tmpModel.imageSrc;
		};

		$scope.add = function () {

			var mediaPickerOptions = {
				multiPicker: false,
				onlyImages: true,
				disableFolderSelect: true,
				submit: function (model) {
					if (model.selection.length > 0 && model.selection[0].hasOwnProperty("image")) {
						$scope.tmpModel.imageId = model.selection[0].id;
						$scope.tmpModel.imageSrc = model.selection[0].image;
					}
					editorService.close();
				},
				close: function () {
					editorService.close();
				}
			};
			editorService.mediaPicker(mediaPickerOptions);
		};

		$scope.clear = function () {
			if (confirm("You sure?")) {
				$scope.tmpModel = angular.copy(defaultValue);
			}
		};

		$scope.$on("formSubmitting", function () {
			$scope.model.value = $scope.tmpModel.imageId > 0
				? { imageId: $scope.tmpModel.imageId, tags: $scope.tmpModel.tags }
				: undefined;
		});

		//here we declare a special method which will be called whenever the value has changed from the server
		$scope.model.onValueChanged = function (newVal, oldVal) {
			init();
		};

		init();
	}

	angular.module('umbraco').controller('photon.controller', photonController);
})();
(function () {
	'use strict';

	function photonHotspotEditController($scope, editorService, entityResource, iconHelper) {

		var vm = this;

		vm.close = close;
		vm.submit = submit;
		vm.linkEdit = linkEdit;

		function init() {
			$scope.model.title = $scope.model.tag.title;
			$scope.model.summary = $scope.model.tag.summary;
			$scope.model.link = angular.isUndefined($scope.model.tag.link) ? null : $scope.model.tag.link;
		}

		function close() {
			if ($scope.model.close) {
				$scope.model.close();
			}
		}

		function submit(model) {
			if ($scope.model.submit) {
				$scope.model.submit($scope.model);
				$scope.model.close();
			}
		}

		function linkEdit() {
			var options = {
				submit: function (model) {
					$scope.model.link = processLink(entityResource, iconHelper, model);
					editorService.close();
				},
				close: function () {
					editorService.close();
				}
			};

			editorService.linkPicker(options);
		}

		init();
	}

	function processLink(entityResource, iconHelper, model) {
		//link.icon = '';
		//link.id = 0;
		//link.udi = '';
		//link.url = '';
		//link.target = '';
		//link.name = '';
		//link.published = false;
		//link.trashed = false;

		var link = {};
		link.udi = model.target.udi;
		link.name = model.target.name || model.target.url || model.target.anchor;
		link.queryString = model.target.anchor;
		link.target = model.target.target;
		link.url = model.target.url;

		if (model.target.udi) {
			var entityType = model.target.isMedia ? "Media" : "Document";

			entityResource.getById(model.target.udi, entityType).then(function (data) {
				link.icon = iconHelper.convertFromLegacyIcon(data.icon);
				link.published = (data.metaData && data.metaData.IsPublished === false && entityType === "Document") ? false : true;
				link.trashed = data.trashed;
				if (link.trashed) {
					item.url = vm.labels.general_recycleBin;
				}
			});
		} else {
			link.icon = "icon-link";
			link.published = true;
		}

		return link;
	}

	angular.module('umbraco').controller('photon.hotspot.edit.controller', photonHotspotEditController);
})();
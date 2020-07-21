(function () {
	'use strict';

	function photonImage(editorService) {

		var origImageWidth, origImageHeight, imageWidth, imageHeight, ias;

		var percToPx = function (val, maxVal) {
			return maxVal / 100 * val;
		};

		var pxToPerc = function (val, maxVal) {
			return 100 / maxVal * val;
		};

		var updateImageDimensions = function (url, imgWidth) {
			var tmpImg = new Image();
			tmpImg.src = url;
			$(tmpImg).one('load', function () {
				origImageWidth = tmpImg.width;
				origImageHeight = tmpImg.height;

				imageWidth = imgWidth;
				imageHeight = Math.round((imageWidth / origImageWidth) * origImageHeight);

				tmpImg = null;
			});
		};

		var link = function ($scope, element, attrs, ctrl) {

			$scope.model.tags = $scope.model.tags || [];
			$scope.currentTag = null;

			var initImgAreaSelect = function () {

				var hotspotMinWidth = parseInt($scope.config.hotspotMinWidth, 10);
				if (hotspotMinWidth === 0) {
					hotspotMinWidth = 30;
				}

				var hotspotMinHeight = parseInt($scope.config.hotspotMinHeight, 10);
				if (hotspotMinHeight === 0) {
					hotspotMinHeight = 30;
				}

				var hotspotMaxWidth = parseInt($scope.config.hotspotMaxWidth, 10);
				if (hotspotMaxWidth === 0) {
					hotspotMaxWidth = 100;
				}

				var hotspotMaxHeight = parseInt($scope.config.hotspotMaxHeight, 10);
				if (hotspotMaxHeight === 0) {
					hotspotMaxHeight = 100;
				}

				ias = $(element).find(".photon-image").imgAreaSelect({
					hide: true,
					handles: false,
					instance: true,
					minWidth: hotspotMinWidth,
					minHeight: hotspotMinHeight,
					maxWidth: hotspotMaxWidth,
					maxHeight: hotspotMaxHeight,
					resizable: $scope.config.hotspotResizable,
					parent: $(element).find(".photon-image-bounds"),
					onSelectStart: function(img) {
						$scope.$apply(function() {
							$scope.currentTag = null;
						});
						ias.setOptions({ show: true });
						ias.update();
					},
					onSelectEnd: function(img, sel) {

						var tooSmall = sel.width === 0 || sel.height === 0;
						if ($scope.currentTag === null && tooSmall) {
							return;
						}

						var tag = $scope.currentTag || { id: guid() };

						tag.x = pxToPerc(sel.x1, imageWidth);
						tag.y = pxToPerc(sel.y1, imageHeight);
						tag.width = pxToPerc(sel.width, imageWidth);
						tag.height = pxToPerc(sel.height, imageHeight);

						if ($scope.currentTag === null) {
							$scope.$apply(function() {
								$scope.model.tags.push(tag);
								$scope.currentTag = tag;
							});
						} else {
							$scope.$apply();
						}
					}
				});
			};

			$scope.isCurrentTag = function(tag) {
				var isCurrentTag = $scope.currentTag !== null && tag.id === $scope.currentTag.id;
				return isCurrentTag;
			};

			$scope.deselectCurrentTag = function(e) {
				$scope.currentTag = null;
			};

			$scope.selectTag = function(tag, e) {
				e.stopPropagation();
				$scope.currentTag = tag;
			};

			$scope.editTag = function(tag) {
				var options = {
					view: '/App_Plugins/Our.Umbraco.Photon/Views/photon.hotspot.edit.html',
					size: 'small',
					tag: tag,
					submit: function (model) {
						tag.title = model.title;
						tag.summary = model.summary;
						tag.link = model.link;
					},
					close: function () {
						editorService.close();
					}
				};

				editorService.open(options);
			};

			$scope.deleteTag = function(tag) {
				$scope.model.tags = $.grep($scope.model.tags,
					function(itm, idx) {
						return tag.id !== itm.id;
					});
				if ($scope.isCurrentTag(tag)) {
					$scope.currentTag = null;
				}
			};

			$scope.$watch('src', function (newValue, oldValue) {
				if (newValue !== oldValue) {
					$scope.model.tags = [];
					if (ias !== undefined) {
						ias.update({ remove: true });
					}
				}
				if (newValue) {
					updateImageDimensions(newValue, $scope.config.imageWidth);
					initImgAreaSelect();
				}
			});

			$scope.$watch('currentTag', function (newValue, oldValue) {
				if (newValue !== null) {
					if (newValue !== oldValue) {
						ias.setSelection(percToPx(newValue.x, imageWidth),
							percToPx(newValue.y, imageHeight),
							percToPx(newValue.x + newValue.width, imageWidth),
							percToPx(newValue.y + newValue.height, imageHeight));
						ias.setOptions({ show: true });
						ias.update();
					}
				} else {
					if (newValue !== oldValue) {
						ias.setOptions({ hide: true });
						ias.update();
					}
				}
			});

			$scope.$on("formSubmitting", function () {
				$scope.deselectCurrentTag();
			});

			$scope.$on('$destroy', function () {
				ias.setOptions({ remove: true });
				$scope.deselectCurrentTag();
			});
		};

		var directive = {
			restrict: 'E',
			replace: true,
			template: "<div>" +
				"<div class='photon-image-bounds' style=\"background-color:{{config.backgroundColor}};\">" +
				"<div class='photon-tag' ng-repeat=\"tag in model.tags\" ng-class=\"{active:tag.id==currentTag.id}\" ng-mousedown=\"selectTag(tag, $event);\" style=\"width:{{tag.width}}%;height:{{tag.height}}%;left:{{tag.x}}%;top:{{tag.y}}%;\">" +
				"<div class='photon-tag-tools'>" +
				"<span class=\"photon-tag-tool\" ng-click=\"editTag(tag)\"><i class=\"icon-edit\"> </i></span>" +
				"<span class=\"photon-tag-tool\" ng-click=\"deleteTag(tag)\"><i class=\"icon-trash\"> </i></span>" +
				"</div>" +
				"</div>" +
				"<img class='photon-image' src='{{src}}' width='{{config.imageWidth}}' style='width: {{config.imageWidth}}px;' ng-mousedown=\"deselectCurrentTag($event);\"  />" +
				"</div>" +
				"</div>",
			scope: {
				config: '=',
				model: '=',
				src: '@'
			},
			link: link,
			controller: function ($scope) {
				$scope.init = function () {

				};

				$scope.init();
			}
		};

		return directive;
	}

	angular.module('umbraco.directives').directive('photonImage', photonImage);
})();

function guid() {
	function _p8(s) {
		var p = (Math.random().toString(16) + "000000000").substr(2, 8);
		return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
	}

	return _p8() + _p8(true) + _p8(true) + _p8();
}
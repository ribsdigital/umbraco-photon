using ClientDependency.Core;
using Umbraco.Core.Logging;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web.PropertyEditors;

namespace Our.Umbraco.Photon.Core.PropertyEditors
{
	[PropertyEditorAsset(ClientDependencyType.Css, "/App_Plugins/Our.Umbraco.Photon/Css/imgareaselect-photon.css")]
	[PropertyEditorAsset(ClientDependencyType.Css, "/App_Plugins/Our.Umbraco.Photon/Css/photon.css")]
	[PropertyEditorAsset(ClientDependencyType.Javascript, "/App_Plugins/Our.Umbraco.Photon/Js/jquery.imgareaselect.js")]
	[PropertyEditorAsset(ClientDependencyType.Javascript, "/App_Plugins/Our.Umbraco.Photon/Js/photon.controller.js")]
	[PropertyEditorAsset(ClientDependencyType.Javascript, "/App_Plugins/Our.Umbraco.Photon/Js/photon.hotspot.edit.controller.js")]
	[PropertyEditorAsset(ClientDependencyType.Javascript, "/App_Plugins/Our.Umbraco.Photon/Js/photon.image.directive.js")]
	[DataEditor(
		Constants.DataEditorAlias,
		"Photon Image Hot Spot Picker",
		"~/App_Plugins/Our.Umbraco.Photon/Views/photon.html",
		ValueType = "JSON",
		Group = "Common",
		Icon = "icon-picture"
	)]
	public class PhotonPropertyEditor : DataEditor
	{
		public PhotonPropertyEditor(ILogger logger) : base(logger)
		{
		}

		protected override IConfigurationEditor CreateConfigurationEditor() => new PhotonConfigurationEditor();
	}
}
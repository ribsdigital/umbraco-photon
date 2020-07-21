using Umbraco.Core.PropertyEditors;

namespace Our.Umbraco.Photon.Core.PropertyEditors
{
	public class PhotonConfiguration
	{
		[ConfigurationField(
			"backgroundColor",
			"Background Color",
			"textstring",
			Description = "Enter a HEX background color to use behind the preview image (handy if your preview image is a transparent PNG)."
		)]
		public string BackgroundColor { get; set; }

		[ConfigurationField(
			"imageWidth",
			"Image Width",
			"number",
			Description = "Enter the width in pixels for the preview image."
		)]
		public int ImageWidth { get; set; }

		[ConfigurationField(
			"hotspotMinWidth",
			"Hotspot Minimum Width",
			"number",
			Description = "Optional. Enter the minimum width in pixels for a hotspot. Defaults to 30px."
		)]
		public int HotspotMinWidth { get; set; }

		[ConfigurationField(
			"hotspotMinHeight",
			"Hotspot Minimum Height",
			"number",
			Description = "Optional. Enter the minimum height in pixels for a hotspot. Defaults to 30px."
		)]
		public int HotspotMinHeight { get; set; }

		[ConfigurationField(
			"hotspotMaxWidth",
			"Hotspot Maximum Width",
			"number",
			Description = "Optional. Enter the maximum width in pixels for a hotspot. Defaults to 100px."
		)]
		public int HotspotMaximumWidth { get; set; }

		[ConfigurationField(
			"hotspotMaxHeight",
			"Hotspot Maximum Height",
			"number",
			Description = "Optional. Enter the maximum height in pixels for a hotspot. Defaults to 100px."
		)]
		public int HotspotMaximumHeight { get; set; }

		[ConfigurationField(
			"hotspotResizable",
			"Resizable Hotspot?",
			"boolean",
			Description = "Used with the min/max width and height to determine if a hotspot can be resized within the available dimensions"
		)]
		public bool HotspotResizable { get; set; }

		[ConfigurationField(
			"hideLabel",
			"Hide Label?",
			"boolean",
			Description = "Select whether to hide the property label."
		)]
		public bool HideLabel { get; set; }
	}
}
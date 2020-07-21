using Newtonsoft.Json;
using Umbraco.Web.Models;

namespace Our.Umbraco.Photon.Core.Models
{
	public class PhotonTag
	{
		[JsonProperty("id")]
		public string Id { get; set; }

		[JsonProperty("x")]
		public decimal X { get; set; }

		[JsonProperty("y")]
		public decimal Y { get; set; }

		[JsonProperty("width")]
		public decimal Width { get; set; }

		[JsonProperty("height")]
		public decimal Height { get; set; }

		[JsonProperty("title")]
		public string Title { get; set; }

		[JsonProperty("summary")]
		public string Summary { get; set; }

		[JsonProperty("link")]
		public Link Link { get; set; }
	}
}
﻿using System;
using Newtonsoft.Json;
using Our.Umbraco.Photon.Core.Models;
using Umbraco.Core;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web.PublishedCache;

namespace Our.Umbraco.Photon.Core.Converters
{
	public class PhotonValueConverter : IPropertyValueConverter
	{
		private readonly IPublishedSnapshotAccessor _publishedSnapshotAccessor;

		public PhotonValueConverter(IPublishedSnapshotAccessor publishedSnapshotAccessor)
		{
			_publishedSnapshotAccessor = publishedSnapshotAccessor;
		}

		public bool IsConverter(IPublishedPropertyType propertyType)
		{
			return Constants.DataEditorAlias.Equals(propertyType.EditorAlias);
		}

		public bool? IsValue(object value, PropertyValueLevel level)
		{
			return value?.ToString() != "[]";
		}

		public Type GetPropertyValueType(IPublishedPropertyType propertyType)
		{
			return typeof(PhotonValue);
		}

		public PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
		{
			return PropertyCacheLevel.None;
		}

		public object ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object source, bool preview)
		{
			if (source == null || source.ToString().IsNullOrWhiteSpace() || source.ToString() == "{}")
			{
				return null;
			}

			var value = JsonConvert.DeserializeObject<PhotonValue>(source.ToString());

			if (value.ImageId <= 0)
			{
				return value;
			}

			value.Image = _publishedSnapshotAccessor.PublishedSnapshot.Media.GetById(value.ImageId);

			return value;
		}

		public object ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
		{
			return inter;
		}

		public object ConvertIntermediateToXPath(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
		{
			return null;
		}
	}
}
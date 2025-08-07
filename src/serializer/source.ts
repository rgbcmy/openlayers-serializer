import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import ImageStatic from 'ol/source/ImageStatic';
import VectorSource from 'ol/source/Vector';
import VectorTile from 'ol/source/VectorTile';
import GeoJSON from 'ol/format/GeoJSON';
import MVT from 'ol/format/MVT';
import type { ISerializedSource } from '../dto/source';

export function serializeSource(source: any): ISerializedSource {
  if (source instanceof XYZ) {
    return {
      type: 'XYZ',
      attributions:(source.getAttributions() as any) ?? null,
    
      url: source.getUrls()?.[0] ?? null,
    };
  }

  if (source instanceof OSM) {
    return {
      type: 'OSM',
    };
  }

  if (source instanceof ImageStatic) {
    return {
      type: 'ImageStatic',
      url: source.getUrl?.() ?? '',
      imageExtent: source.getImageExtent() as [number, number, number, number],
    };
  }

  if (source instanceof VectorSource) {
    // return {
    //   type: 'GeoJSON',
    //   features: new GeoJSON().writeFeaturesObject(source.getFeatures()),
    // };
  }

  if (source instanceof VectorTile) {
    // return {
    //   type: 'MVT',
    //   url: source.getUrls()?.[0] ?? '',
    // };
  }

  throw new Error('Unsupported source type');
}

export function deserializeSource(data: ISerializedSource): any {
  switch (data.type) {
    case 'XYZ':
      return new XYZ({ url: data.url ?? '' });

    case 'OSM':
      return new OSM();

    // case 'ImageStatic':
    //   return new ImageStatic({
    //     url: data.url,
    //     imageExtent: data.imageExtent,
    //   });

    // case 'GeoJSON':
    //   return new VectorSource({
    //     features: new GeoJSON().readFeatures(data.features),
    //   });

    // case 'MVT':
    //   return new VectorTileSource({
    //     url: data.url,
    //     format: new MVT(),
    //   });

    default:
      // Type assertion to ensure data has a 'type' property
      throw new Error(`Unsupported source type: ${(data as ISerializedSource).type}`);
  }
}

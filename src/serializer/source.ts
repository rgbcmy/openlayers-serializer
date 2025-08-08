import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import ImageStatic from 'ol/source/ImageStatic';
import VectorSource from 'ol/source/Vector';
import VectorTile from 'ol/source/VectorTile';
import GeoJSON from 'ol/format/GeoJSON';
import MVT from 'ol/format/MVT';
import type { ISerializedSource, IXYZSource } from '../dto/source';
import type { Source, Tile } from 'ol/source';
import { serializeFunction } from './utils';

export function serializeSource(source: Source): ISerializedSource {
  if (source instanceof XYZ) {
    let sourceDto: IXYZSource = {
      type: 'XYZ',
      attributions: (source.getAttributions() as any) ?? null,
      attributionsCollapsible: source.getAttributionsCollapsible() ?? true,
      //这个暂时不动
      cacheSize: null,
      crossOrigin: ((source as any).crossOrigin) || source.get('crossOrigin')||'anonymous',
      interpolate: source.getInterpolate() ?? true,
      opaque: ((source as any).opaque_) || source.get('opaque') || false,
      projection: source.getProjection()?.getCode() ?? "EPSG:3857",
      reprojectionErrorThreshold: ((source as any).reprojectionErrorThreshold_) || source.get('reprojectionErrorThreshold') || 0.5,
      maxZoom: source.getTileGrid()?.getMaxZoom() || source.get('maxZoom') || 42,//它会用来创建 tileGrid，如果tileGrid没有传入
      minZoom: source.getTileGrid()?.getMinZoom() || source.get('minZoom') || 0,
      maxResolution: source.get('maxResolution'),//这个是用来创建 tileGrid 的,但是没有get方法，如果没有传入 tileGrid
      tileGrid: {
        extent: source.getTileGrid()?.getExtent(),
        minZoom:source.getTileGrid()?.getMinZoom(),
        origin: source.getTileGrid()?.getOrigin(source.getTileGrid()?.getMinZoom()??0),
        origins: source.getTileGrid()?.getOrigins(),
        resolutions:source.getTileGrid()?.getResolutions(),
        //设置每个层级的瓦片大小，建议不保存，通过extent和origin会自动计算
        //sizes:source.getTileGrid()?.getSizes(),
        tileSize: source.getTileGrid()?.getTileSize(0),
        tileSizes:source.getTileGrid()?.getTile(),
      } as any, // TileGrid type
      // TileGrid type
      tileLoadFunction: serializeFunction(source.getTileLoadFunction),//((url: string, image: HTMLImageElement) => void)
      //这个不存储，因为不同的设备像素比率不同
      //tilePixelRatio: source.getTilePixelRatio() ?? 1,
      tileSize: source.getTileSize(),
      gutter: source.getGutter() ?? 0,
      tileUrlFunction: serializeFunction(source.getTileUrlFunction),//((tileCoord: [number, number, number], pixelRatio: number, projection: string) => string) | null;
      url: source.get('Url'),
      urls: source.getUrls(),
      wrapX: source.getWrapX() ?? true,
      transition: ((source as any).tileOptions.transition)||source.get('transition') || 250,
      zDirection: (source.zDirection as any) ?? 0,
    };
    return sourceDto
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

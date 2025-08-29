import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import ImageStatic from 'ol/source/ImageStatic';
import VectorSource from 'ol/source/Vector';
import VectorTile from 'ol/source/VectorTile';
import GeoJSON from 'ol/format/GeoJSON';
import MVT from 'ol/format/MVT';
import WKT from 'ol/format/WKT';
import TopoJSON from 'ol/format/TopoJSON';
import GPX from 'ol/format/GPX';
import IGC from 'ol/format/IGC';
import KML from 'ol/format/KML';
import OSMXML from 'ol/format/OSMXML';
import Polyline from 'ol/format/Polyline';
import type {
  ISerializedSource, IVectorSource, IXYZSource, IOGCMapTile, ITileArcGISRest, ITileWMS, ITileJSON, IZoomify,
  IImageStatic, IImageWMS, IImageArcGISRest,
  IGeoTIFF,
  IUTFGrid,
  ITileGrid,
  IWMTSTileGrid,
  IVectorTile,
  ICluster
} from '../dto/source';
import { Cluster, GeoTIFF, ImageArcGISRest, ImageWMS, OGCMapTile, OGCVectorTile, Source, TileArcGISRest, TileJSON, TileWMS, UTFGrid, WMTS, Zoomify } from 'ol/source';
import { deserializeFunction, serializeFunction } from './utils';
// import type { TileGrid } from 'ol/tilegrid';
import TileGrid from 'ol/tilegrid/TileGrid.js';
import type { AttributionLike } from 'ol/source/Source';
import type { Extent } from 'ol/extent';
import { toSize, type Size } from 'ol/size';
import { all, bbox, tile } from 'ol/loadingstrategy'
import type { TileCoord } from 'ol/tilecoord';
import type { Projection } from 'ol/proj';
import { quadKey } from "ol/source/BingMaps";
import { injectFunction, registerItem, registry } from '../common/registry';
import type { ServerType } from 'ol/source/wms';
import type { SourceInfo } from 'ol/source/GeoTIFF';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import type { RequestEncoding } from 'ol/source/WMTS';
//注册全局函数
registerItem('quadKey', quadKey);
//矢量数据源加载策略


export function serializeSource(source: Source): ISerializedSource {
  
  if (source instanceof XYZ) {
    let tileGrid = source.getTileGrid();
    let tileGridDto
    if (tileGrid) {
      tileGridDto = serializeTileGrid(tileGrid);
    }

    let sourceDto: IXYZSource = {
      type: 'XYZ',
      attributions: (source.getAttributions() as any) ?? null,
      attributionsCollapsible: source.getAttributionsCollapsible() ?? true,
      //这个暂时不动
      cacheSize: null,
      crossOrigin: ((source as any).crossOrigin) || source.get('crossOrigin'),// || 'anonymous',
      interpolate: source.getInterpolate() ?? true,
      opaque: ((source as any).opaque_) || source.get('opaque') || false,
      projection: source.getProjection()?.getCode() ?? undefined,
      reprojectionErrorThreshold: ((source as any).reprojectionErrorThreshold_) || source.get('reprojectionErrorThreshold') || 0.5,
      maxZoom: source.getTileGrid()?.getMaxZoom() || source.get('maxZoom') || 42,//它会用来创建 tileGrid，如果tileGrid没有传入
      minZoom: source.getTileGrid()?.getMinZoom() || source.get('minZoom') || 0,
      //todo
      maxResolution: source.get('maxResolution'),//这个是用来创建 tileGrid 的,但是没有get方法，如果没有传入 tileGrid
      tileGrid: tileGridDto,
      // TileGrid type 
      tileLoadFunction: serializeFunction(source.getTileLoadFunction()),//((url: string, image: HTMLImageElement) => void)
      //这个不存储，因为不同的设备像素比率不同
      //tilePixelRatio: source.getTilePixelRatio() ?? 1,
      tileSize: (tileGrid as any)['tileSize_'],
      gutter: source.getGutter() ?? 0,
      tileUrlFunction: serializeFunction(source.getTileUrlFunction()),//((tileCoord: [number, number, number], pixelRatio: number, projection: string) => string) | null;
      //todo
      url: source.get('url'),
      urls: source.getUrls(),
      wrapX: source.getWrapX() ?? true,
      transition: ((source as any).tileOptions.transition) || source.get('transition') || 250,
      zDirection: (source.zDirection as any) ?? 0,
    };
    return sourceDto
  }
  if (source instanceof TileArcGISRest) {
    let tileGrid = source.getTileGrid();
    let tileGridDto
    if (tileGrid) {
      tileGridDto = serializeTileGrid(tileGrid);
    }
    return {
      type: "TileArcGISRest",
      attributions: (source.getAttributions() as any) ?? null,
      cacheSize: null,
      crossOrigin: ((source as any).crossOrigin) || source.get('crossOrigin'),// || 'anonymous',
      interpolate: source.getInterpolate() ?? true,
      params: source.getParams(),
      hidpi: source['hidpi_'] ?? true,
      tileGrid: tileGridDto,
      projection: source.getProjection()?.getCode() ?? undefined,
      reprojectionErrorThreshold: ((source as any).reprojectionErrorThreshold_) || source.get('reprojectionErrorThreshold') || 0.5,
      tileLoadFunction: serializeFunction(source.getTileLoadFunction()),
      //todo
      url: source.get('url'),
      wrapX: source.getWrapX() ?? true,
      transition: ((source as any).tileOptions.transition) || source.get('transition'),
      urls: source.getUrls(),
      zDirection: (source.zDirection as any) ?? 0,
    }
  }
  if (source instanceof TileJSON) {
    return {
      type: "TileJSON",
      attributions: (source.getAttributions() as any) ?? null,
      cacheSize: null,
      crossOrigin: ((source as any).crossOrigin) || source.get('crossOrigin'),// || 'anonymous',
      interpolate: source.getInterpolate() ?? true,
      //todo 
      jsonp: source.get('jsonp') ?? false,
      reprojectionErrorThreshold: ((source as any).reprojectionErrorThreshold_) || source.get('reprojectionErrorThreshold') || 0.5,
      tileJson: source.getTileJSON(),
      tileLoadFunction: serializeFunction(source.getTileLoadFunction()),
      tileSize: source['tileSize_'],
      //todo
      url: source.get('url'),
      wrapX: source.getWrapX() ?? true,
      transition: ((source as any).tileOptions.transition) || source.get('transition'),
      zDirection: (source.zDirection as any) ?? 0,
    }
  }
  if (source instanceof TileWMS) {
    let tileGrid = source.getTileGrid();
    let tileGridDto
    if (tileGrid) {
      tileGridDto = serializeTileGrid(tileGrid);
    }
    return {
      type: "TileWMS",
      attributions: (source.getAttributions() as any) ?? null,
      cacheSize: null,
      crossOrigin: ((source as any).crossOrigin) || source.get('crossOrigin'),// || 'anonymous',
      interpolate: source.getInterpolate() ?? true,
      params: source.getParams(),
      gutter: source.getGutter() ?? 0,
      hidpi: source['hidpi_'] ?? true,
      projection: source.getProjection()?.getCode() ?? undefined,
      reprojectionErrorThreshold: ((source as any).reprojectionErrorThreshold_) || source.get('reprojectionErrorThreshold') || 0.5,
      //todo
      //tileClass:source['tileClass']
      tileGrid: tileGridDto,
      serverType: source['serverType_'],
      tileLoadFunction: serializeFunction(source.getTileLoadFunction()),
      //todo
      url: source.get('url'),
      urls: source.getUrls(),
      wrapX: source.getWrapX() ?? true,
      transition: ((source as any).tileOptions.transition) || source.get('transition'),
      zDirection: (source.zDirection as any) ?? 0,
    }
  }

  if (source instanceof WMTS) {
    let wmtsTileGrid = source.getTileGrid() as WMTSTileGrid;
    let wmtsTileGridDto
    if (wmtsTileGrid) {
      wmtsTileGridDto = serializeWMTTileGrid(wmtsTileGrid);
    }
    return {
      type: "WMTS",
      attributions: (source.getAttributions() as any) ?? null,
      attributionsCollapsible: source.getAttributionsCollapsible() ?? true,
      //这个暂时不动
      cacheSize: null,
      crossOrigin: ((source as any).crossOrigin) || source.get('crossOrigin'),// || 'anonymous',
      interpolate: source.getInterpolate() ?? true,
      tileGrid: wmtsTileGridDto,
      projection: source.getProjection()?.getCode() ?? undefined,
      reprojectionErrorThreshold: ((source as any).reprojectionErrorThreshold_) || source.get('reprojectionErrorThreshold') || 0.5,
      requestEncoding: source.getRequestEncoding(),
      layer: source.getLayer(),
      style: source.getStyle(),
      //todo
      //tileClass:source['tileClass']
      tilePixelRatio: source['tilePixelRatio_'] ?? 1,
      format: source.getFormat() ?? 'image/jpeg',
      version: source.getVersion() ?? '1.0.0',
      matrixSet: source.getMatrixSet(),
      dimensions: source.getDimensions(),
      //todo url
      url: source.get('url'),
      tileLoadFunction: serializeFunction(source.getTileLoadFunction()),
      urls: source.getUrls(),
      wrapX: source.getWrapX() ?? true,
      transition: ((source as any).tileOptions.transition) || source.get('transition'),
      zDirection: (source.zDirection as any) ?? 0,
    }
  }
  if (source instanceof Zoomify) {
    let tileGrid = source.getTileGrid();
    let tileGridDto
    if (tileGrid) {
      tileGridDto = serializeTileGrid(tileGrid);
    }
    return {
      type: "Zoomify",
      attributions: (source.getAttributions() as any) ?? null,
      cacheSize: null,
      crossOrigin: ((source as any).crossOrigin) || source.get('crossOrigin'),// || 'anonymous',
      interpolate: source.getInterpolate() ?? true,
      projection: source.getProjection()?.getCode() ?? undefined,
      tilePixelRatio: source['tilePixelRatio_'] ?? 1,
      reprojectionErrorThreshold: ((source as any).reprojectionErrorThreshold_) || source.get('reprojectionErrorThreshold') || 0.5,
      //todo
      url: source.get('url'),
      //todo
      tierSizeCalculation: source.get('tierSizeCalculation'),
      //todo
      size: getZoomifyImageSize(source),// source.get('size'),
      extent: tileGrid?.getExtent() as [number, number, number, number],
      transition: ((source as any).tileOptions.transition) || source.get('transition'),
      //todo
      tileSize: tileGrid?.getTileSize(0) as any,
      zDirection: (source.zDirection as any) ?? 0,
    }

  }
  if (source instanceof GeoTIFF) {
    return {
      type: "GeoTIFF",
      sources: source['sourceInfo_'] ?? [],
      sourceOptions: source['sourceOptions_'],
      convertToRGB: source.convertToRGB_ ?? false,
      normalize: source['normalize_'] ?? true,
      opaque: source['opaque_'] ?? false,
      projection: source.getProjection()?.getCode() ?? undefined,
      transition: ((source as any).tileOptions.transition) || source.get('transition') || 250,
      wrapX: source.getWrapX() ?? false,
      interpolate: source.getInterpolate() ?? true
    }

  }
  if (source instanceof UTFGrid) {
    return {
      type: "UTFGrid",
      preemptive: source['preemptive_'] ?? true,
      jsonp: source['jsonp_'] ?? false,
      //todo 暂时无法获取tileJSON
      tileJSON: source.get('tileJSON'),
      //todo 暂时无法获取url
      url: source.get('url'),

      wrapX: source.getWrapX() ?? true,
      zDirection: (source.zDirection as any) ?? 0
    }
  }
  if (source instanceof OGCMapTile) {
    return {
      type: "OGCMapTile",
      //todo 无法获取url
      url: source.get('url'),
      //todo 无法获取context
      context: source.get('context'),
      //todo 无法获取mediaType
      mediaType: source.get('mediaType'),
      projection: source.getProjection()?.getCode() ?? undefined,
      attributions: (source.getAttributions() as any),
      cacheSize: undefined,
      crossOrigin: ((source as any).crossOrigin) || source.get('crossOrigin'),
      interpolate: source.getInterpolate() ?? true,
      reprojectionErrorThreshold: ((source as any).reprojectionErrorThreshold_) || source.get('reprojectionErrorThreshold') || 0.5,
      tileLoadFunction: serializeFunction(source.getTileLoadFunction()),
      wrapX: source.getWrapX() ?? true,
      transition: ((source as any).tileOptions.transition) || source.get('transition') || 250,
      //todo 无法获取collections
      collections: source.get('collections')
    }
  }

  //todo
  if (source instanceof OSM) {
    return {
      type: 'OSM',
    };
  }
  if (source instanceof ImageArcGISRest) {
    let sourceDto: IImageArcGISRest = {
      type: 'ImageArcGISRest',
      attributions: (source.getAttributions() as any) ?? null,
      crossOrigin: ((source as any).crossOrigin) || source.get('crossOrigin'),
      hidpi: source['hidpi_'] ?? true,
      //todo
      //imageLoadFunction:undefined,
      interpolate: source.getInterpolate() ?? true,
      params: source.getParams(),
      projection: source.getProjection()?.getCode() ?? undefined,
      ratio: source['ratio_'] ?? 1.5,
      resolutions: source.getResolutions(),
      url: source.getUrl()
    }
    return sourceDto;
  }

  if (source instanceof ImageStatic) {
    return {
      type: 'ImageStatic',
      attributions: (source.getAttributions() as any),
      crossOrigin: ((source as any).crossOrigin) || source.get('crossOrigin'), //|| 'anonymous',
      imageExtent: source.getImageExtent() as [number, number, number, number],
      //todo
      //imageLoadFunction:source.
      interpolate: source.getInterpolate() ?? true,
      projection: source.getProjection()?.getCode() ?? undefined,
      url: source.getUrl(),
    };
  }
  if (source instanceof ImageWMS) {
    return {
      type: 'ImageWMS',
      attributions: (source.getAttributions() as any),
      crossOrigin: ((source as any).crossOrigin) || source.get('crossOrigin'), //|| 'anonymous',
      hidpi: source['hidpi_'] ?? true,
      serverType: source['serverType_'],
      //todo
      //imageLoadFunction:undefined
      interpolate: source.getInterpolate() ?? true,
      params: source.getParams(),
      projection: source.getProjection()?.getCode() ?? undefined,
      //todo
      //imageLoadFunction:source.
      ratio: source['ratio_'] ?? 1.5,
      resolutions: source.getResolutions(),
      url: source.getUrl(),
    };
  }
  //注:Cluster 继承自vectorSource，所以要先判断
  if (source instanceof Cluster) {
    
    return {
      type: 'Cluster',
      attributions: (source.getAttributions() as any) ?? null,
      distance: source.getDistance(),
      minDistance: source.getMinDistance(),
      geometryFunction: source['geometryFunction']?.toString() ?? undefined,
      createCluster: source['createCustomCluster_']?.toString() ?? undefined,
      source: serializeSource(source.getSource() as VectorSource) as IVectorSource,
      wrapX: source.getWrapX()
    }
  }
  if (source instanceof VectorSource) {
    
    let sourceDto: IVectorSource = {
      type: 'Vector',
      attributions: (source.getAttributions() as any) ?? null,
      //todo
      //features: new GeoJSON().writeFeaturesObject(source.getFeatures()),
      //TODO
      //features:undefined,
      //TODO
      //loader;undefined,
      format: serializeFormat(source.getFormat()),
      overlaps: source.getOverlaps() ?? true,
      strategy: getBuiltInStrategyName(source['strategy_'] ?? all),
      url: source.getUrl()?.toString() ?? undefined,
      useSpatialIndex: source['featuresRtree_'] ? true : false,
      wrapX: source.getWrapX()
      //loader:undefined
    };
    return sourceDto
  }
  if (source instanceof VectorTile) {
    let tileGrid = source.getTileGrid();
    let tileGridDto
    if (tileGrid) {
      tileGridDto = serializeTileGrid(tileGrid);
    }
    return {
      type: 'VectorTile',
      attributions: (source.getAttributions() as any),

      attributionsCollapsible: source.getAttributionsCollapsible() ?? true,
      cacheSize: null,
      extent: source.getTileGrid()?.getExtent() as [number, number, number, number],
      format: serializeFormat(source['format_']),
      overlaps: source.getOverlaps() ?? true,
      projection: source.getProjection()?.getCode(),
      //无需序列化
      //state:undefined
      //todo
      //tileClass:source['tileClass']
      maxZoom: source.getTileGrid()?.getMaxZoom() || source.get('maxZoom') || 42,//它会用来创建 tileGrid，如果tileGrid没有传入
      minZoom: source.getTileGrid()?.getMinZoom() || source.get('minZoom') || 0,
      tileSize: (tileGrid as any)['tileSize_'],
      //todo
      maxResolution: source.get('maxResolution'),//这个是用来创建 tileGrid 的,但是没有get方法，如果没有传入 tileGrid
      tileGrid: tileGridDto,
      //todo 如果是自定义函数才需要序列化
      // tileLoadFunction: serializeFunction(source.getTileLoadFunction()),
      //todo
      //tileUrlFunction: serializeFunction(source.getTileUrlFunction()),
      //todo
      url: source.get('url'),
      transition: ((source as any).tileOptions.transition) || source.get('transition') || 250,
      urls: source.getUrls(),
      wrapX: source.getWrapX() ?? true,
      zDirection: (source.zDirection as any) ?? 0
    };
  }
  if (source instanceof OGCVectorTile) {
    let tileGrid = source.getTileGrid();
    let tileGridDto
    if (tileGrid) {
      tileGridDto = serializeTileGrid(tileGrid);
    }
    return {
      type: 'OGCVectorTile',
      //todo
      url: source.get('url'),
      //todo 暂时无法获取
      context: source.get('context'),
      format: serializeFormat(source['format_']),
      //todo 无法获取
      mediaType: source.get('mediaType'),

      attributions: (source.getAttributions() as any),
      attributionsCollapsible: source.getAttributionsCollapsible() ?? true,
      cacheSize: null,
      overlaps: source.getOverlaps() ?? true,
      projection: source.getProjection()?.getCode(),
      //todo
      //tileClass:source['tileClass']
      transition: ((source as any).tileOptions.transition) || source.get('transition') || 250,
      wrapX: source.getWrapX() ?? true,
      zDirection: (source.zDirection as any) ?? 0,
      //todo 暂时无法获取
      collections: source.get('collections')

    };
  }
  throw new Error('Unsupported source type');
}

export function deserializeSource(data: ISerializedSource): any {
  
  switch (data.type) {
    case 'XYZ':
      let xyzSourceDto = data as IXYZSource
      //let tileUrlFunction = xyzSourceDto.tileUrlFunction ? eval("(" + xyzSourceDto.tileUrlFunction + ")") : undefined;
      let tileUrlFunction = xyzSourceDto.tileUrlFunction ? injectFunction(xyzSourceDto.tileUrlFunction) : undefined;
      let tileLoadFunction = xyzSourceDto.tileLoadFunction ? injectFunction(xyzSourceDto.tileLoadFunction) : undefined;


      return new XYZ({
        attributions: xyzSourceDto.attributions as AttributionLike,
        attributionsCollapsible: xyzSourceDto.attributionsCollapsible ?? true,
        cacheSize: xyzSourceDto.cacheSize ?? undefined,
        crossOrigin: xyzSourceDto.crossOrigin,
        interpolate: xyzSourceDto.interpolate ?? true,
        opaque: xyzSourceDto.opaque ?? false,
        projection: xyzSourceDto.projection ?? undefined,
        reprojectionErrorThreshold: xyzSourceDto.reprojectionErrorThreshold ?? 0.5,
        maxZoom: xyzSourceDto.maxZoom ?? 42,
        minZoom: xyzSourceDto.minZoom ?? 0,
        maxResolution: xyzSourceDto.maxResolution ?? undefined,
        tileGrid: xyzSourceDto.tileGrid
          ? new TileGrid({
            extent: (xyzSourceDto.tileGrid.extent as Extent),
            minZoom: xyzSourceDto.tileGrid.minZoom ?? 0,
            origin: xyzSourceDto.tileGrid.origin ?? undefined,
            origins: xyzSourceDto.tileGrid.origins ?? undefined,
            resolutions: xyzSourceDto.tileGrid.resolutions ?? [],
            sizes: xyzSourceDto.tileGrid.sizes as Size[],
            tileSize: xyzSourceDto.tileGrid.tileSize ?? undefined,
            tileSizes: xyzSourceDto.tileGrid.tileSizes ?? undefined
          })
          : undefined,
        tileLoadFunction: tileLoadFunction,
        tilePixelRatio: xyzSourceDto.tilePixelRatio ?? 1,
        tileSize: (xyzSourceDto.tileSize as Size) ?? [256, 256],
        gutter: xyzSourceDto.gutter ?? 0,
        tileUrlFunction: tileUrlFunction,
        url: xyzSourceDto.url ?? undefined,
        urls: data.urls ?? undefined,
        wrapX: xyzSourceDto.wrapX ?? true,
        transition: xyzSourceDto.transition ?? 250,
        zDirection: xyzSourceDto.zDirection ?? 0
      });
    case 'TileArcGISRest':
      let tileArcGISRestSourceDto = data as ITileArcGISRest
      return new TileArcGISRest({
        attributions: tileArcGISRestSourceDto.attributions as AttributionLike,
        cacheSize: tileArcGISRestSourceDto.cacheSize ?? undefined,
        crossOrigin: tileArcGISRestSourceDto.crossOrigin,
        interpolate: tileArcGISRestSourceDto.interpolate ?? true,
        params: tileArcGISRestSourceDto.params as any,
        hidpi: tileArcGISRestSourceDto.hidpi ?? true,
        tileGrid: tileArcGISRestSourceDto.tileGrid ? new TileGrid({
          extent: (tileArcGISRestSourceDto.tileGrid.extent as Extent),
          minZoom: tileArcGISRestSourceDto.tileGrid.minZoom ?? 0,
          origin: tileArcGISRestSourceDto.tileGrid.origin ?? undefined,
          origins: tileArcGISRestSourceDto.tileGrid.origins ?? undefined,
          resolutions: tileArcGISRestSourceDto.tileGrid.resolutions ?? [],
          sizes: tileArcGISRestSourceDto.tileGrid.sizes as Size[],
          tileSize: tileArcGISRestSourceDto.tileGrid.tileSize ?? undefined,
          tileSizes: tileArcGISRestSourceDto.tileGrid.tileSizes ?? undefined
        }) : undefined,
        projection: tileArcGISRestSourceDto.projection as any,
        reprojectionErrorThreshold: tileArcGISRestSourceDto.reprojectionErrorThreshold ?? 0.5,
        tileLoadFunction: tileArcGISRestSourceDto.tileLoadFunction ? injectFunction(tileArcGISRestSourceDto.tileLoadFunction) : undefined,
        url: tileArcGISRestSourceDto.url,
        wrapX: tileArcGISRestSourceDto.wrapX ?? true,
        transition: tileArcGISRestSourceDto.transition ?? undefined,
        urls: tileArcGISRestSourceDto.urls ?? undefined,
        zDirection: tileArcGISRestSourceDto.zDirection ?? 0
      })
    case 'Zoomify':
      let zoomifySourceDto = data as IZoomify
      return new Zoomify({
        attributions: zoomifySourceDto.attributions as AttributionLike,
        cacheSize: undefined,
        crossOrigin: zoomifySourceDto.crossOrigin,
        interpolate: zoomifySourceDto.interpolate ?? true,
        projection: zoomifySourceDto.projection ?? undefined,
        tilePixelRatio: zoomifySourceDto.tilePixelRatio ?? undefined,
        reprojectionErrorThreshold: zoomifySourceDto.reprojectionErrorThreshold ?? 0.5,
        url: zoomifySourceDto.url ?? "",
        tierSizeCalculation: (zoomifySourceDto.tierSizeCalculation ?? 'default') as 'default' | 'truncated',
        size: zoomifySourceDto.size as Size,
        extent: zoomifySourceDto.extent ?? undefined,
        transition: zoomifySourceDto.transition ?? undefined,
        tileSize: (zoomifySourceDto.tileSize as any) ?? 256,
        zDirection: zoomifySourceDto.zDirection ?? 0,
      })

    case 'GeoTIFF':
      let geoTIFFSourceDto = data as IGeoTIFF
      let geoTIFFSource = new GeoTIFF({
        sources: (geoTIFFSourceDto.sources as SourceInfo[]),
        sourceOptions: geoTIFFSourceDto.sourceOptions,
        convertToRGB: geoTIFFSourceDto.convertToRGB ?? 'auto',
        normalize: geoTIFFSourceDto.normalize ?? true,
        opaque: geoTIFFSourceDto.opaque ?? false,
        projection: geoTIFFSourceDto.projection as any,
        transition: geoTIFFSourceDto.transition ?? 250,
        wrapX: geoTIFFSourceDto.wrapX ?? false,
        interpolate: geoTIFFSourceDto.interpolate ?? true
      })
      return geoTIFFSource;
    case 'OSM':
      return new OSM();
    case 'UTFGrid':
      let utfGridDto = data as IUTFGrid
      return new UTFGrid({
        preemptive: utfGridDto.preemptive ?? true,
        jsonp: utfGridDto.jsonp ?? false,
        tileJSON: utfGridDto.tileJSON,
        url: utfGridDto.url,
        wrapX: utfGridDto.wrapX,
        zDirection: utfGridDto.zDirection ?? 0
      })
    case 'OGCMapTile':
      let oGCMapTileSourceDto = data as IOGCMapTile;
      return new OGCMapTile({
        url: oGCMapTileSourceDto.url,
        context: oGCMapTileSourceDto.context,
        mediaType: oGCMapTileSourceDto.mediaType ?? undefined,
        projection: oGCMapTileSourceDto.projection ?? undefined,
        attributions: oGCMapTileSourceDto.attributions as AttributionLike,
        cacheSize: oGCMapTileSourceDto.cacheSize ?? undefined,
        crossOrigin: oGCMapTileSourceDto.crossOrigin,
        interpolate: oGCMapTileSourceDto.interpolate ?? true,
        reprojectionErrorThreshold: oGCMapTileSourceDto.reprojectionErrorThreshold ?? 0.5,
        tileLoadFunction: oGCMapTileSourceDto.tileLoadFunction ? injectFunction(oGCMapTileSourceDto.tileLoadFunction) : undefined,
        wrapX: oGCMapTileSourceDto.wrapX ?? true,
        transition: oGCMapTileSourceDto.transition ?? undefined,
        collections: oGCMapTileSourceDto.collections ?? undefined
      })
    case 'TileJSON':
      let tileJSONSourceDto = data as ITileJSON;
      return new TileJSON({
        attributions: tileJSONSourceDto.attributions as AttributionLike,
        cacheSize: undefined,
        crossOrigin: tileJSONSourceDto.crossOrigin,
        interpolate: tileJSONSourceDto.interpolate ?? true,
        jsonp: tileJSONSourceDto.jsonp ?? false,
        reprojectionErrorThreshold: tileJSONSourceDto.reprojectionErrorThreshold ?? 0.5,
        tileJSON: tileJSONSourceDto.tileJson as any,
        tileLoadFunction: tileJSONSourceDto.tileLoadFunction ? injectFunction(tileJSONSourceDto.tileLoadFunction) : undefined,
        tileSize: (tileJSONSourceDto.tileSize as Size) ?? [256, 256],
        url: tileJSONSourceDto.url ?? undefined,
        wrapX: tileJSONSourceDto.wrapX ?? true,
        zDirection: tileJSONSourceDto.zDirection ?? 0
      })
    case 'TileWMS':
      let tileWMSSourceDto = data as ITileWMS;
      return new TileWMS({
        attributions: tileWMSSourceDto.attributions as AttributionLike,
        attributionsCollapsible: tileWMSSourceDto.attributionsCollapsible ?? true,
        cacheSize: undefined,
        crossOrigin: tileWMSSourceDto.crossOrigin,
        interpolate: tileWMSSourceDto.interpolate ?? true,
        params: tileWMSSourceDto.params as any,
        gutter: tileWMSSourceDto.gutter ?? 0,
        hidpi: tileWMSSourceDto.hidpi ?? true,
        projection: tileWMSSourceDto.projection ?? undefined,
        reprojectionErrorThreshold: tileWMSSourceDto.reprojectionErrorThreshold ?? 0.5,
        //tileClass: undefined,
        tileGrid: tileWMSSourceDto.tileGrid ? new TileGrid({
          extent: (tileWMSSourceDto.tileGrid.extent as Extent),
          minZoom: tileWMSSourceDto.tileGrid.minZoom ?? 0,
          origin: tileWMSSourceDto.tileGrid.origin ?? undefined,
          origins: tileWMSSourceDto.tileGrid.origins ?? undefined,
          resolutions: tileWMSSourceDto.tileGrid.resolutions ?? [],
          sizes: tileWMSSourceDto.tileGrid.sizes as Size[],
          tileSize: tileWMSSourceDto.tileGrid.tileSize ?? undefined,
          tileSizes: tileWMSSourceDto.tileGrid.tileSizes ?? undefined
        }) : undefined,
        serverType: tileWMSSourceDto.serverType as ServerType,
        tileLoadFunction: tileWMSSourceDto.tileLoadFunction ? injectFunction(tileWMSSourceDto.tileLoadFunction) : undefined,
        url: tileWMSSourceDto.url ?? undefined,
        urls: tileWMSSourceDto.urls ?? undefined,
        wrapX: tileWMSSourceDto.wrapX ?? true,
        transition: tileWMSSourceDto.transition ?? undefined,
        zDirection: tileWMSSourceDto.zDirection ?? 0
      })
    case 'WMTS':
      
      let wmtsTileGrid = new WMTSTileGrid({
        extent: (data.tileGrid?.extent as Extent),
        origin: data.tileGrid?.origin ?? undefined,
        origins: data.tileGrid?.origins ?? undefined,
        resolutions: data.tileGrid?.resolutions ?? [],
        sizes: data.tileGrid?.sizes as Size[] ?? undefined,
        tileSize: data.tileGrid?.tileSize ?? undefined,
        tileSizes: data.tileGrid?.tileSizes ?? undefined,
        matrixIds: data.tileGrid?.matrixIds ?? []
      });
      return new WMTS({
        attributions: data.attributions as AttributionLike,
        attributionsCollapsible: data.attributionsCollapsible ?? true,
        cacheSize: undefined,
        crossOrigin: data.crossOrigin,
        interpolate: data.interpolate ?? true,
        tileGrid: wmtsTileGrid,
        projection: data.projection ?? undefined,
        reprojectionErrorThreshold: data.reprojectionErrorThreshold ?? 0.5,
        requestEncoding: (data.requestEncoding ?? 'KVP') as RequestEncoding,
        layer: data.layer ?? '',
        style: data.style ?? '',
        //tileClass: undefined,
        tilePixelRatio: data.tilePixelRatio ?? 1,
        format: data.format ?? 'image/jpeg',
        version: data.version ?? '1.0.0',
        matrixSet: data.matrixSet ?? '',
        dimensions: data.dimensions ?? {},
        url: data.url ?? undefined,
        tileLoadFunction: data.tileLoadFunction ? injectFunction(data.tileLoadFunction) : undefined,
        urls: data.urls ?? undefined,
        wrapX: data.wrapX ?? false,
        transition: data.transition ?? undefined,
        zDirection: data.zDirection ?? 0
      });
    case 'ImageStatic':
      return new ImageStatic({
        attributions: data.attributions as AttributionLike,
        crossOrigin: data.crossOrigin,
        imageExtent: data.imageExtent,
        interpolate: data.interpolate ?? true,
        projection: data.projection ?? undefined,
        url: data.url ?? "",
        //todo
        //imageLoadFunction:data.imageLoadFunction
      });
    //注:Cluster 必须在 Vector 之前，因为它继承自vector
    case 'Cluster':
      
      let clusterSourceDto = data as ICluster;
      let source = deserializeSource(clusterSourceDto.source as IVectorSource);
      //todo 这个函数恢复有问题，暂时不用
      let geometryFunction =undefined; //clusterSourceDto.geometryFunction ? injectFunction(clusterSourceDto.geometryFunction) : undefined;
      let createCluster = clusterSourceDto.createCluster ? injectFunction(clusterSourceDto.createCluster) : undefined;
      return new Cluster({
        attributions: clusterSourceDto.attributions as AttributionLike,
        distance: clusterSourceDto.distance ?? 20,
        minDistance: clusterSourceDto.minDistance ?? 0,
        geometryFunction: geometryFunction,
        createCluster: createCluster,
        source: source as VectorSource,
        wrapX: clusterSourceDto.wrapX ?? true
      })
    case 'Vector':
      let vectorSourceDto = data as IVectorSource;
      let format
      if (vectorSourceDto.format) {
        format = deserializeFormat(vectorSourceDto.format as FormatName);
      }

      return new VectorSource({
        attributions: vectorSourceDto.attributions as AttributionLike,
        format: format,
        //TODO
        //features:undefined,
        //TODO
        //loader;undefined,
        overlaps: vectorSourceDto.overlaps ?? true,
        strategy: (getBuiltInStrategyByName(vectorSourceDto.strategy as BuiltInStrategyName) as any),
        url: vectorSourceDto.url ?? undefined,
        useSpatialIndex: vectorSourceDto.useSpatialIndex ?? true,
        wrapX: vectorSourceDto.wrapX ?? true
        //features: new GeoJSON().readFeatures(data.features),
        //loader
      });

    case 'VectorTile':
      let vectorTileDto = data as IVectorTile;
      return new VectorTile({
        attributions: vectorTileDto.attributions as AttributionLike,
        attributionsCollapsible: vectorTileDto.attributionsCollapsible ?? true,
        cacheSize: undefined,
        extent: vectorTileDto.extent as [number, number, number, number],
        format: deserializeFormat((vectorTileDto.format as FormatName)) as any,
        overlaps: vectorTileDto.overlaps ?? true,
        projection: vectorTileDto.projection ?? undefined,
        //state:undefined
        //tileClass:undefined
        maxZoom: vectorTileDto.maxZoom ?? 22,
        minZoom: vectorTileDto.minZoom ?? 0,
        tileSize: (vectorTileDto.tileSize as Size) ?? 512,
        maxResolution: vectorTileDto.maxResolution ?? undefined,
        tileGrid: vectorTileDto.tileGrid ? new TileGrid({
          extent: (vectorTileDto.tileGrid.extent as Extent),
          minZoom: vectorTileDto.tileGrid.minZoom ?? 0,
          origin: vectorTileDto.tileGrid.origin ?? undefined,
          origins: vectorTileDto.tileGrid.origins ?? undefined,
          resolutions: vectorTileDto.tileGrid.resolutions ?? [],
          sizes: vectorTileDto.tileGrid.sizes as Size[],
          tileSize: vectorTileDto.tileGrid.tileSize ?? undefined,
          tileSizes: vectorTileDto.tileGrid.tileSizes ?? undefined
        }) : undefined,
        tileLoadFunction: vectorTileDto.tileLoadFunction ? injectFunction(vectorTileDto.tileLoadFunction) : undefined,
        tileUrlFunction: vectorTileDto.tileUrlFunction ? injectFunction(vectorTileDto.tileUrlFunction) : undefined,
        url: vectorTileDto.url ?? undefined,
        transition: vectorTileDto.transition ?? undefined,
        urls: vectorTileDto.urls ?? undefined,
        wrapX: vectorTileDto.wrapX ?? true,
        zDirection: vectorTileDto.zDirection ?? 1
      })


    case 'ImageArcGISRest':
      let ImageArcGISRestSource = new ImageArcGISRest({
        attributions: data.attributions as AttributionLike,
        crossOrigin: data.crossOrigin,
        hidpi: data.hidpi ?? true,
        //todo
        //imageLoadFunction:undefined,
        interpolate: data.interpolate ?? true,
        params: data.params as any,
        projection: data.projection ?? undefined,
        ratio: data.ratio ?? 1.5,
        resolutions: data.resolutions ?? undefined,
        url: data.url
      });
      return ImageArcGISRestSource
    case 'ImageWMS':
      let ImageWMSSource = new ImageWMS({
        attributions: data.attributions as AttributionLike,
        crossOrigin: data.crossOrigin,
        hidpi: data.hidpi ?? true,
        serverType: data.serverType as ServerType,
        //todo
        //imageLoadFunction:undefined,
        interpolate: data.interpolate ?? true,
        params: data.params as any,
        projection: data.projection ?? undefined,
        ratio: data.ratio ?? 1.5,
        resolutions: data.resolutions ?? undefined,
        url: data.url
      });
      return ImageWMSSource
    default:
      // Type assertion to ensure data has a 'type' property
      throw new Error(`Unsupported source type: ${(data as ISerializedSource).type}`);
  }
}
function getZoomifyImageSize(zoomifySource: Zoomify): [number, number] {
  const extent = zoomifySource.getTileGrid()?.getExtent() as [number, number, number, number];
  const width = Math.abs(extent[2] - extent[0]);   // maxX - minX
  const height = Math.abs(extent[3] - extent[1]);  // maxY - minY
  return [width, height];
}
function serializeTileGrid(tileGrid: TileGrid): ITileGrid {
  const minZoom = tileGrid.getMinZoom();
  const maxZoom = tileGrid.getMaxZoom();
  const resolutions = tileGrid.getResolutions();
  const extent = tileGrid.getExtent();

  const origins = tileGrid['origins_'] || null;
  const origin = tileGrid['origin_'] || null;

  const tileSizes = tileGrid['tileSizes_'] || null;
  const tileSize = tileGrid['tileSize_'] || null;

  // 通过 fullTileRanges_ 推算 sizes
  const sizes = [];
  for (let z = minZoom; z <= maxZoom; z++) {
    const range = tileGrid.getFullTileRange(z);
    if (range) {
      sizes[z] = [
        range.maxX - range.minX + 1,
        range.maxY - range.minY + 1,
      ];
    }
  }
  let res: ITileGrid = {
    extent: extent as [number, number, number, number],
    minZoom: minZoom,
    origin: origin,
    origins: origins, // TileGrid type
    resolutions: resolutions,

    //设置每个层级的瓦片大小，建议不保存，还是保存下来吧，通过extent和origin会自动计算
    sizes: sizes as [number, number][],
    tileSize: tileSize,
    //todo 验证是否真的获取到
    tileSizes: tileSizes
  }
  return res;
}
function serializeWMTTileGrid(tileGrid: WMTSTileGrid): IWMTSTileGrid {
  const minZoom = tileGrid.getMinZoom();
  const maxZoom = tileGrid.getMaxZoom();
  const resolutions = tileGrid.getResolutions();
  const extent = tileGrid.getExtent();

  const origins = tileGrid['origins_'] || null;
  const origin = tileGrid['origin_'] || null;

  const tileSizes = tileGrid['tileSizes_'] || null;
  const tileSize = tileGrid['tileSize_'] || null;
  const matrixIds = tileGrid.getMatrixIds() || null;

  // 通过 fullTileRanges_ 推算 sizes
  const sizes = [];
  for (let z = minZoom; z <= maxZoom; z++) {
    const range = tileGrid.getFullTileRange(z);
    if (range) {
      sizes[z] = [
        range.maxX - range.minX + 1,
        range.maxY - range.minY + 1,
      ];
    }
  }
  let res: IWMTSTileGrid = {
    extent: extent as [number, number, number, number],
    minZoom: minZoom,
    origin: origin,
    origins: origins, // TileGrid type
    resolutions: resolutions,
    //设置每个层级的瓦片大小，建议不保存，还是保存下来吧，通过extent和origin会自动计算
    sizes: sizes as [number, number][],
    tileSize: tileSize,
    tileSizes: tileSizes,
    matrixIds: matrixIds
  }

  return res;
}




type BuiltInStrategyName = 'all' | 'bbox' | 'tile';

const builtInStrategies: Record<BuiltInStrategyName, Function> = {
  all,
  bbox,
  tile
};

export function getBuiltInStrategyName(fn: Function): BuiltInStrategyName | undefined {
  for (const [name, f] of Object.entries(builtInStrategies)) {
    if (fn === f) return name as BuiltInStrategyName;
  }
  return undefined;
}

// 从名字 → 函数引用
export function getBuiltInStrategyByName(name: BuiltInStrategyName): Function {
  return builtInStrategies[name];
}




// 格式名字类型（可扩展）
export type FormatName =
  | 'GeoJSON'
  | 'MVT'
  | 'WKT'
  | 'TopoJSON'
  | 'GPX'
  | 'IGC'
  | 'KML'
  | 'OSMXML'
  | 'Polyline';

// 注册表：名字 -> 构造器
const formatRegistry: Record<FormatName, new (...args: any[]) => any> = {
  GeoJSON,
  MVT,
  WKT,
  TopoJSON,
  GPX,
  IGC,
  KML,
  OSMXML,
  Polyline,
};

// 序列化：实例 -> 名字
export function serializeFormat(format: any): FormatName | undefined {
  for (const [name, Ctor] of Object.entries(formatRegistry)) {
    if (format instanceof Ctor) {
      return name as FormatName;
    }
  }
  return undefined;
}

// 反序列化：名字 -> 实例
export function deserializeFormat(name: FormatName, options?: any): any {

  const Ctor = formatRegistry[name];
  if (!Ctor) throw new Error(`Unknown format: ${name}`);
  return new Ctor(options);
}
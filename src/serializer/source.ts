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
  ISerializedSource, IVectorSource, IXYZSource, IOGCMapTile, ITileArcGISRest, ITileWMS, ITileJSON,
  IImageStatic, IImageWMS, IImageArcGISRest
} from '../dto/source';
import type { Source, Tile } from 'ol/source';
import { deserializeFunction, serializeFunction } from './utils';
// import type { TileGrid } from 'ol/tilegrid';
import TileGrid from 'ol/tilegrid/TileGrid.js';
import type { AttributionLike } from 'ol/source/Source';
import type { Extent } from 'ol/extent';
import type { Size } from 'ol/size';
import { all, bbox, tile } from 'ol/loadingstrategy'
import type { TileCoord } from 'ol/tilecoord';
import type { Projection } from 'ol/proj';
import { quadKey } from "ol/source/BingMaps";
import { registerFunction, registry } from '../common/registry';
//注册全局函数
registerFunction('quadKey', quadKey);
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
      crossOrigin: ((source as any).crossOrigin) || source.get('crossOrigin') || 'anonymous',
      interpolate: source.getInterpolate() ?? true,
      opaque: ((source as any).opaque_) || source.get('opaque') || false,
      projection: source.getProjection()?.getCode() ?? "EPSG:3857",
      reprojectionErrorThreshold: ((source as any).reprojectionErrorThreshold_) || source.get('reprojectionErrorThreshold') || 0.5,
      maxZoom: source.getTileGrid()?.getMaxZoom() || source.get('maxZoom') || 42,//它会用来创建 tileGrid，如果tileGrid没有传入
      minZoom: source.getTileGrid()?.getMinZoom() || source.get('minZoom') || 0,
      maxResolution: source.get('maxResolution'),//这个是用来创建 tileGrid 的,但是没有get方法，如果没有传入 tileGrid
      tileGrid: tileGridDto,
      // TileGrid type 
      tileLoadFunction: serializeFunction(source.getTileLoadFunction()),//((url: string, image: HTMLImageElement) => void)
      //这个不存储，因为不同的设备像素比率不同
      //tilePixelRatio: source.getTilePixelRatio() ?? 1,
      tileSize: (tileGrid as any)['tileSize_'],
      gutter: source.getGutter() ?? 0,
      tileUrlFunction: serializeFunction(source.getTileUrlFunction()),//((tileCoord: [number, number, number], pixelRatio: number, projection: string) => string) | null;
      url: source.get('Url'),
      urls: source.getUrls(),
      wrapX: source.getWrapX() ?? true,
      transition: ((source as any).tileOptions.transition) || source.get('transition') || 250,
      zDirection: (source.zDirection as any) ?? 0,
    };
    return sourceDto
  }

  //todo
  if (source instanceof OSM) {
    return {
      type: 'OSM',
    };
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
      projection: source.getProjection()?.getCode() ?? "EPSG:3857",
      url: source.getUrl(),
    };
  }
  if (source instanceof VectorSource) {

    let sourceDto: IVectorSource = {
      type: 'Vector',
      attributions: (source.getAttributions() as any) ?? null,
      //attributionsCollapsible: source.getAttributionsCollapsible() ?? true,
      //projection: source.getProjection()?.getCode() ?? "EPSG:3857",
      //wrapX: source.getWrapX() ?? true,
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
      let xyzSourceDto = data as IXYZSource
      //let tileUrlFunction = xyzSourceDto.tileUrlFunction ? eval("(" + xyzSourceDto.tileUrlFunction + ")") : undefined;
      let tileUrlFunction = xyzSourceDto.tileUrlFunction ? injectFunction(xyzSourceDto.tileUrlFunction) : undefined;
      let tileLoadFunction = xyzSourceDto.tileLoadFunction ? eval("(" + xyzSourceDto.tileLoadFunction + ")") : undefined;


      return new XYZ({
        attributions: xyzSourceDto.attributions as AttributionLike,
        attributionsCollapsible: xyzSourceDto.attributionsCollapsible ?? true,
        cacheSize: xyzSourceDto.cacheSize ?? undefined,
        crossOrigin: xyzSourceDto.crossOrigin,
        interpolate: xyzSourceDto.interpolate ?? true,
        opaque: xyzSourceDto.opaque ?? false,
        projection: xyzSourceDto.projection ?? "EPSG:3857",
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

    case 'OSM':
      return new OSM();

    // case 'ImageStatic':
    //   return new ImageStatic({
    //     url: data.url,
    //     imageExtent: data.imageExtent,
    //   });

    case 'Vector':
      let vectorSourceDto = data as IVectorSource;
      return new VectorSource({
        attributions: vectorSourceDto.attributions as AttributionLike,
        format: deserializeFormat(vectorSourceDto.format as FormatName),
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

    case 'ImageStatic':
      let ImageStaticSource = new ImageStatic({
        attributions: data.attributions as AttributionLike,
        crossOrigin: data.crossOrigin,
        imageExtent: data.imageExtent,
        //todo
        //imageLoadFunction:undefined,
        interpolate: data.interpolate ?? true,
        projection: data.projection ?? "EPSG:3857",
        url: data.url ?? "",
      });
      return ImageStaticSource

    default:
      // Type assertion to ensure data has a 'type' property
      throw new Error(`Unsupported source type: ${(data as ISerializedSource).type}`);
  }
}
function calculateOriginalSizes(extent: number[], resolutions: number[], tileSizes: (number | [number, number])[]) {
  const [minX, minY, maxX, maxY] = extent;
  const extentWidth = maxX - minX;
  const extentHeight = maxY - minY;

  return resolutions.map((res, z) => {
    const ts = tileSizes[z] ?? tileSizes[0]; // 支持每级不同
    const tileWidth = Array.isArray(ts) ? ts[0] : ts;
    const tileHeight = Array.isArray(ts) ? ts[1] : ts;

    const cols = Math.ceil(extentWidth / (tileWidth * res));
    const rows = Math.ceil(extentHeight / (tileHeight * res));

    return [cols, rows] as [number, number];
  });
}

function serializeTileGrid(tileGrid: TileGrid): any {
  let originalSizes = calculateOriginalSizes(
    tileGrid?.getExtent()!,
    tileGrid?.getResolutions()!,
    (tileGrid as any).tileSizes_ || [(tileGrid as any).tileSize_] // 从实例取 tileSizes
  );
  let res = {
    extent: tileGrid.getExtent(),
    minZoom: tileGrid.getMinZoom(),
    origin: tileGrid.getOrigin(tileGrid.getMinZoom() ?? 0),
    origins: tileGrid['origins_'], // TileGrid type
    resolutions: tileGrid.getResolutions(),
    //设置每个层级的瓦片大小，建议不保存，还是保存下来吧，通过extent和origin会自动计算
    sizes: originalSizes,
    tileSize: tileGrid.getTileSize(0),
    //todo 验证是否真的获取到
    tileSizes: tileGrid['tileSizes_']
  } as any
  return res;
}


/**
 * 将完整函数声明字符串转为可调用函数，并注入注册表函数
 * @param functionCode 完整函数声明字符串，例如：
 * "function(a, b) { return a + b + helper(a); }"
 */
export function injectFunction(functionCode: string) {
  const injectedArgs = Object.keys(registry).join(',');
  const wrapper = `
    (function(${injectedArgs}) {
      return ${functionCode};
    })
  `;

  const fnFactory = eval(wrapper);
  return fnFactory(...Object.values(registry));
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
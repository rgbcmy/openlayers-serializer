export type ISerializedSource =
  | IXYZSource
  | ITileWMS
  | IWMTS
  | ITileJSON
  | ITileArcGISRest
  | IOGCMapTile
  | IVectorTile
  | IOSMSource
  | IImageArcGISRest
  | IImageStatic
  | IImageWMS
  | IGeoTIFF
  | IUTFGrid
  | IVectorSource
  | ICluster;

export interface ISource {
  type: string;
  attributions?: string[] | string | null;
  attributionsCollapsible?: boolean | null;
  projection?: string | null;
  wrapX?: boolean | null;
  state?: string | null;
  interpolate?: boolean | null;
}

export interface IXYZSource extends ISource {
  type: 'XYZ';
  attributions?: string[] | string | null;
  attributionsCollapsible?: boolean | null;
  cacheSize?: number | null;
  crossOrigin?: string | null;
  interpolate?: boolean | null;
  opaque?: boolean | null;
  projection?: string | null;
  reprojectionErrorThreshold?: number | null;
  maxZoom?: number | null;
  minZoom?: number | null;
  maxResolution?: number | null;
  tileGrid?: ITileGrid; // TileGrid type
  tileLoadFunction?: string;//((url: string, image: HTMLImageElement) => void)
  tilePixelRatio?: number | null;
  tileSize?: [number, number] | null;
  gutter?: number | null;
  tileUrlFunction?: string;//((tileCoord: [number, number, number], pixelRatio: number, projection: string) => string) | null;
  url?: string | null;
  urls?: string[] | null;
  wrapX?: boolean | null;
  transition?: number | null;
  zDirection?: number | null;
}
export interface ITileWMS extends ISource {
  type: 'TileWMS';
  attributions?: string[] | string | null;
  attributionsCollapsible?: boolean | null;
  cacheSize?: number | null;
  crossOrigin?: string | null;
  params?: Record<string, any> | null;
  gutter?: number | null;
  hidpi?: boolean | null;
  projection?: string | null;
  reprojectionErrorThreshold?: number | null;
  tileClass?: string | null;
  tileGrid?: ITileGrid; // TileGrid type
  serverType?: string | null;
  tileLoadFunction?: string; // ((url: string, image: HTMLImageElement) => void)
  url?: string;
  urls?: string[] | null;
  wrapX?: boolean | null;
  transition?: number | null;
  zDirection?: number | null;
}
export interface IWMTS extends ISource {
  type: 'WMTS';
  attributions?: string[] | string | null;
  attributionsCollapsible?: boolean | null;
  cacheSize?: number | null;
  crossOrigin?: string | null;
  interpolate?: boolean | null;
  tileGrid?: IWMTSTileGrid; // WMTS TileGrid type
  projection?: string | null;
  reprojectionErrorThreshold?: number | null;
  requestEncoding?: string | null;
  layer?: string | null;
  style?: string | null;
  tileClass?: string | null;
  tilePixelRatio?: number | null;
  format?: string | null;
  version?: string | null;
  matrixSet?: string | null;
  dimensions?: Record<string, any> | null;
  url?: string;
  tileLoadFunction?: string; // ((url: string, image: HTMLImageElement) => void)
  urls?: string[] | null;
  wrapX?: boolean | null;
  transition?: number | null;
  zDirection?: number | null;
}
export interface ITileJSON extends ISource {
  type: 'TileJSON';
  attributions?: string[] | string | null;
  cacheSize?: number | null;
  crossOrigin?: string | null;
  interpolate?: boolean | null;
  jsonp?: string | null;
  reprojectionErrorThreshold?: number | null;
  tileJson?: Record<string, any> | null;
  tileLoadFunction?: string; // ((url: string, image: HTMLImageElement) => void)
  tileSize?: [number, number] | null;
  url?: string;
  wrapX?: boolean | null;
  transition?: number | null;
  zDirection?: number | null;
}
export interface ITileArcGISRest extends ISource {
  type: 'TileArcGISRest';
  attributions?: string[] | string | null;
  cacheSize?: number | null;
  crossOrigin?: string | null;
  interpolate?: boolean | null;
  params?: Record<string, any> | null;
  hidpi?: boolean | null;
  tileGrid?: ITileGrid; // TileGrid type
  projection?: string | null;
  reprojectionErrorThreshold?: number | null;
  tileLoadFunction?: string; // ((url: string, image: HTMLImageElement) => void)
  url?: string;
  wrapX?: boolean | null;
  transition?: number | null;
  urls?: string[] | null;
  zDirection?: number | null;
}

export interface IOGCMapTile extends ISource {
  type: 'OGCMapTile';
  url: string;
  context?: Record<string, any> | null;
  mediaType?: string | null;
  projection?: string | null;
  attributions?: string[] | string | null;
  cacheSize?: number | null;
  crossOrigin?: string | null;
  interpolate?: boolean | null;
  reprojectionErrorThreshold?: number | null;
  tileLoadFunction?: string; // ((url: string, image: HTMLImageElement) => void)
  wrapX?: boolean | null;
  transition?: number | null;
  collections?: string[] | null;
}
export interface IVectorTile extends ISource {
  type: 'VectorTile';
  attributions?: string[] | string | null;
  attributionsCollapsible?: boolean | null;
  cacheSize?: number | null;
  extent?: [number, number, number, number] | null;
  format?: string | null;
  overlaps?: boolean | null;
  projection?: string | null;
  state?: string | null;
  tileClass?: string | null;
  maxZoom?: number | null;
  minZoom?: number | null;
  tileSize?: [number, number] | null;
  maxResolution?: number | null;
  tileGrid?: ITileGrid; // TileGrid type
  tileLoadFunction?: string; // ((url: string, image: HTMLImageElement)
  tileUrlFunction?: string; // ((tileCoord: [number, number, number], pixelRatio: number, projection: string) => string) | null;
  url: string;
  transition?: number | null;
  urls?: string[] | null;
  wrapX?: boolean | null;
  zDirection?: number | null;
}
export interface IGeoTIFF extends ISource {
  type: "GeoTIFF";
  sources: ISourceInfo[];
  sourceOptions?: IGeoTIFFSourceOptions;
  convertToRGB?: boolean | 'auto';
  normalize: boolean;
  opaque: boolean;
  projection: string;
  transition: number;
  wrapX: boolean;
  interpolate: boolean
}
export interface IUTFGrid extends ISource {
  type: "UTFGrid";
  preemptive: boolean;
  jsonp: boolean;
  tileJSON?: IConfig;
  url?: string;
  wrapX: boolean;
  zDirection?: number | null;
}
export interface IOSMSource extends ISource {
  type: 'OSM';
}

export interface IImageArcGISRest extends ISource {
  type: 'ImageArcGISRest';
  attributions?: string[] | string | null;
  crossOrigin?: string | null;
  hidpi?: boolean | null;
  imageLoadFunction?: string; //((url: string, image: HTMLImageElement) => void) | null;
  interpolate?: boolean | null;
  params?: Record<string, any> | null;
  projection?: string | null;
  ratio?: number | null;
  resolutions?: number[] | null;
  url?: string;
}

export interface IImageStatic extends ISource {
  type: 'ImageStatic';
  attributions?: string[] | string | null;
  crossOrigin?: string | null;
  imageExtent: [number, number, number, number];
  imageLoadFunction?: string; // ((url: string, image: HTMLImageElement) => void) | null;
  interpolate?: boolean | null;
  projection?: string | null;
  url?: string;
}
export interface IImageWMS extends ISource {
  type: 'ImageWMS';
  attributions?: string[] | string | null;
  crossOrigin?: string | null;
  hidpi?: boolean | null;
  serverType?: string | null;
  imageLoadFunction?: string; // ((url: string, image: HTMLImageElement) => void) | null;
  interpolate?: boolean | null;
  params?: Record<string, any> | null;
  projection?: string | null;
  ratio?: number | null;
  resolutions?: number[] | null;
  url?: string;
}
export interface IVectorSource extends ISource {
  type: 'Vector';
  attributions?: string[] | string | null;
  features?: any[]; // Feature[] | null;
  format?: string | null; // 'GeoJSON' | 'KML' | 'GPX' | 'EsriJSON' | 'WFS' | null;
  loader?: string; // ((extent: [number, number, number, number], resolution: number, projection: string) => void) | null;
  overlaps?: boolean | null;
  strategy?: string | null; // 'all' | 'bbox' | 'tile'
  url?: string | null;
  useSpatialIndex?: boolean | null;
  wrapX?: boolean | null;
}

export interface ICluster extends ISource {
  type: 'Cluster';
  attributions?: string[] | string | null;
  distance?: number | null;
  minDistance?: number | null;
  geometryFunction?: string; // ((feature: any) => Point) | null;
  createCluster?: string; // ((features: any[], cluster: any) => Feature) | null;
  source?: IVectorSource;
  wrapX?: boolean | null;
}



export interface ITileGrid {
  extent?: [number, number, number, number] | null;
  minZoom?: number | null;
  origin?: [number, number] | null;
  origins?: [number, number][] | null;
  resolutions?: number[] | null;
  sizes?: [number, number][] | null;
  tileSize?: [number, number] | null;
  tileSizes?: [number, number][] | null;
}
export interface IWMTSTileGrid extends ITileGrid {
  extent?: [number, number, number, number] | null;
  origin?: [number, number] | null;
  orgins?: [number, number][] | null;
  resolutions?: number[] | null;
  matrixIds?: string[] | null;
  sizes?: [number, number][] | null;
  tileSize?: [number, number] | null;
  tileSizes?: [number, number][] | null;
}



export interface ISourceInfo {
  url?: string | null,
  overviews?: string[] | null,
  blob?: Blob | null,
  min: number,
  max?: number | null,
  nodata?: number | null,
  bands?: number[] | null
}
export interface IGeoTIFFSourceOptions {
  forceXHR: boolean
  headers?: Record<string, string>
  credentials?: string,
  maxRanges?: number,
  allowFullFile: boolean,
  blockSize: number,
  cacheSize: number
}

export interface IConfig {
  /** The name. */
  name?: string;

  /** The description. */
  description?: string;

  /** The version. */
  version?: string;

  /** The attribution. */
  attribution?: string;

  /** The template. */
  template?: string;

  /** The legend. */
  legend?: string;

  /** The scheme. */
  scheme?: string;

  /** The tile URL templates. */
  tiles: string[];

  /** Optional grids. */
  grids?: string[];

  /** Minimum zoom level. */
  minzoom?: number;

  /** Maximum zoom level. */
  maxzoom?: number;

  /** Optional bounds. */
  bounds?: number[];

  /** Optional center. */
  center?: number[];
}
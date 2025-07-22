export type ISerializedSource =
  | IXYZSource
  | IOSMSource
  | IImageStaticSource
  | IGeoJSONSource
  | IVectorTileSource;

export interface ISource {
  type: string;
}

export interface IXYZSource extends ISource {
  type: 'XYZ';
  url: string | null;
}

export interface IOSMSource extends ISource {
  type: 'OSM';
}

export interface IImageStaticSource extends ISource {
  type: 'ImageStatic';
  url: string;
  imageExtent: [number, number, number, number];
}

export interface IGeoJSONSource extends ISource {
  type: 'GeoJSON';
  features: any[];
}

export interface IVectorTileSource extends ISource {
  type: 'MVT';
  url: string;
}

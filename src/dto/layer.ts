import type { ISerializedStyle } from "./style";
import Layer from "ol/layer/Layer";
import TileLayer from "ol/layer/Tile";
import type { IGeoTIFF, IImageStatic, IOGCMapTile, ITileArcGISRest, ITileJSON, ITileWMS, IVectorSource, IVectorTile, IWMTS, IXYZSource, IDataTile, IZoomify, IStyle, IImageArcGISRest, IImageWMS } from "./source";


export interface IBaseLayer {
    type: string;
    id: string;
    name: string;
    className: string | null;
    opacity: number | null;
    visible: boolean | null;
    extent: [number, number, number, number] | null;
    minResolution: number | null;
    maxResolution: number | null;
    minZoom: number | null;
    maxZoom: number | null;
    zIndex: number | null;
    background: string | null;
    properties?: { [key: string]: any } | null;
    // 允许任意额外属性
    [key: string]: any;
}
export interface IImageLayer extends IBaseLayer {
    type: 'Image';
    //todo 支持更多source
    source: IImageStatic | IImageArcGISRest | IImageWMS;
}


export interface ITileLayer extends IBaseLayer {
    type: 'Tile';
    source: IXYZSource | ITileWMS | IWMTS | IOGCMapTile | ITileArcGISRest | ITileJSON | IVectorTile | IZoomify;
    preload: number | null;
    useInterimTilesOnError: boolean | null;
}
export interface IWebGLTileLayer extends IBaseLayer {
    type: 'WebGLTile';
    style: IStyle | null,
    //todo
    source: IDataTile | IGeoTIFF | IXYZSource | ITileWMS | IWMTS | IOGCMapTile | ITileArcGISRest | ITileJSON | IZoomify;
    sources: any[] | null;
    preload: number | null;
    useInterimTilesOnError: boolean | null;
    cacheSize: number | null;
}
export interface IHeatmap extends IBaseLayer {
    type: 'Heatmap';
    gradient: string[] | null;

    radius: number | null;//any[]为表达式树
    blur: number  | null;//any[]为表达式树
    weight: string | null;//string或者function
    source: IVectorSource
}
export interface IVectorLayer extends IBaseLayer {
    type: 'Vector';
    renderOrder: string | null;
    renderBuffer: number | null;
    declutter: boolean | string | number | null;
    source: IVectorSource
    style: ISerializedStyle | null;
    updateWhileAnimating: boolean | null;
    updateWhileInteracting: boolean | null;
}
export interface IVectorTileLayer extends IBaseLayer {
    type: 'VectorTile';
    renderOrder?: string | null;
    renderBuffer: number | null;
    renderMode: 'vector' | 'hybrid' | null;
    declutter: boolean | string | number | null;
    source?: IVectorTile | null;
    style?: ISerializedStyle | null;
    updateWhileAnimating: boolean | null;
    updateWhileInteracting: boolean | null;
    preload: number | null;
    useInterimTilesOnError: boolean | null;
}

export interface IGroupLayer extends IBaseLayer {
    type: 'Group';
    layers: IBaseLayer[];
}

export type ISerializedLayer =
    | ITileLayer
    | IVectorLayer
    | IImageLayer
    | IWebGLTileLayer
    | IHeatmap
    | IVectorTile
    | IGroupLayer


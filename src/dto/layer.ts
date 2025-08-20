import type { ISerializedStyle } from "./style";
import Layer from "ol/layer/Layer";
import TileLayer from "ol/layer/Tile";
import type { IImageStatic, IOGCMapTile, ITileArcGISRest, ITileJSON, ITileWMS, IVectorSource, IVectorTile, IWMTS, IXYZSource } from "./source";


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
    source:IImageStatic
}


export interface ITileLayer extends IBaseLayer {
    type: 'Tile';
    source: IXYZSource | ITileWMS | IWMTS | IOGCMapTile | ITileArcGISRest | ITileJSON | IVectorTile;
    preload: number | null;
    useInterimTilesOnError: boolean | null;
}
export interface IWebGLTile extends IBaseLayer {
    type: 'WebGLTile';
    style: ISerializedStyle | null;
    source: {
        type: string;
        url: string | null;
    };
    sources: any[] | null;
    preload: number | null;
    useInterimTilesOnError: boolean | null;
    cacheSize: number | null;
}
export interface IHeatmap extends IBaseLayer {
    type: 'Heatmap';
    gradient: string[] | null;
    radius: number | null;
    blur: number | null;
    weight: string | null;
    declutter: boolean | string | number | null;
    source: {
        type: 'GeoJSON';
        features: any[];
    };
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
    renderOrder: string | null;
    renderBuffer: number | null;
    renderMode: 'vector' | 'hybrid' | null;
    declutter: boolean | string | number | null;
    source: {
        type: 'GeoJSON';
        features: any[];
    };
    style: ISerializedStyle | null;
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
    | IWebGLTile
    | IHeatmap
    | IVectorTile
    | IGroupLayer


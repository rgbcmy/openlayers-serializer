import type { ISerializedStyle } from "./style";
import Layer from "ol/layer/Layer";
import TileLayer from "ol/layer/Tile";


export interface IBaseLayerData {
    type: string;
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
}
export interface IImageLayerData extends IBaseLayerData {
    type: 'Image';
    source: {
        type: string;
        url: string | null;
    };
}


export interface ITileLayerData extends IBaseLayerData {
    type: 'Tile';
    source: {
        type: string;
        url: string | null;
    };
    preload: number | null;
    useInterimTilesOnError: boolean | null;
}
export interface IWebGLTileData extends IBaseLayerData {
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
export interface IHeatmapData extends IBaseLayerData {
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
export interface IVectorLayerData extends IBaseLayerData {
    type: 'Vector';
    //这个是个函数后期添加
    //renderOrder
    renderBuffer: number | null;
    declutter: boolean | string | number | null;
    source: {
        type: 'GeoJSON';
        features: any[];
    };
    style: ISerializedStyle | null;
    updateWhileAnimating: boolean | null;
    updateWhileInteracting: boolean | null;
}
export interface IVectorTileData extends IBaseLayerData {
    type: 'VectorTile';
    //这个是个函数后期添加
    //renderOrder
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

export interface IGroupLayerData extends IBaseLayerData {
    type: 'Group';
    layers: ISerializedLayerData[];
}

export type ISerializedLayerData =
    | ITileLayerData
    | IVectorLayerData
    | IGroupLayerData;

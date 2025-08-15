import type { ISerializedView } from "./view";
import type { ITileGrid } from "./source";
import type {ISerializedLayer} from "./layer";
export interface IMap{
    //控件列表
    controls:any[],
    //物理像素和dpi的比率，自动根据设备获取和设置，故不序列化它
    //pixelRatio:number,
    //交互列表
    interactions:any[],
    keyboardEventTarget?: string,
    layers:ISerializedLayer[],
    maxTilesLoading?: number,
    moveTolerance?: number,
    overlays?:any[],
    target?: string,
    view?: ISerializedView
}
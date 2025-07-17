import View, { type ViewOptions } from 'ol/View';
import { cleanNull, cleanNullToUndefined, cleanUndefined } from './utils';

export interface SerializedView {
    center: [number, number];
    //也没有getConstrainOnlyCenter方法
    //constrainOnlyCenter: boolean;
    constrainResolution: boolean;
    //没有getConstrainRotation方法
    //constrainRotation: boolean | number;
    //没有getEnableRotation方法
    //enableRotation: boolean;
    //没有getExtent方法
    //extent: [number, number, number, number];
    maxResolution: number;
    minResolution: number;
    maxZoom: number;
    minZoom: number;
    //没有getMultiWorld方法
    //multiWorld: boolean;
    resolution: number | null;
    resolutions: number[] | null;
    rotation: number;
    projection: string | null; // 可能需要根据实际情况调整类型
    //没有getShowFullExtent方法
    //showFullExtent: boolean;
    //没有getSmoothExtentConstraint方法
    //smoothExtentConstraint: boolean;
    //没有getSmoothResolutionConstraint方法
    //smoothResolutionConstraint: boolean;
    zoom: number | null;
    //没有getZoomFactor函数
    //zoomFactor: number;
}

export function serializeView(view: View): SerializedView {

    const serialized: SerializedView = {
        center: (view.getCenter() as [number, number]) ?? undefined,

        //constrainOnlyCenter: view.getConstrainOnlyCenter?.() ?? undefined,
        constrainResolution: view.getConstrainResolution(),
        //constrainRotation: view.getConstrainRotation(),
        //enableRotation: view.getEnableRotation(),
        //extent: view.getExtent() ?? undefined,
        maxResolution: view.getMaxResolution(),
        minResolution: view.getMinResolution(),
        maxZoom: view.getMaxZoom(),
        minZoom: view.getMinZoom(),
        //没有getMultiWorld方法
        //multiWorld: view.getMultiWorld(),
        projection: view.getProjection()?.getCode() ?? null, // 可能需要根据实际情况调整类型
        resolution: view.getResolution() ?? null,
        resolutions: view.getResolutions() ?? null,
        rotation: view.getRotation(),
        //showFullExtent: view.getShowFullExtent(),
        // smoothExtentConstraint: view.getSmoothExtentConstraint?.() ?? undefined,
        // smoothResolutionConstraint: view.getSmoothResolutionConstraint?.() ?? undefined,
        zoom: view.getZoom() ?? null,
        //zoomFactor: view.getZoomFactor(),
    };

    return cleanUndefined(serialized);
}

export function deserializeView(data: SerializedView): View {
    let options:ViewOptions = (cleanNullToUndefined(data) as ViewOptions);
    return new View(options);
}

//todo 很多构造函数传入没有存储，后期考虑使用set方法来设置这些属性



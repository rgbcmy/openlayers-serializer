import View, { type ViewOptions } from 'ol/View';
import { cleanNull, cleanNullToUndefined, cleanUndefined } from './utils';
import type { ISerializedView } from '../dto/view';



export function serializeView(view: View): ISerializedView {

    const serialized: ISerializedView = {
        center: (view.getCenter() as [number, number]) ?? undefined,

        //constrainOnlyCenter: view.getConstrainOnlyCenter?.() ?? undefined,
        constrainResolution: view.getConstrainResolution()??false,
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

export function deserializeView(data: ISerializedView): View {
    let options:ViewOptions = (cleanNullToUndefined(data) as ViewOptions);
    return new View(options);
}

//todo 很多构造函数传入没有存储，后期考虑使用set方法来设置这些属性



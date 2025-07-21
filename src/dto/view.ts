export interface ISerializedView {
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
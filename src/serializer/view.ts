import View from 'ol/View';
import { cleanUndefined } from './utils';

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
  resolution: number|null;
  resolutions: number[]|null;
  rotation: number;
  //没有getShowFullExtent方法
  //showFullExtent: boolean;
  //没有getSmoothExtentConstraint方法
  //smoothExtentConstraint: boolean;
  //没有getSmoothResolutionConstraint方法
  //smoothResolutionConstraint: boolean;
  zoom: number|null;
  //没有getZoomFactor函数
  //zoomFactor: number;
}

export function serializeView(view: View): SerializedView {
    const serialized: SerializedView = {
    center: (view.getCenter()as [number,number] ) ?? undefined,
    
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
  return new View({
    center: data.center,
    zoom: data.zoom,
    rotation: data.rotation,
  });
}

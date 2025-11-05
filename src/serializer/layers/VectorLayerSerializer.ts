import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import type { Layer } from 'ol/layer.js';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom.js';
import { BaseLayerSerializer } from '../base/BaseLayerSerializer.js';
import type { IVectorLayer } from '../../dto/layer.js';

/**
 * VectorLayer序列化器
 */
export class VectorLayerSerializer extends BaseLayerSerializer<VectorLayer<Feature<Geometry>>, IVectorLayer> {
  
  canSerialize(layer: Layer): layer is VectorLayer<Feature<Geometry>> {
    return layer instanceof VectorLayer;
  }
  
  getTypeName(): string {
    return 'Vector';
  }
  
  serialize(layer: VectorLayer<Feature<Geometry>>): IVectorLayer {
    const baseProps = this.getBaseProperties(layer);
    const source = this.serializeLayerSource(layer);
    
    return {
      ...baseProps,
      type: 'Vector',
      source: source,
      declutter: this.getLayerProperty(layer, 'declutter_') ?? null,
      renderBuffer: this.getLayerProperty(layer, 'renderBuffer_') ?? null,
      renderOrder: this.getLayerProperty(layer, 'renderOrder_') ? 'custom' : null,
      style: this.serializeStyle(layer.getStyle()) ?? null,
      updateWhileAnimating: this.getLayerProperty(layer, 'updateWhileAnimating_') ?? null,
      updateWhileInteracting: this.getLayerProperty(layer, 'updateWhileInteracting_') ?? null,
    };
  }
  
  deserialize(data: IVectorLayer): VectorLayer<Feature<Geometry>> {
    const source = this.deserializeLayerSource(data.source) as VectorSource;
    
    const vectorLayer = new VectorLayer({
      source: source,
      declutter: data.declutter ?? undefined,
      renderBuffer: data.renderBuffer ?? undefined,
      style: this.deserializeStyle(data.style),
      updateWhileAnimating: data.updateWhileAnimating ?? undefined,
      updateWhileInteracting: data.updateWhileInteracting ?? undefined,
      className: data.className ?? undefined,
      opacity: data.opacity ?? undefined,
      visible: data.visible ?? undefined,
      extent: data.extent ?? undefined,
      minResolution: data.minResolution ?? undefined,
      maxResolution: data.maxResolution ?? undefined,
      minZoom: data.minZoom ?? undefined,
      maxZoom: data.maxZoom ?? undefined,
      zIndex: data.zIndex ?? undefined,
    });
    
    this.setBaseProperties(vectorLayer, data);
    return vectorLayer;
  }
  
  /**
   * 序列化样式 - 简化处理
   */
  private serializeStyle(style: any): any {
    if (!style) return null;
    
    // 简化处理：如果是函数则忽略，如果是样式对象则标记为custom
    if (typeof style === 'function') {
      return { type: 'function', serialized: false };
    }
    
    return { type: 'style', serialized: false };
  }
  
  /**
   * 反序列化样式 - 简化处理
   */
  private deserializeStyle(styleData: any): any {
    if (!styleData) return undefined;
    
    // 简化处理：返回undefined让OpenLayers使用默认样式
    return undefined;
  }
}
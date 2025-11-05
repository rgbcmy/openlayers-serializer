import Heatmap from 'ol/layer/Heatmap.js';
import type { Layer } from 'ol/layer.js';
import { BaseLayerSerializer } from '../base/BaseLayerSerializer.js';
import type { IHeatmap } from '../../dto/layer.js';

/**
 * HeatmapLayer序列化器
 * TODO: 原文件注释 - 热力图图层、weight函数处理
 */
export class HeatmapLayerSerializer extends BaseLayerSerializer<Heatmap<any>, IHeatmap> {
  
  canSerialize(layer: Layer): layer is Heatmap<any> {
    return layer instanceof Heatmap;
  }
  
  getTypeName(): string {
    return 'HeatmapLayer';
  }
  
  serialize(layer: Heatmap<any>): IHeatmap {
    const baseProps = this.getBaseProperties(layer);
    const serializedSource = this.serializeLayerSource(layer);
    
    return {
      ...baseProps,
      type: 'Heatmap',
      source: serializedSource,
      gradient: this.getLayerProperty(layer, 'gradient') || layer.get('gradient') || null,
      radius: this.getLayerProperty(layer, 'radius') || layer.get('radius') || 8,
      blur: this.getLayerProperty(layer, 'blur') || layer.get('blur') || 15,
      // TODO: 原文件注释 - weight函数可能为函数，需要序列化
      weight: this.getLayerProperty(layer, 'weight') || layer.get('weight') || 'weight'
    };
  }
  
  deserialize(data: IHeatmap): Heatmap<any> {
    const source = this.deserializeLayerSource(data.source);
    
    const heatmapLayer = new Heatmap({
      source: source as any,
      className: data.className || undefined,
      opacity: data.opacity ?? 1,
      visible: data.visible ?? true,
      extent: data.extent || undefined,
      minResolution: data.minResolution ?? 0,
      maxResolution: data.maxResolution ?? Infinity,
      minZoom: data.minZoom ?? -Infinity,
      maxZoom: data.maxZoom ?? Infinity,
      zIndex: data.zIndex ?? undefined,
      gradient: data.gradient || undefined,
      radius: data.radius ?? 8,
      blur: data.blur ?? 15,
      weight: data.weight || 'weight'
    });
    
    this.setBaseProperties(heatmapLayer, data);
    return heatmapLayer;
  }
}
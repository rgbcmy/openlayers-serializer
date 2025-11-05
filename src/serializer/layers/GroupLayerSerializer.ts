import Group from 'ol/layer/Group.js';
import type { Layer } from 'ol/layer.js';
import { BaseLayerSerializer } from '../base/BaseLayerSerializer.js';
import type { IGroupLayer } from '../../dto/layer.js';
import { serializeLayer, deserializeLayer } from '../layer-new.js';

/**
 * GroupLayer序列化器
 * TODO: 原文件注释 - 图层组管理，递归处理子图层
 */
export class GroupLayerSerializer extends BaseLayerSerializer<any, IGroupLayer> {
  
  canSerialize(layer: Layer): layer is any {
    return layer instanceof Group;
  }
  
  getTypeName(): string {
    return 'GroupLayer';
  }
  
  serialize(layer: any): IGroupLayer {
    const baseProps = this.getBaseProperties(layer);
    
    // 递归序列化所有子图层
    const layers = layer.getLayers();
    const serializedLayers: any[] = [];
    
    if (layers) {
      layers.forEach((childLayer: any) => {
        try {
          const serializedChild = serializeLayer(childLayer);
          serializedLayers.push(serializedChild);
        } catch (error) {
          console.warn('Failed to serialize child layer in Group:', error);
          // 跳过无法序列化的子图层，但继续处理其他图层
        }
      });
    }
    
    return {
      ...baseProps,
      type: 'Group',
      layers: serializedLayers
    };
  }
  
  deserialize(data: IGroupLayer): any {
    // 递归反序列化所有子图层
    const deserializedLayers: any[] = [];
    
    if (data.layers && Array.isArray(data.layers)) {
      data.layers.forEach((layerData: any) => {
        try {
          const deserializedChild = deserializeLayer(layerData);
          deserializedLayers.push(deserializedChild);
        } catch (error) {
          console.warn('Failed to deserialize child layer in Group:', error);
          // 跳过无法反序列化的子图层，但继续处理其他图层
        }
      });
    }
    
    const groupLayer = new Group({
      layers: deserializedLayers,
      opacity: data.opacity ?? 1,
      visible: data.visible ?? true,
      extent: data.extent || undefined,
      minResolution: data.minResolution ?? 0,
      maxResolution: data.maxResolution ?? Infinity,
      minZoom: data.minZoom ?? -Infinity,
      maxZoom: data.maxZoom ?? Infinity,
      zIndex: data.zIndex ?? undefined
    });
    
    this.setBaseProperties(groupLayer as any, data);
    return groupLayer;
  }
}
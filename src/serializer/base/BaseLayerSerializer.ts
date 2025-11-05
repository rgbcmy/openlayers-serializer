import type { Layer } from 'ol/layer.js';
import type { ISerializedLayer, IBaseLayer } from '../../dto/layer.js';
import type { ILayerSerializer } from './ISerializer.js';
import { serializeSource, deserializeSource } from '../source-new.js';

/**
 * Layer序列化器基类
 * 提供通用的Layer序列化功能
 */
export abstract class BaseLayerSerializer<T extends Layer = Layer, D extends ISerializedLayer = ISerializedLayer> 
  implements ILayerSerializer<T, D> {
  
  abstract canSerialize(layer: Layer): layer is T;
  abstract serialize(layer: T): D;
  abstract deserialize(data: D): T;
  abstract getTypeName(): string;
  
  /**
   * 获取layer的基础属性
   */
  protected getBaseProperties(layer: Layer): Pick<IBaseLayer, 'id' | 'name' | 'className' | 'opacity' | 'visible' | 'extent' | 'minResolution' | 'maxResolution' | 'minZoom' | 'maxZoom' | 'zIndex' | 'background' | 'properties'> {
    return {
      id: layer.get('id') || crypto.randomUUID(),
      name: layer.get('name') || 'Untitled',
      className: layer.getClassName() || null,
      opacity: layer.getOpacity(),
      visible: layer.getVisible(),
      extent: layer.getExtent() as [number, number, number, number] || null,
      minResolution: layer.getMinResolution(),
      maxResolution: layer.getMaxResolution(),
      minZoom: layer.getMinZoom(),
      maxZoom: layer.getMaxZoom(),
      zIndex: layer.getZIndex() ?? null,
      background: layer.get('background') || null,
      properties: layer.getProperties() || null
    };
  }
  
  /**
   * 设置layer的基础属性
   */
  protected setBaseProperties(layer: Layer, data: D): void {
    layer.setProperties({
      id: (data as any).id ?? crypto.randomUUID(),
      name: (data as any).name ?? 'Untitled',
      background: (data as any).background ?? null
    });
    
    if ((data as any).opacity !== undefined && (data as any).opacity !== null) {
      layer.setOpacity((data as any).opacity);
    }
    if ((data as any).visible !== undefined && (data as any).visible !== null) {
      layer.setVisible((data as any).visible);
    }
    if ((data as any).extent !== undefined && (data as any).extent !== null) {
      layer.setExtent((data as any).extent);
    }
    if ((data as any).minResolution !== undefined && (data as any).minResolution !== null) {
      layer.setMinResolution((data as any).minResolution);
    }
    if ((data as any).maxResolution !== undefined && (data as any).maxResolution !== null) {
      layer.setMaxResolution((data as any).maxResolution);
    }
    if ((data as any).minZoom !== undefined && (data as any).minZoom !== null) {
      layer.setMinZoom((data as any).minZoom);
    }
    if ((data as any).maxZoom !== undefined && (data as any).maxZoom !== null) {
      layer.setMaxZoom((data as any).maxZoom);
    }
    if ((data as any).zIndex !== undefined && (data as any).zIndex !== null) {
      layer.setZIndex((data as any).zIndex);
    }
  }
  
  /**
   * 序列化layer的source
   */
  protected serializeLayerSource(layer: T): any {
    const source = layer.getSource();
    if (!source) return null;
    
    try {
      return serializeSource(source);
    } catch (error) {
      console.warn('Failed to serialize layer source:', error);
      return null;
    }
  }
  
  /**
   * 反序列化layer的source
   */
  protected deserializeLayerSource(sourceData: any): any {
    if (!sourceData) return null;
    
    try {
      return deserializeSource(sourceData);
    } catch (error) {
      console.warn('Failed to deserialize layer source:', error);
      return null;
    }
  }
  
  /**
   * 安全获取layer属性
   */
  protected getLayerProperty<K>(layer: Layer, key: string, defaultValue?: K): K | undefined {
    return (layer as any)[key] ?? layer.get(key) ?? defaultValue;
  }
}
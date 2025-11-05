import type { Source } from 'ol/source.js';
import type { Layer } from 'ol/layer.js';
import type { ISerializedSource } from '../../dto/source.js';
import type { ISerializedLayer } from '../../dto/layer.js';

/**
 * Source序列化器接口
 */
export interface ISourceSerializer<T extends Source = Source, D extends ISerializedSource = ISerializedSource> {
  /**
   * 检查是否支持该source类型
   */
  canSerialize(source: Source): source is T;
  
  /**
   * 序列化source
   */
  serialize(source: T): D;
  
  /**
   * 反序列化source
   */
  deserialize(data: D): T;
  
  /**
   * 获取支持的source类型名称
   */
  getTypeName(): string;
}

/**
 * Layer序列化器接口
 */
export interface ILayerSerializer<T extends Layer = Layer, D extends ISerializedLayer = ISerializedLayer> {
  /**
   * 检查是否支持该layer类型
   */
  canSerialize(layer: Layer): layer is T;
  
  /**
   * 序列化layer
   */
  serialize(layer: T): D;
  
  /**
   * 反序列化layer
   */
  deserialize(data: D): T;
  
  /**
   * 获取支持的layer类型名称
   */
  getTypeName(): string;
}

/**
 * 序列化器注册表
 */
export class SerializerRegistry {
  private sourceSerializers = new Map<string, ISourceSerializer>();
  private layerSerializers = new Map<string, ILayerSerializer>();
  
  /**
   * 注册source序列化器
   */
  registerSourceSerializer(serializer: ISourceSerializer): void {
    this.sourceSerializers.set(serializer.getTypeName(), serializer);
  }
  
  /**
   * 注册layer序列化器
   */
  registerLayerSerializer(serializer: ILayerSerializer): void {
    this.layerSerializers.set(serializer.getTypeName(), serializer);
  }
  
  /**
   * 获取source序列化器
   */
  getSourceSerializer(source: Source): ISourceSerializer | null {
    for (const serializer of this.sourceSerializers.values()) {
      if (serializer.canSerialize(source)) {
        return serializer;
      }
    }
    return null;
  }
  
  /**
   * 获取layer序列化器
   */
  getLayerSerializer(layer: Layer): ILayerSerializer | null {
    for (const serializer of this.layerSerializers.values()) {
      if (serializer.canSerialize(layer)) {
        return serializer;
      }
    }
    return null;
  }
  
  /**
   * 根据类型名获取source序列化器
   */
  getSourceSerializerByType(typeName: string): ISourceSerializer | null {
    return this.sourceSerializers.get(typeName) || null;
  }
  
  /**
   * 根据类型名获取layer序列化器
   */
  getLayerSerializerByType(typeName: string): ILayerSerializer | null {
    return this.layerSerializers.get(typeName) || null;
  }
  
  /**
   * 获取所有已注册的source类型
   */
  getRegisteredSourceTypes(): string[] {
    return Array.from(this.sourceSerializers.keys());
  }
  
  /**
   * 获取所有已注册的layer类型
   */
  getRegisteredLayerTypes(): string[] {
    return Array.from(this.layerSerializers.keys());
  }
}

// 全局注册表实例
export const serializerRegistry = new SerializerRegistry();
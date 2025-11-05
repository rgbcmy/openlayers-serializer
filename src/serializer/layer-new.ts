import type { Layer } from 'ol/layer.js';
import type { ISerializedLayer } from '../dto/layer.js';
import { serializerRegistry } from './base/ISerializer.js';

// 导入所有layer序列化器
import { TileLayerSerializer } from './layers/TileLayerSerializer.js';
import { VectorLayerSerializer } from './layers/VectorLayerSerializer.js';
import { ImageLayerSerializer } from './layers/ImageLayerSerializer.js';
import { HeatmapLayerSerializer } from './layers/HeatmapLayerSerializer.js';
import { GroupLayerSerializer } from './layers/GroupLayerSerializer.js';
// TODO: 导入其他layer序列化器

/**
 * 初始化并注册所有layer序列化器
 */
function initializeLayerSerializers() {
  // 注册基础layer序列化器
  serializerRegistry.registerLayerSerializer(new TileLayerSerializer());
  serializerRegistry.registerLayerSerializer(new VectorLayerSerializer());
  
  // 注册高级layer序列化器 (新增)
  serializerRegistry.registerLayerSerializer(new ImageLayerSerializer());
  serializerRegistry.registerLayerSerializer(new HeatmapLayerSerializer());
  serializerRegistry.registerLayerSerializer(new GroupLayerSerializer());
  
  console.log('✅ Registered layer serializers:', serializerRegistry.getRegisteredLayerTypes());
}

// 自动初始化
initializeLayerSerializers();

/**
 * 序列化layer（重构后的版本）
 */
export function serializeLayer(layer: Layer): ISerializedLayer {
  const serializer = serializerRegistry.getLayerSerializer(layer);
  
  if (!serializer) {
    throw new Error(`Unsupported layer type: ${layer.constructor.name}`);
  }
  
  return serializer.serialize(layer);
}

/**
 * 反序列化layer（重构后的版本）
 */
export function deserializeLayer(data: ISerializedLayer): Layer {
  const serializer = serializerRegistry.getLayerSerializerByType(data.type);
  
  if (!serializer) {
    throw new Error(`Unsupported layer type: ${data.type}`);
  }
  
  return serializer.deserialize(data);
}

/**
 * 获取所有支持的layer类型
 */
export function getSupportedLayerTypes(): string[] {
  return serializerRegistry.getRegisteredLayerTypes();
}
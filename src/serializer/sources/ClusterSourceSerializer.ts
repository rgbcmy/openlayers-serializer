import Cluster from 'ol/source/Cluster.js';
import type { Source } from 'ol/source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { ICluster } from '../../dto/source.js';
import { serializeSource, deserializeSource } from '../source-new.js';

/**
 * Cluster Source序列化器
 * TODO: 原文件注释 - 聚类功能完善
 */
export class ClusterSourceSerializer extends BaseSourceSerializer<Cluster<any>, ICluster> {
  
  canSerialize(source: Source): source is Cluster<any> {
    return source instanceof Cluster;
  }
  
  getTypeName(): string {
    return 'Cluster';
  }
  
  serialize(source: Cluster<any>): ICluster {
    const baseProps = this.getBaseProperties(source);
    
    // 序列化嵌套的source
    const nestedSource = source.getSource();
    let serializedSource = null;
    
    if (nestedSource) {
      try {
        serializedSource = serializeSource(nestedSource);
      } catch (error) {
        console.warn('Failed to serialize nested source in Cluster:', error);
      }
    }
    
    return {
      ...baseProps,
      type: 'Cluster',
      attributions: (source.getAttributions() as any) ?? null,
      distance: this.getSourceProperty(source, 'distance') || source.get('distance') || 20,
      minDistance: this.getSourceProperty(source, 'minDistance') || source.get('minDistance') || 0,
      geometryFunction: this.serializeFunctionForDto(this.getSourceProperty(source, 'geometryFunction')),
      createCluster: this.serializeFunctionForDto(this.getSourceProperty(source, 'createCluster')),
      source: serializedSource as any,
      wrapX: source.get('wrapX') ?? true
    };
  }
  
  deserialize(data: ICluster): Cluster<any> {
    // 先反序列化嵌套的source
    let nestedSource = null;
    if (data.source) {
      try {
        nestedSource = deserializeSource(data.source);
      } catch (error) {
        console.warn('Failed to deserialize nested source in Cluster:', error);
      }
    }
    
    const clusterSource = new Cluster({
      attributions: data.attributions as any,
      distance: data.distance ?? 20,
      minDistance: data.minDistance ?? 0,
      source: nestedSource as any,
      wrapX: data.wrapX ?? true
    });
    
    // 设置自定义函数
    if (data.geometryFunction) {
      const geometryFunction = this.deserializeFunctionFromDto(data.geometryFunction);
      if (typeof geometryFunction === 'function') {
        (clusterSource as any).geometryFunction_ = geometryFunction;
      }
    }
    
    if (data.createCluster) {
      const createCluster = this.deserializeFunctionFromDto(data.createCluster);
      if (typeof createCluster === 'function') {
        (clusterSource as any).createCluster_ = createCluster;
      }
    }
    
    this.setBaseProperties(clusterSource, data);
    return clusterSource;
  }
}
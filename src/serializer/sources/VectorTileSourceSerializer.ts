import VectorTile from 'ol/source/VectorTile.js';
import type { Source } from 'ol/source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IVectorTile } from '../../dto/source.js';
import MVT from 'ol/format/MVT.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { injectFunction } from '../../common/registry.js';

/**
 * VectorTile Source序列化器
 * TODO: 原文件注释 - 矢量瓦片优化
 */
export class VectorTileSourceSerializer extends BaseSourceSerializer<VectorTile, IVectorTile> {
  
  canSerialize(source: Source): source is VectorTile {
    return source instanceof VectorTile;
  }
  
  getTypeName(): string {
    return 'VectorTile';
  }
  
  serialize(source: VectorTile): IVectorTile {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'VectorTile',
      attributions: (source.getAttributions() as any) ?? null,
      cacheSize: this.getSourceProperty(source, 'tileCache.highWaterMark') || 128,
      overlaps: this.getSourceProperty(source, 'overlaps') ?? true,
      projection: source.getProjection()?.getCode() || 'EPSG:3857',
      tileGrid: this.getSourceProperty(source, 'tileGrid') as any,
      tileLoadFunction: this.serializeFunctionForDto(source.getTileLoadFunction()),
      tileUrlFunction: this.serializeFunctionForDto(source.getTileUrlFunction()),
      url: this.getSourceProperty(source, 'url') || source.get('url') || null,
      urls: this.getSourceProperty(source, 'urls') || source.get('urls') || null,
      wrapX: source.getWrapX() ?? true,
      transition: this.getSourceProperty(source, 'transition') || 250,
      zDirection: this.getSourceProperty(source, 'zDirection') || 0,
      // 简化format处理
      format: 'MVT'
    };
  }
  
  deserialize(data: IVectorTile): VectorTile {
    // 使用默认MVT格式
    const format = new MVT();
    
    const vectorTileSource = new VectorTile({
      attributions: data.attributions as any,
      cacheSize: data.cacheSize ?? 128,
      overlaps: data.overlaps ?? true,
      projection: data.projection ?? 'EPSG:3857',
      tileGrid: data.tileGrid as any,
      url: data.url || undefined,
      urls: data.urls || undefined,
      wrapX: data.wrapX ?? true,
      transition: data.transition ?? 250,
      zDirection: data.zDirection ?? 0,
      format: format as any
    });
    
    // 在创建 source 后，如果有自定义 tileLoadFunction，手动设置并绑定 this
    if (data.tileLoadFunction) {
      const customFunction = injectFunction(data.tileLoadFunction);
      if (typeof customFunction === 'function') {
        (vectorTileSource as any).tileLoadFunction_ = customFunction.bind(vectorTileSource);
      }
    }
    
    // 处理 tileUrlFunction
    if (data.tileUrlFunction) {
      const tileUrlFunction = injectFunction(data.tileUrlFunction);
      if (typeof tileUrlFunction === 'function') {
        (vectorTileSource as any).tileUrlFunction_ = tileUrlFunction.bind(vectorTileSource);
      }
    }
    
    this.setBaseProperties(vectorTileSource, data);
    return vectorTileSource;
  }
}
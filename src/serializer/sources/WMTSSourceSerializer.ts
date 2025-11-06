import WMTS from 'ol/source/WMTS.js';
import type { Source } from 'ol/source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IWMTS } from '../../dto/source.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import { injectFunction } from '../../common/registry.js';

/**
 * WMTS Source序列化器
 * TODO: 原文件注释 - WMTS服务支持完善
 */
export class WMTSSourceSerializer extends BaseSourceSerializer<WMTS, IWMTS> {
  
  canSerialize(source: Source): source is WMTS {
    return source instanceof WMTS;
  }
  
  getTypeName(): string {
    return 'WMTS';
  }
  
  serialize(source: WMTS): IWMTS {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'WMTS',
      attributions: (source.getAttributions() as any) ?? null,
      cacheSize: this.getSourceProperty(source, 'tileCache.highWaterMark') || 128,
      crossOrigin: this.getSourceProperty(source, 'crossOrigin') || 'anonymous',
      projection: source.getProjection()?.getCode() || 'EPSG:3857',
      tileGrid: this.getSourceProperty(source, 'tileGrid') as any,
      layer: this.getSourceProperty(source, 'layer') || source.get('layer') || '',
      style: this.getSourceProperty(source, 'style') || source.get('style') || '',
      format: this.getSourceProperty(source, 'format') || source.get('format') || 'image/png',
      matrixSet: this.getSourceProperty(source, 'matrixSet') || source.get('matrixSet') || '',
      url: this.getSourceProperty(source, 'url') || source.get('url') || null,
      urls: this.getSourceProperty(source, 'urls') || source.get('urls') || null,
      version: this.getSourceProperty(source, 'version') || source.get('version') || '1.0.0',
      requestEncoding: this.getSourceProperty(source, 'requestEncoding') || source.get('requestEncoding') || 'KVP',
      dimensions: this.getSourceProperty(source, 'dimensions') || source.get('dimensions') || {},
      wrapX: source.getWrapX() ?? false,
      transition: this.getSourceProperty(source, 'transition') || 250,
      // TODO: 原文件中需要处理更多WMTS参数
      tileLoadFunction: this.serializeFunctionForDto(source.getTileLoadFunction())
    };
  }
  
  deserialize(data: IWMTS): WMTS {
    // 处理tileGrid
    let tileGrid;
    if (data.tileGrid) {
      // 如果有自定义tileGrid配置，尝试创建WMTSTileGrid
      tileGrid = data.tileGrid as any;
    }
    
    const wmtsSource = new WMTS({
      attributions: data.attributions as any,
      cacheSize: data.cacheSize ?? 128,
      crossOrigin: data.crossOrigin ?? 'anonymous',
      projection: data.projection ?? 'EPSG:3857',
      tileGrid: tileGrid,
      layer: data.layer || '',
      style: data.style || '',
      format: data.format ?? 'image/png',
      matrixSet: data.matrixSet || '',
      url: data.url || undefined,
      urls: data.urls || undefined,
      version: data.version ?? '1.0.0',
      requestEncoding: data.requestEncoding as any ?? 'KVP',
      dimensions: data.dimensions || {},
      wrapX: data.wrapX ?? false,
      transition: data.transition ?? 250
    });
    
    // 在创建 source 后，如果有自定义 tileLoadFunction，手动设置并绑定 this
    if (data.tileLoadFunction) {
      const customFunction = injectFunction(data.tileLoadFunction);
      if (typeof customFunction === 'function') {
        (wmtsSource as any).tileLoadFunction_ = customFunction.bind(wmtsSource);
      }
    }
    
    this.setBaseProperties(wmtsSource, data);
    return wmtsSource;
  }
}
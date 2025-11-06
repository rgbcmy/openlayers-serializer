import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { all, bbox, tile } from 'ol/loadingstrategy.js';
import type { Source } from 'ol/source.js';
import type { AttributionLike } from 'ol/source/Source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IVectorSource } from '../../dto/source.js';
import { injectFunction } from '../../common/registry.js';

/**
 * Vector Source序列化器
 */
export class VectorSourceSerializer extends BaseSourceSerializer<VectorSource, IVectorSource> {
  
  canSerialize(source: Source): source is VectorSource {
    return source instanceof VectorSource;
  }
  
  getTypeName(): string {
    return 'Vector';
  }
  
  serialize(source: VectorSource): IVectorSource {
    const baseProps = this.getBaseProperties(source);
    const features = source.getFeatures();
    const url = source.getUrl();
    const format = source.getFormat();
    
    // 基础配置 - 根据官方API默认值设置
    let sourceDto: IVectorSource = {
      ...baseProps,
      type: 'Vector',
      attributions: (source.getAttributions() as any) ?? null,
      format: this.serializeFormat(format),
      overlaps: source.getOverlaps() ?? true,
      strategy: this.getBuiltInStrategyName(this.getSourceProperty(source, 'strategy_') ?? all),
      useSpatialIndex: this.getSourceProperty(source, 'featuresRtree_') ? true : false,
      wrapX: source.getWrapX() ?? true
    };

    // URL处理 - 支持string和FeatureUrlFunction
    if (url) {
      if (typeof url === 'string') {
        sourceDto.url = url;
      } else if (typeof url === 'function') {
        // FeatureUrlFunction - 序列化函数
        try {
          sourceDto.loader = this.serializeFunctionForDto(url as Function);
        } catch (error) {
          console.warn('Failed to serialize FeatureUrlFunction:', error);
        }
      }
      
      // 备份策略：如果有URL且已加载数据，保存少量features作为备份
      if (features.length > 0 && features.length <= 100) {
        try {
          if (format instanceof GeoJSON) {
            sourceDto.features = format.writeFeaturesObject(features);
          } else if (format && typeof format.writeFeatures === 'function') {
            const featuresString = format.writeFeatures(features);
            if (typeof featuresString === 'string') {
              try {
                sourceDto.features = JSON.parse(featuresString);
              } catch {
                sourceDto.features = featuresString as any;
              }
            } else {
              sourceDto.features = new GeoJSON().writeFeaturesObject(features);
            }
          } else {
            sourceDto.features = new GeoJSON().writeFeaturesObject(features);
          }
        } catch (error) {
          console.warn('Failed to serialize features as backup:', error);
        }
      }
    }
    // Features处理 - 当没有URL时，序列化所有features
    else if (features.length > 0) {
      try {
        if (format instanceof GeoJSON) {
          sourceDto.features = format.writeFeaturesObject(features);
        } else if (format && typeof format.writeFeatures === 'function') {
          const featuresString = format.writeFeatures(features);
          if (typeof featuresString === 'string') {
            try {
              sourceDto.features = JSON.parse(featuresString);
            } catch {
              sourceDto.features = new GeoJSON().writeFeaturesObject(features);
              console.warn(`Failed to parse ${sourceDto.format} features, using GeoJSON fallback`);
            }
          } else {
            sourceDto.features = new GeoJSON().writeFeaturesObject(features);
            console.warn(`${sourceDto.format} format returned non-string data, using GeoJSON fallback`);
          }
        } else {
          sourceDto.features = new GeoJSON().writeFeaturesObject(features);
          sourceDto.format = 'GeoJSON';
        }
      } catch (error) {
        console.warn('Failed to serialize features:', error);
        sourceDto.features = undefined;
      }
    }

    // Custom Loader处理
    const hasCustomLoader = this.getSourceProperty(source, 'loader_') && 
                           typeof this.getSourceProperty(source, 'loader_') === 'function' && 
                           !url;
    
    if (hasCustomLoader) {
      try {
        sourceDto.loader = this.serializeFunctionForDto(this.getSourceProperty(source, 'loader_'));
      } catch (error) {
        console.warn('Failed to serialize custom loader:', error);
      }
    }

    return sourceDto;
  }
  
  deserialize(data: IVectorSource): VectorSource {
    const format = data.format ? this.deserializeFormat(data.format as FormatName) : new GeoJSON();
    
    // 准备构造参数 - 基于官方API默认值
    let vectorOptions: any = {
      attributions: data.attributions as AttributionLike,
      format: format,
      overlaps: data.overlaps ?? true,
      strategy: this.getBuiltInStrategyByName(data.strategy as BuiltInStrategyName) as any,
      useSpatialIndex: data.useSpatialIndex ?? true,
      wrapX: data.wrapX ?? true
    };

    // URL处理 - 支持string URL
    if (data.url) {
      vectorOptions.url = data.url;
      if (!vectorOptions.format) {
        vectorOptions.format = new GeoJSON();
      }
    }

    // Custom Loader处理
    if (data.loader) {
      try {
        const customLoader = injectFunction(data.loader);
        if (typeof customLoader === 'function') {
          vectorOptions.loader = customLoader;
        }
      } catch (error) {
        console.warn('Failed to deserialize custom loader:', error);
      }
    }

    // 创建VectorSource实例
    const vectorSource = new VectorSource(vectorOptions);

    // Features处理 - 在source创建后添加features
    if (data.features) {
      try {
        let features;
        
        if (typeof data.features === 'string') {
          features = format.readFeatures(data.features);
        } else if (typeof data.features === 'object') {
          if (format instanceof GeoJSON) {
            features = format.readFeatures(data.features);
          } else {
            features = new GeoJSON().readFeatures(data.features);
          }
        } else {
          console.warn('Unknown features format:', typeof data.features);
        }
        
        if (features && features.length > 0) {
          vectorSource.addFeatures(features);
        }
      } catch (error) {
        console.warn('Failed to deserialize features:', error);
      }
    }
    
    this.setBaseProperties(vectorSource, data);
    return vectorSource;
  }
  
  /**
   * 序列化format
   */
  private serializeFormat(format: any): FormatName | undefined {
    const formatRegistry = {
      'GeoJSON': 'GeoJSON',
      'MVT': 'MVT',
      'WKT': 'WKT',
      'TopoJSON': 'TopoJSON',
      'GPX': 'GPX',
      'IGC': 'IGC',
      'KML': 'KML',
      'OSMXML': 'OSMXML',
      'Polyline': 'Polyline'
    };
    
    for (const [name, value] of Object.entries(formatRegistry)) {
      if (format && format.constructor.name === name) {
        return value as FormatName;
      }
    }
    return undefined;
  }
  
  /**
   * 反序列化format
   */
  private deserializeFormat(name: FormatName): any {
    const formatMap: any = {
      'GeoJSON': () => new GeoJSON(),
      'MVT': () => import('ol/format/MVT.js').then(m => new m.default()),
      'WKT': () => import('ol/format/WKT.js').then(m => new m.default()),
      'TopoJSON': () => import('ol/format/TopoJSON.js').then(m => new m.default()),
      'GPX': () => import('ol/format/GPX.js').then(m => new m.default()),
      'IGC': () => import('ol/format/IGC.js').then(m => new m.default()),
      'KML': () => import('ol/format/KML.js').then(m => new m.default()),
      'OSMXML': () => import('ol/format/OSMXML.js').then(m => new m.default()),
      'Polyline': () => import('ol/format/Polyline.js').then(m => new m.default())
    };
    
    const factory = formatMap[name];
    if (!factory) throw new Error(`Unknown format: ${name}`);
    
    // 简化处理，直接返回GeoJSON作为默认值
    return new GeoJSON();
  }
  
  /**
   * 获取内置策略名称
   */
  private getBuiltInStrategyName(fn: Function): BuiltInStrategyName | undefined {
    const builtInStrategies = { all, bbox, tile };
    for (const [name, f] of Object.entries(builtInStrategies)) {
      if (fn === f) return name as BuiltInStrategyName;
    }
    return undefined;
  }
  
  /**
   * 根据名称获取内置策略
   */
  private getBuiltInStrategyByName(name: BuiltInStrategyName): Function {
    const builtInStrategies = { all, bbox, tile };
    return builtInStrategies[name];
  }
}

type BuiltInStrategyName = 'all' | 'bbox' | 'tile';
type FormatName = 'GeoJSON' | 'MVT' | 'WKT' | 'TopoJSON' | 'GPX' | 'IGC' | 'KML' | 'OSMXML' | 'Polyline';
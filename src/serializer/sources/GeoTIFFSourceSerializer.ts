import GeoTIFF from 'ol/source/GeoTIFF.js';
import type { Source } from 'ol/source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IGeoTIFF } from '../../dto/source.js';

/**
 * GeoTIFF Source序列化器
 * TODO: 原文件注释 - GeoTIFF数据源完善
 */
export class GeoTIFFSourceSerializer extends BaseSourceSerializer<GeoTIFF, IGeoTIFF> {
  
  canSerialize(source: Source): source is GeoTIFF {
    return source instanceof GeoTIFF;
  }
  
  getTypeName(): string {
    return 'GeoTIFF';
  }
  
  serialize(source: GeoTIFF): IGeoTIFF {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'GeoTIFF',
      sources: this.getSourceProperty(source, 'sources') || source.get('sources') || [],
      convertToRGB: this.getSourceProperty(source, 'convertToRGB') || source.get('convertToRGB') || 'auto',
      normalize: this.getSourceProperty(source, 'normalize') || source.get('normalize') !== false,
      opaque: this.getSourceProperty(source, 'opaque') || source.get('opaque') !== false,
      transition: this.getSourceProperty(source, 'transition') || source.get('transition') || 250,
      wrapX: source.get('wrapX') ?? true,
      interpolate: source.get('interpolate') ?? true
      // TODO: 原文件中需要处理更多GeoTIFF特定配置
    };
  }
  
  deserialize(data: IGeoTIFF): GeoTIFF {
    const geoTIFFSource = new GeoTIFF({
      sources: data.sources as any || [],
      convertToRGB: data.convertToRGB ?? 'auto',
      normalize: data.normalize ?? true,
      opaque: data.opaque ?? true,
      transition: data.transition ?? 250,
      wrapX: data.wrapX ?? true,
      interpolate: data.interpolate ?? true
    });
    
    this.setBaseProperties(geoTIFFSource, data);
    return geoTIFFSource;
  }
}
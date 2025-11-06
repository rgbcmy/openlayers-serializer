import OSM from 'ol/source/OSM.js';
import type { Source } from 'ol/source.js';
import type { AttributionLike } from 'ol/source/Source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IOSM } from '../../dto/source.js';
import { injectFunction } from '../../common/registry.js';

/**
 * OSM Source序列化器
 */
export class OSMSourceSerializer extends BaseSourceSerializer<OSM, IOSM> {
  
  canSerialize(source: Source): source is OSM {
    return source instanceof OSM;
  }
  
  getTypeName(): string {
    return 'OSM';
  }
  
  serialize(source: OSM): IOSM {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'OSM',
      attributions: (source.getAttributions() as any) ?? null,
      cacheSize: undefined,
      crossOrigin: this.getSourceProperty(source, 'crossOrigin') || 'anonymous',
      interpolate: source.getInterpolate() ?? true,
      maxZoom: source.getTileGrid()?.getMaxZoom() || source.get('maxZoom') || 19,
      opaque: this.getSourceProperty(source, 'opaque_') || source.get('opaque') || true,
      reprojectionErrorThreshold: this.getSourceProperty(source, 'reprojectionErrorThreshold_') || source.get('reprojectionErrorThreshold') || 0.5,
      tileLoadFunction: this.serializeFunctionForDto(source.getTileLoadFunction()),
      transition: this.getSourceProperty(source, 'tileOptions.transition') || source.get('transition') || 250,
      url: source.get('url') || 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      wrapX: source.getWrapX() ?? true,
      zDirection: (source as any).zDirection ?? 0
    };
  }
  
  deserialize(data: IOSM): OSM {
    const osmSource = new OSM({
      attributions: data.attributions as AttributionLike,
      cacheSize: data.cacheSize ?? undefined,
      crossOrigin: data.crossOrigin,
      interpolate: data.interpolate ?? true,
      maxZoom: data.maxZoom ?? 19,
      opaque: data.opaque ?? true,
      reprojectionErrorThreshold: data.reprojectionErrorThreshold ?? 0.5,
      url: data.url ?? 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      wrapX: data.wrapX ?? true,
      transition: data.transition ?? 250,
      zDirection: data.zDirection ?? 0,
    });
    
    // 在创建 source 后，如果有自定义 tileLoadFunction，手动设置并绑定 this
    if (data.tileLoadFunction) {
      const customFunction = injectFunction(data.tileLoadFunction);
      if (typeof customFunction === 'function') {
        (osmSource as any).tileLoadFunction_ = customFunction.bind(osmSource);
      }
    }
    
    this.setBaseProperties(osmSource, data);
    return osmSource;
  }
}
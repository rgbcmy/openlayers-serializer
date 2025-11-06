import { OGCMapTile } from 'ol/source.js';
import type { Source } from 'ol/source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IOGCMapTile } from '../../dto/source.js';
import { injectFunction } from '../../common/registry.js';

/**
 * OGCMapTile Source序列化器
 */
export class OGCMapTileSourceSerializer extends BaseSourceSerializer<OGCMapTile, IOGCMapTile> {
  
  canSerialize(source: Source): source is OGCMapTile {
    return source instanceof OGCMapTile;
  }
  
  getTypeName(): string {
    return 'OGCMapTile';
  }
  
  serialize(source: OGCMapTile): IOGCMapTile {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'OGCMapTile',
      url: source.get('url'),
      context: source.get('context'),
      mediaType: source.get('mediaType'),
      projection: source.getProjection()?.getCode() ?? undefined,
      attributions: (source.getAttributions() as any),
      cacheSize: undefined,
      crossOrigin: this.getSourceProperty(source, 'crossOrigin') || source.get('crossOrigin'),
      interpolate: source.getInterpolate() ?? true,
      reprojectionErrorThreshold: this.getSourceProperty(source, 'reprojectionErrorThreshold_') || source.get('reprojectionErrorThreshold') || 0.5,
      tileLoadFunction: this.serializeFunctionForDto(source.getTileLoadFunction()),
      wrapX: source.getWrapX() ?? true,
      transition: this.getSourceProperty(source, 'tileOptions.transition') || source.get('transition') || 250,
      collections: source.get('collections')
    };
  }
  
  deserialize(data: IOGCMapTile): OGCMapTile {
    const ogcMapTileSource = new OGCMapTile({
      url: data.url,
      context: data.context,
      mediaType: data.mediaType ?? undefined,
      projection: data.projection ?? undefined,
      attributions: data.attributions as any,
      cacheSize: data.cacheSize ?? undefined,
      crossOrigin: data.crossOrigin,
      interpolate: data.interpolate ?? true,
      reprojectionErrorThreshold: data.reprojectionErrorThreshold ?? 0.5,
      wrapX: data.wrapX ?? true,
      transition: data.transition ?? undefined,
      collections: data.collections ?? undefined
    });
    
    // 在创建 source 后，如果有自定义 tileLoadFunction，手动设置并绑定 this
    if (data.tileLoadFunction) {
      const customFunction = injectFunction(data.tileLoadFunction);
      if (typeof customFunction === 'function') {
        (ogcMapTileSource as any).tileLoadFunction_ = customFunction.bind(ogcMapTileSource);
      }
    }
    
    this.setBaseProperties(ogcMapTileSource, data);
    return ogcMapTileSource;
  }
}

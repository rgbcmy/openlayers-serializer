import BingMaps from 'ol/source/BingMaps.js';
import type { Source } from 'ol/source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IBingMaps } from '../../dto/source.js';
import { injectFunction } from '../../common/registry.js';

/**
 * BingMaps Source序列化器
 */
export class BingMapsSourceSerializer extends BaseSourceSerializer<BingMaps, IBingMaps> {
  
  canSerialize(source: Source): source is BingMaps {
    return source instanceof BingMaps;
  }
  
  getTypeName(): string {
    return 'BingMaps';
  }
  
  serialize(source: BingMaps): IBingMaps {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'BingMaps',
      casheSize: undefined,
      hidpi: this.getSourceProperty(source, 'hidpi_') ?? true,
      culture: this.getSourceProperty(source, 'culture_') || 'en-US',
      key: source.getKey(),
      imagerySet: source.getImagerySet(),
      interpolate: source.getInterpolate() ?? true,
      maxZoom: source.getTileGrid()?.getMaxZoom() || source.get('maxZoom') || 19,
      reprojectionErrorThreshold: this.getSourceProperty(source, 'reprojectionErrorThreshold_') || source.get('reprojectionErrorThreshold') || 0.5,
      tileLoadFunction: this.serializeFunctionForDto(source.getTileLoadFunction()),
      wrapX: source.getWrapX() ?? true,
      transition: this.getSourceProperty(source, 'tileOptions.transition') || source.get('transition'),
      zDirection: (source as any).zDirection ?? 0,
      placeholderTiles: this.getSourceProperty(source, 'placeholderTiles_') as boolean | undefined,
    };
  }
  
  deserialize(data: IBingMaps): BingMaps {
    const bingSource = new BingMaps({
      cacheSize: undefined,
      hidpi: data.hidpi ?? true,
      culture: data.culture || 'en-US',
      key: data.key!,
      imagerySet: data.imagerySet!,
      interpolate: data.interpolate ?? true,
      maxZoom: data.maxZoom ?? 19,
      reprojectionErrorThreshold: data.reprojectionErrorThreshold ?? 0.5,
      tileLoadFunction: data.tileLoadFunction ? injectFunction(data.tileLoadFunction) : undefined,
      wrapX: data.wrapX ?? true,
      transition: data.transition ?? undefined,
      zDirection: data.zDirection ?? 0,
      placeholderTiles: data.placeholderTiles ?? undefined
    });
    
    this.setBaseProperties(bingSource, data);
    return bingSource;
  }
}
import { StadiaMaps } from 'ol/source.js';
import type { Source } from 'ol/source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IStadiaMaps } from '../../dto/source.js';
import { injectFunction } from '../../common/registry.js';

/**
 * StadiaMaps Source序列化器
 */
export class StadiaMapsSourceSerializer extends BaseSourceSerializer<StadiaMaps, IStadiaMaps> {
  
  canSerialize(source: Source): source is StadiaMaps {
    return source instanceof StadiaMaps;
  }
  
  getTypeName(): string {
    return 'StadiaMaps';
  }
  
  serialize(source: StadiaMaps): IStadiaMaps {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'StadiaMaps',
      cacheSize: undefined,
      interpolate: source.getInterpolate() ?? true,
      layer: source.get('layer'),
      minZoom: source.getTileGrid()?.getMinZoom() || source.get('minZoom'),
      maxZoom: source.getTileGrid()?.getMaxZoom() || source.get('maxZoom'),
      reprojectionErrorThreshold: this.getSourceProperty(source, 'reprojectionErrorThreshold_') || source.get('reprojectionErrorThreshold') || 0.5,
      tileLoadFunction: this.serializeFunctionForDto(source.getTileLoadFunction()),
      transition: this.getSourceProperty(source, 'tileOptions.transition') || source.get('transition') || 250,
      url: source.get('url'),
      wrapX: source.getWrapX() ?? true,
      zDirection: (source as any).zDirection ?? 0,
      apiKey: source.get('apiKey') as string | undefined,
      retina: source.get('retina') as boolean | undefined,
    };
  }
  
  deserialize(data: IStadiaMaps): StadiaMaps {
    const stadiaSource = new StadiaMaps({
      cacheSize: undefined,
      interpolate: data.interpolate ?? true,
      layer: data.layer ?? 'stamen_terrain',
      minZoom: data.minZoom ?? undefined,
      maxZoom: data.maxZoom ?? undefined,
      reprojectionErrorThreshold: data.reprojectionErrorThreshold ?? 0.5,
      tileLoadFunction: data.tileLoadFunction ? injectFunction(data.tileLoadFunction) : undefined,
      transition: data.transition ?? 250,
      url: data.url ?? undefined,
      wrapX: data.wrapX ?? true,
      zDirection: data.zDirection ?? 0,
      apiKey: data.apiKey ?? undefined,
      retina: data.retina ?? undefined,
    });
    
    this.setBaseProperties(stadiaSource, data);
    return stadiaSource;
  }
}
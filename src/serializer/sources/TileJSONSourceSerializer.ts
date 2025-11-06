import { TileJSON } from 'ol/source.js';
import type { Source } from 'ol/source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { ITileJSON } from '../../dto/source.js';
import { injectFunction } from '../../common/registry.js';

/**
 * TileJSON Source序列化器
 */
export class TileJSONSourceSerializer extends BaseSourceSerializer<TileJSON, ITileJSON> {
  
  canSerialize(source: Source): source is TileJSON {
    return source instanceof TileJSON;
  }
  
  getTypeName(): string {
    return 'TileJSON';
  }
  
  serialize(source: TileJSON): ITileJSON {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'TileJSON',
      attributions: (source.getAttributions() as any) ?? null,
      cacheSize: null,
      crossOrigin: this.getSourceProperty(source, 'crossOrigin') || source.get('crossOrigin'),
      interpolate: source.getInterpolate() ?? true,
      jsonp: source.get('jsonp') ?? false,
      reprojectionErrorThreshold: this.getSourceProperty(source, 'reprojectionErrorThreshold_') || source.get('reprojectionErrorThreshold') || 0.5,
      tileJson: source.getTileJSON(),
      tileLoadFunction: this.serializeFunctionForDto(source.getTileLoadFunction()),
      tileSize: (source as any)['tileSize_'],
      url: source.get('url'),
      wrapX: source.getWrapX() ?? true,
      transition: this.getSourceProperty(source, 'tileOptions.transition') || source.get('transition'),
      zDirection: (source as any).zDirection ?? 0,
    };
  }
  
  deserialize(data: ITileJSON): TileJSON {
    const tileJsonSource = new TileJSON({
      attributions: data.attributions as any,
      cacheSize: undefined,
      crossOrigin: data.crossOrigin,
      interpolate: data.interpolate ?? true,
      jsonp: data.jsonp ?? false,
      reprojectionErrorThreshold: data.reprojectionErrorThreshold ?? 0.5,
      tileJSON: data.tileJson as any,
      tileSize: data.tileSize as any ?? [256, 256],
      url: data.url ?? undefined,
      wrapX: data.wrapX ?? true,
      transition: data.transition ?? undefined,
      zDirection: data.zDirection ?? 0
    });
    
    // 在创建 source 后，如果有自定义 tileLoadFunction，手动设置并绑定 this
    if (data.tileLoadFunction) {
      const customFunction = injectFunction(data.tileLoadFunction);
      if (typeof customFunction === 'function') {
        (tileJsonSource as any).tileLoadFunction_ = customFunction.bind(tileJsonSource);
      }
    }
    
    this.setBaseProperties(tileJsonSource, data);
    return tileJsonSource;
  }
}

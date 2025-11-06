import { OGCVectorTile } from 'ol/source.js';
import type { Source } from 'ol/source.js';
import type { FeatureLike } from 'ol/Feature.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IOGCVectorTile } from '../../dto/source.js';
import { serializeFormat, deserializeFormat, type FormatName } from '../source.js';

/**
 * OGCVectorTile Source序列化器
 */
export class OGCVectorTileSourceSerializer extends BaseSourceSerializer<OGCVectorTile<FeatureLike>, IOGCVectorTile> {
  
  canSerialize(source: Source): source is OGCVectorTile<FeatureLike> {
    return source instanceof OGCVectorTile;
  }
  
  getTypeName(): string {
    return 'OGCVectorTile';
  }
  
  serialize(source: OGCVectorTile<FeatureLike>): IOGCVectorTile {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'OGCVectorTile',
      url: source.get('url'),
      context: source.get('context'),
      format: serializeFormat((source as any)['format_']),
      mediaType: source.get('mediaType'),
      attributions: (source.getAttributions() as any),
      attributionsCollapsible: source.getAttributionsCollapsible() ?? true,
      cacheSize: null,
      overlaps: source.getOverlaps() ?? true,
      projection: source.getProjection()?.getCode(),
      transition: this.getSourceProperty(source, 'tileOptions.transition') || source.get('transition') || 250,
      wrapX: source.getWrapX() ?? true,
      zDirection: (source as any).zDirection ?? 0,
      collections: source.get('collections')
    };
  }
  
  deserialize(data: IOGCVectorTile): OGCVectorTile<FeatureLike> {
    const ogcVectorTileSource = new OGCVectorTile({
      url: data.url ?? '',
      context: data.context,
      format: deserializeFormat((data.format as FormatName)) as any,
      mediaType: data.mediaType ?? undefined,
      attributions: data.attributions as any,
      attributionsCollapsible: data.attributionsCollapsible ?? true,
      cacheSize: undefined,
      overlaps: data.overlaps ?? true,
      projection: data.projection ?? undefined,
      transition: data.transition ?? 250,
      wrapX: data.wrapX ?? true,
      zDirection: data.zDirection ?? 0,
      collections: data.collections ?? undefined
    });
    
    this.setBaseProperties(ogcVectorTileSource, data);
    return ogcVectorTileSource;
  }
}

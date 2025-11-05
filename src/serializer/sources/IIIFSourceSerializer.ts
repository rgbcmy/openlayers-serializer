import { IIIF } from 'ol/source.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';
import type { Source } from 'ol/source.js';
import type { AttributionLike } from 'ol/source/Source.js';
import type { Extent } from 'ol/extent.js';
import type { Size } from 'ol/size.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IIIIFSource, ITileGrid } from '../../dto/source.js';

/**
 * IIIF Source序列化器
 */
export class IIIFSourceSerializer extends BaseSourceSerializer<IIIF, IIIIFSource> {
  
  canSerialize(source: Source): source is IIIF {
    return source instanceof IIIF;
  }
  
  getTypeName(): string {
    return 'IIIF';
  }
  
  serialize(source: IIIF): IIIIFSource {
    const baseProps = this.getBaseProperties(source);
    const tileGrid = source.getTileGrid();
    let tileGridDto;
    
    if (tileGrid) {
      tileGridDto = this.serializeTileGrid(tileGrid);
    }
    
    // 获取format值
    let format = source.get('format');
    if (!format) {
      try {
        const tileUrlFunc = source.getTileUrlFunction();
        if (tileUrlFunc) {
          const testUrl = tileUrlFunc([0, 0, 0], 1, null as any);
          if (testUrl && typeof testUrl === 'string') {
            const match = testUrl.match(/\.([a-zA-Z]{2,4})(?:\?|$)/);
            if (match) {
              format = match[1];
            }
          }
        }
      } catch (error) {
        console.warn('Failed to infer IIIF format from tileUrlFunction:', error);
      }
      
      if (!format) {
        format = 'jpg';
      }
    }
    
    return {
      ...baseProps,
      type: 'IIIF',
      attributions: (source.getAttributions() as any) ?? null,
      attributionsCollapsible: source.getAttributionsCollapsible() ?? true,
      cacheSize: undefined,
      crossOrigin: this.getSourceProperty(source, 'crossOrigin') || source.get('crossOrigin'),
      extent: source.getTileGrid()?.getExtent() as [number, number, number, number],
      format: format,
      interpolate: source.getInterpolate() ?? true,
      projection: source.getProjection()?.getCode() ?? undefined,
      quality: source.get('quality') || 'default',
      reprojectionErrorThreshold: this.getSourceProperty(source, 'reprojectionErrorThreshold_') || source.get('reprojectionErrorThreshold') || 0.5,
      resolutions: source.getTileGrid()?.getResolutions() || [],
      size: source.get('size') as any,
      sizes: tileGridDto?.sizes as any,
      supports: source.get('supports') as string[] | undefined,
      tileSize: tileGridDto?.tileSize,
      transition: this.getSourceProperty(source, 'tileOptions.transition') || source.get('transition'),
      url: source.get('url'),
      version: source.get('version')
    };
  }
  
  deserialize(data: IIIIFSource): IIIF {
    const iiifSource = new IIIF({
      attributions: data.attributions as AttributionLike,
      attributionsCollapsible: data.attributionsCollapsible ?? true,
      cacheSize: undefined,
      crossOrigin: data.crossOrigin,
      extent: data.extent as Extent,
      format: data.format ?? 'jpg',
      interpolate: data.interpolate ?? true,
      projection: data.projection as any,
      quality: data.quality ?? undefined,
      reprojectionErrorThreshold: data.reprojectionErrorThreshold ?? 0.5,
      resolutions: data.resolutions ?? undefined,
      size: data.size as Size,
      sizes: data.sizes as Size[],
      supports: data.supports ?? undefined,
      tilePixelRatio: data.tilePixelRatio ?? undefined,
      tileSize: data.tileSize ?? undefined,
      transition: data.transition ?? undefined,
      url: data.url!,
      version: data.version ?? undefined,
      zDirection: data.zDirection ?? 0
    });
    
    this.setBaseProperties(iiifSource, data);
    return iiifSource;
  }
  
  /**
   * 序列化TileGrid
   */
  private serializeTileGrid(tileGrid: TileGrid): ITileGrid {
    const minZoom = tileGrid.getMinZoom();
    const maxZoom = tileGrid.getMaxZoom();
    const resolutions = tileGrid.getResolutions();
    const extent = tileGrid.getExtent();
    
    const origins = (tileGrid as any)['origins_'] || null;
    const origin = (tileGrid as any)['origin_'] || null;
    const tileSizes = (tileGrid as any)['tileSizes_'] || null;
    const tileSize = (tileGrid as any)['tileSize_'] || null;
    
    const sizes = [];
    for (let z = minZoom; z <= maxZoom; z++) {
      const range = tileGrid.getFullTileRange(z);
      if (range) {
        sizes[z] = [
          range.maxX - range.minX + 1,
          range.maxY - range.minY + 1,
        ];
      }
    }
    
    return {
      extent: extent as [number, number, number, number],
      minZoom: minZoom,
      origin: origin,
      origins: origins,
      resolutions: resolutions,
      sizes: sizes as [number, number][],
      tileSize: tileSize,
      tileSizes: tileSizes
    };
  }
}
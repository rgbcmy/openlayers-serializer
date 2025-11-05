import { TileDebug } from 'ol/source.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';
import type { Source } from 'ol/source.js';
import type { Extent } from 'ol/extent.js';
import type { Size } from 'ol/size.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { ITileDebug, ITileGrid } from '../../dto/source.js';

/**
 * TileDebug Source序列化器
 */
export class TileDebugSourceSerializer extends BaseSourceSerializer<TileDebug, ITileDebug> {
  
  canSerialize(source: Source): source is TileDebug {
    return source instanceof TileDebug;
  }
  
  getTypeName(): string {
    return 'TileDebug';
  }
  
  serialize(source: TileDebug): ITileDebug {
    const baseProps = this.getBaseProperties(source);
    const tileGrid = source.getTileGrid();
    let tileGridDto = null;
    
    if (tileGrid) {
      tileGridDto = this.serializeTileGrid(tileGrid as TileGrid);
    }
    
    return {
      ...baseProps,
      type: 'TileDebug',
      projection: source.getProjection()?.getCode() || null,
      tileGrid: tileGridDto,
      wrapX: source.getWrapX() ?? true,
      zDirection: (source as any).zDirection ?? 0,
      template: source.get('template') || null
    };
  }
  
  deserialize(data: ITileDebug): TileDebug {
    const tileDebugSource = new TileDebug({
      projection: data.projection ?? undefined,
      tileGrid: data.tileGrid ? this.deserializeTileGrid(data.tileGrid) : undefined,
      wrapX: data.wrapX ?? true,
      zDirection: data.zDirection ?? 0,
      template: data.template ?? undefined
    });
    
    this.setBaseProperties(tileDebugSource, data);
    return tileDebugSource;
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
    
    // 通过 fullTileRanges_ 推算 sizes
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
  
  /**
   * 反序列化TileGrid
   */
  private deserializeTileGrid(data: ITileGrid): TileGrid {
    return new TileGrid({
      extent: data.extent as Extent,
      minZoom: data.minZoom ?? 0,
      origin: data.origin ?? undefined,
      origins: data.origins ?? undefined,
      resolutions: data.resolutions ?? [],
      sizes: data.sizes as Size[],
      tileSize: data.tileSize ?? undefined,
      tileSizes: data.tileSizes ?? undefined
    });
  }
}
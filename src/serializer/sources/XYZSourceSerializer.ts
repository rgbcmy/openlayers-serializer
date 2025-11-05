import XYZ from 'ol/source/XYZ.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';
import type { Source } from 'ol/source.js';
import type { AttributionLike } from 'ol/source/Source.js';
import type { Extent } from 'ol/extent.js';
import type { Size } from 'ol/size.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IXYZ, ITileGrid } from '../../dto/source.js';
import { injectFunction } from '../../common/registry.js';

/**
 * XYZ Source序列化器
 */
export class XYZSourceSerializer extends BaseSourceSerializer<XYZ, IXYZ> {
  
  canSerialize(source: Source): source is XYZ {
    return source instanceof XYZ;
  }
  
  getTypeName(): string {
    return 'XYZ';
  }
  
  serialize(source: XYZ): IXYZ {
    const baseProps = this.getBaseProperties(source);
    const tileGrid = source.getTileGrid();
    let tileGridDto;
    
    if (tileGrid) {
      tileGridDto = this.serializeTileGrid(tileGrid);
    }
    
    return {
      ...baseProps,
      type: 'XYZ',
      attributions: (source.getAttributions() as any) ?? null,
      attributionsCollapsible: source.getAttributionsCollapsible() ?? true,
      cacheSize: null,
      crossOrigin: this.getSourceProperty(source, 'crossOrigin') || source.get('crossOrigin'),
      interpolate: source.getInterpolate() ?? true,
      opaque: this.getSourceProperty(source, 'opaque_') || source.get('opaque') || false,
      projection: source.getProjection()?.getCode() ?? undefined,
      reprojectionErrorThreshold: this.getSourceProperty(source, 'reprojectionErrorThreshold_') || source.get('reprojectionErrorThreshold') || 0.5,
      maxZoom: source.getTileGrid()?.getMaxZoom() || source.get('maxZoom') || 42,
      minZoom: source.getTileGrid()?.getMinZoom() || source.get('minZoom') || 0,
      maxResolution: source.get('maxResolution'),
      tileGrid: tileGridDto,
      tileSize: (tileGrid as any)?.['tileSize_'],
      gutter: source.getGutter() ?? 0,
      tileUrlFunction: this.serializeFunctionForDto(source.getTileUrlFunction()),
      url: source.get('url'),
      urls: source.getUrls(),
      wrapX: source.getWrapX() ?? true,
      transition: this.getSourceProperty(source, 'tileOptions.transition') || source.get('transition') || 250,
      zDirection: (source as any).zDirection ?? 0,
    };
  }
  
  deserialize(data: IXYZ): XYZ {
    const tileUrlFunction = data.tileUrlFunction ? this.deserializeFunctionFromDto(data.tileUrlFunction) as any : undefined;
    const tileLoadFunction = data.tileLoadFunction ? injectFunction(data.tileLoadFunction) : undefined;
    
    const xyzSource = new XYZ({
      attributions: data.attributions as AttributionLike,
      attributionsCollapsible: data.attributionsCollapsible ?? true,
      cacheSize: data.cacheSize ?? undefined,
      crossOrigin: data.crossOrigin,
      interpolate: data.interpolate ?? true,
      opaque: data.opaque ?? false,
      projection: data.projection ?? undefined,
      reprojectionErrorThreshold: data.reprojectionErrorThreshold ?? 0.5,
      maxZoom: data.maxZoom ?? 42,
      minZoom: data.minZoom ?? 0,
      maxResolution: data.maxResolution ?? undefined,
      tileGrid: data.tileGrid ? this.deserializeTileGrid(data.tileGrid) : undefined,
      tileLoadFunction: tileLoadFunction,
      tilePixelRatio: data.tilePixelRatio ?? 1,
      tileSize: (data.tileSize as Size) ?? [256, 256],
      gutter: data.gutter ?? 0,
      tileUrlFunction: tileUrlFunction,
      url: data.url ?? undefined,
      urls: data.urls ?? undefined,
      wrapX: data.wrapX ?? true,
      transition: data.transition ?? 250,
      zDirection: data.zDirection ?? 0
    });
    
    this.setBaseProperties(xyzSource, data);
    return xyzSource;
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
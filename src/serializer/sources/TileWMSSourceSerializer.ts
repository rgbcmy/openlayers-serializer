import { TileWMS } from 'ol/source.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';
import type { Source } from 'ol/source.js';
import type { AttributionLike } from 'ol/source/Source.js';
import type { Extent } from 'ol/extent.js';
import type { Size } from 'ol/size.js';
import type { ServerType } from 'ol/source/wms.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { ITileWMS, ITileGrid } from '../../dto/source.js';
import { injectFunction } from '../../common/registry.js';

/**
 * TileWMS Source序列化器
 */
export class TileWMSSourceSerializer extends BaseSourceSerializer<TileWMS, ITileWMS> {
  
  canSerialize(source: Source): source is TileWMS {
    return source instanceof TileWMS;
  }
  
  getTypeName(): string {
    return 'TileWMS';
  }
  
  serialize(source: TileWMS): ITileWMS {
    const baseProps = this.getBaseProperties(source);
    const tileGrid = source.getTileGrid();
    let tileGridDto;
    
    if (tileGrid) {
      tileGridDto = this.serializeTileGrid(tileGrid as TileGrid);
    }
    
    return {
      ...baseProps,
      type: 'TileWMS',
      attributions: (source.getAttributions() as any) ?? null,
      cacheSize: null,
      crossOrigin: this.getSourceProperty(source, 'crossOrigin') || source.get('crossOrigin'),
      interpolate: source.getInterpolate() ?? true,
      params: source.getParams(),
      gutter: source.getGutter() ?? 0,
      hidpi: this.getSourceProperty(source, 'hidpi_') ?? true,
      projection: source.getProjection()?.getCode() ?? undefined,
      reprojectionErrorThreshold: this.getSourceProperty(source, 'reprojectionErrorThreshold_') || source.get('reprojectionErrorThreshold') || 0.5,
      tileGrid: tileGridDto,
      serverType: this.getSourceProperty(source, 'serverType_'),
      tileLoadFunction: this.serializeFunctionForDto(source.getTileLoadFunction()),
      url: source.get('url'),
      urls: source.getUrls(),
      wrapX: source.getWrapX() ?? true,
      transition: this.getSourceProperty(source, 'tileOptions.transition') || source.get('transition'),
      zDirection: (source as any).zDirection ?? 0,
    };
  }
  
  deserialize(data: ITileWMS): TileWMS {
    const tileWMSSource = new TileWMS({
      attributions: data.attributions as AttributionLike,
      attributionsCollapsible: data.attributionsCollapsible ?? true,
      cacheSize: undefined,
      crossOrigin: data.crossOrigin,
      interpolate: data.interpolate ?? true,
      params: data.params as any,
      gutter: data.gutter ?? 0,
      hidpi: data.hidpi ?? true,
      projection: data.projection ?? undefined,
      reprojectionErrorThreshold: data.reprojectionErrorThreshold ?? 0.5,
      tileGrid: data.tileGrid ? this.deserializeTileGrid(data.tileGrid) : undefined,
      serverType: data.serverType as ServerType,
      url: data.url ?? undefined,
      urls: data.urls ?? undefined,
      wrapX: data.wrapX ?? true,
      transition: data.transition ?? undefined,
      zDirection: data.zDirection ?? 0
    });
    
    // 在创建 source 后，如果有自定义 tileLoadFunction，手动设置并绑定 this
    if (data.tileLoadFunction) {
      const customFunction = injectFunction(data.tileLoadFunction);
      if (typeof customFunction === 'function') {
        (tileWMSSource as any).tileLoadFunction_ = customFunction.bind(tileWMSSource);
      }
    }
    
    this.setBaseProperties(tileWMSSource, data);
    return tileWMSSource;
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
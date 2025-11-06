import { TileArcGISRest } from 'ol/source.js';
import type { Source } from 'ol/source.js';
import type { Extent } from 'ol/extent.js';
import type { Size } from 'ol/size.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { ITileArcGISRest, ITileGrid } from '../../dto/source.js';
import { injectFunction } from '../../common/registry.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';

/**
 * TileArcGISRest Source序列化器
 */
export class TileArcGISRestSourceSerializer extends BaseSourceSerializer<TileArcGISRest, ITileArcGISRest> {
  
  canSerialize(source: Source): source is TileArcGISRest {
    return source instanceof TileArcGISRest;
  }
  
  getTypeName(): string {
    return 'TileArcGISRest';
  }
  
  serialize(source: TileArcGISRest): ITileArcGISRest {
    const baseProps = this.getBaseProperties(source);
    const tileGrid = source.getTileGrid();
    let tileGridDto: ITileGrid | undefined;
    
    if (tileGrid) {
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
      
      tileGridDto = {
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
    
    return {
      ...baseProps,
      type: 'TileArcGISRest',
      attributions: (source.getAttributions() as any) ?? null,
      cacheSize: null,
      crossOrigin: this.getSourceProperty(source, 'crossOrigin') || source.get('crossOrigin'),
      interpolate: source.getInterpolate() ?? true,
      params: source.getParams(),
      hidpi: (source as any)['hidpi_'] ?? true,
      tileGrid: tileGridDto,
      projection: source.getProjection()?.getCode() ?? undefined,
      reprojectionErrorThreshold: this.getSourceProperty(source, 'reprojectionErrorThreshold_') || source.get('reprojectionErrorThreshold') || 0.5,
      tileLoadFunction: this.serializeFunctionForDto(source.getTileLoadFunction()),
      url: source.get('url'),
      wrapX: source.getWrapX() ?? true,
      transition: this.getSourceProperty(source, 'tileOptions.transition') || source.get('transition'),
      urls: source.getUrls(),
      zDirection: (source as any).zDirection ?? 0,
    };
  }
  
  deserialize(data: ITileArcGISRest): TileArcGISRest {
    const tileArcGISRestSource = new TileArcGISRest({
      attributions: data.attributions as any,
      cacheSize: data.cacheSize ?? undefined,
      crossOrigin: data.crossOrigin,
      interpolate: data.interpolate ?? true,
      params: data.params as any,
      hidpi: data.hidpi ?? true,
      tileGrid: data.tileGrid ? new TileGrid({
        extent: (data.tileGrid.extent as Extent),
        minZoom: data.tileGrid.minZoom ?? 0,
        origin: data.tileGrid.origin ?? undefined,
        origins: data.tileGrid.origins ?? undefined,
        resolutions: data.tileGrid.resolutions ?? [],
        sizes: data.tileGrid.sizes as Size[],
        tileSize: data.tileGrid.tileSize ?? undefined,
        tileSizes: data.tileGrid.tileSizes ?? undefined
      }) : undefined,
      projection: data.projection as any,
      reprojectionErrorThreshold: data.reprojectionErrorThreshold ?? 0.5,
      url: data.url,
      wrapX: data.wrapX ?? true,
      transition: data.transition ?? undefined,
      urls: data.urls ?? undefined,
      zDirection: data.zDirection ?? 0
    });
    
    // 在创建 source 后，如果有自定义 tileLoadFunction，手动设置并绑定 this
    if (data.tileLoadFunction) {
      const customFunction = injectFunction(data.tileLoadFunction);
      if (typeof customFunction === 'function') {
        (tileArcGISRestSource as any).tileLoadFunction_ = customFunction.bind(tileArcGISRestSource);
      }
    }
    
    this.setBaseProperties(tileArcGISRestSource, data);
    return tileArcGISRestSource;
  }
}

import { Zoomify } from 'ol/source.js';
import type { Source } from 'ol/source.js';
import type { Size } from 'ol/size.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IZoomify } from '../../dto/source.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';

/**
 * Zoomify Source序列化器
 */
export class ZoomifySourceSerializer extends BaseSourceSerializer<Zoomify, IZoomify> {
  
  canSerialize(source: Source): source is Zoomify {
    return source instanceof Zoomify;
  }
  
  getTypeName(): string {
    return 'Zoomify';
  }
  
  serialize(source: Zoomify): IZoomify {
    const baseProps = this.getBaseProperties(source);
    const tileGrid = source.getTileGrid();
    
    // 获取 Zoomify 图像尺寸
    const extent = tileGrid?.getExtent() as [number, number, number, number];
    const imageSize: [number, number] = extent ? [
      Math.abs(extent[2] - extent[0]),
      Math.abs(extent[3] - extent[1])
    ] : [0, 0];
    
    return {
      ...baseProps,
      type: 'Zoomify',
      attributions: (source.getAttributions() as any) ?? null,
      cacheSize: null,
      crossOrigin: this.getSourceProperty(source, 'crossOrigin') || source.get('crossOrigin'),
      interpolate: source.getInterpolate() ?? true,
      projection: source.getProjection()?.getCode() ?? undefined,
      tilePixelRatio: (source as any)['tilePixelRatio_'] ?? 1,
      reprojectionErrorThreshold: this.getSourceProperty(source, 'reprojectionErrorThreshold_') || source.get('reprojectionErrorThreshold') || 0.5,
      url: source.get('url'),
      tierSizeCalculation: source.get('tierSizeCalculation'),
      size: imageSize,
      extent: extent,
      transition: this.getSourceProperty(source, 'tileOptions.transition') || source.get('transition'),
      tileSize: tileGrid?.getTileSize(0) as any,
      zDirection: (source as any).zDirection ?? 0,
    };
  }
  
  deserialize(data: IZoomify): Zoomify {
    const zoomifySource = new Zoomify({
      attributions: data.attributions as any,
      cacheSize: undefined,
      crossOrigin: data.crossOrigin,
      interpolate: data.interpolate ?? true,
      projection: data.projection ?? undefined,
      tilePixelRatio: data.tilePixelRatio ?? undefined,
      reprojectionErrorThreshold: data.reprojectionErrorThreshold ?? 0.5,
      url: data.url ?? '',
      tierSizeCalculation: (data.tierSizeCalculation ?? 'default') as 'default' | 'truncated',
      size: data.size as Size,
      extent: data.extent ?? undefined,
      transition: data.transition ?? undefined,
      tileSize: (data.tileSize as any) ?? 256,
      zDirection: data.zDirection ?? 0,
    });
    
    this.setBaseProperties(zoomifySource, data);
    return zoomifySource;
  }
}

import TileLayer from 'ol/layer/Tile.js';
import type { Layer } from 'ol/layer.js';
import type TileSource from 'ol/source/Tile.js';
import { BaseLayerSerializer } from '../base/BaseLayerSerializer.js';
import type { ITileLayer } from '../../dto/layer.js';

/**
 * TileLayer序列化器
 */
export class TileLayerSerializer extends BaseLayerSerializer<TileLayer<TileSource>, ITileLayer> {
  
  canSerialize(layer: Layer): layer is TileLayer<TileSource> {
    return layer instanceof TileLayer;
  }
  
  getTypeName(): string {
    return 'Tile';
  }
  
  serialize(layer: TileLayer<TileSource>): ITileLayer {
    const baseProps = this.getBaseProperties(layer);
    const source = this.serializeLayerSource(layer);
    
    return {
      ...baseProps,
      type: 'Tile',
      source: source,
      preload: this.getLayerProperty(layer, 'preload_') ?? null,
      useInterimTilesOnError: this.getLayerProperty(layer, 'useInterimTilesOnError_') ?? null,
    };
  }
  
  deserialize(data: ITileLayer): TileLayer<TileSource> {
    const source = this.deserializeLayerSource(data.source);
    
    const tileLayer = new TileLayer({
      source: source,
      preload: data.preload ?? undefined,
      useInterimTilesOnError: data.useInterimTilesOnError ?? undefined,
      className: data.className ?? undefined,
      opacity: data.opacity ?? undefined,
      visible: data.visible ?? undefined,
      extent: data.extent ?? undefined,
      minResolution: data.minResolution ?? undefined,
      maxResolution: data.maxResolution ?? undefined,
      minZoom: data.minZoom ?? undefined,
      maxZoom: data.maxZoom ?? undefined,
      zIndex: data.zIndex ?? undefined,
    });
    
    this.setBaseProperties(tileLayer, data);
    return tileLayer;
  }
}
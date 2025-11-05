import ImageLayer from 'ol/layer/Image.js';
import type { Layer } from 'ol/layer.js';
import { BaseLayerSerializer } from '../base/BaseLayerSerializer.js';
import type { IImageLayer } from '../../dto/layer.js';

/**
 * ImageLayer序列化器
 * TODO: 原文件注释 - 图像图层完善
 */
export class ImageLayerSerializer extends BaseLayerSerializer<ImageLayer<any>, IImageLayer> {
  
  canSerialize(layer: Layer): layer is ImageLayer<any> {
    return layer instanceof ImageLayer;
  }
  
  getTypeName(): string {
    return 'ImageLayer';
  }
  
  serialize(layer: ImageLayer<any>): IImageLayer {
    const baseProps = this.getBaseProperties(layer);
    const serializedSource = this.serializeLayerSource(layer);
    
    return {
      ...baseProps,
      type: 'Image',
      source: serializedSource
    };
  }
  
  deserialize(data: IImageLayer): ImageLayer<any> {
    const source = this.deserializeLayerSource(data.source);
    
    const imageLayer = new ImageLayer({
      source: source as any,
      className: data.className || undefined,
      opacity: data.opacity ?? 1,
      visible: data.visible ?? true,
      extent: data.extent || undefined,
      minResolution: data.minResolution ?? 0,
      maxResolution: data.maxResolution ?? Infinity,
      minZoom: data.minZoom ?? -Infinity,
      maxZoom: data.maxZoom ?? Infinity,
      zIndex: data.zIndex ?? undefined
    });
    
    this.setBaseProperties(imageLayer, data);
    return imageLayer;
  }
}
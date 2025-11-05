import ImageStatic from 'ol/source/ImageStatic.js';
import type { Source } from 'ol/source.js';
import type { AttributionLike } from 'ol/source/Source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IImageStatic } from '../../dto/source.js';

/**
 * ImageStatic Source序列化器
 */
export class ImageStaticSourceSerializer extends BaseSourceSerializer<ImageStatic, IImageStatic> {
  
  canSerialize(source: Source): source is ImageStatic {
    return source instanceof ImageStatic;
  }
  
  getTypeName(): string {
    return 'ImageStatic';
  }
  
  serialize(source: ImageStatic): IImageStatic {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'ImageStatic',
      attributions: (source.getAttributions() as any),
      crossOrigin: this.getSourceProperty(source, 'crossOrigin') || source.get('crossOrigin'),
      imageExtent: source.getImageExtent() as [number, number, number, number],
      interpolate: source.getInterpolate() ?? true,
      projection: source.getProjection()?.getCode() ?? undefined,
      url: source.getUrl(),
    };
  }
  
  deserialize(data: IImageStatic): ImageStatic {
    const imageStaticSource = new ImageStatic({
      attributions: data.attributions as AttributionLike,
      crossOrigin: data.crossOrigin,
      imageExtent: data.imageExtent!,
      interpolate: data.interpolate ?? true,
      projection: data.projection ?? undefined,
      url: data.url ?? "",
    });
    
    this.setBaseProperties(imageStaticSource, data);
    return imageStaticSource;
  }
}
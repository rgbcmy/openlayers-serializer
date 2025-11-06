import { ImageArcGISRest } from 'ol/source.js';
import type { Source } from 'ol/source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IImageArcGISRest } from '../../dto/source.js';

/**
 * ImageArcGISRest Source序列化器
 */
export class ImageArcGISRestSourceSerializer extends BaseSourceSerializer<ImageArcGISRest, IImageArcGISRest> {
  
  canSerialize(source: Source): source is ImageArcGISRest {
    return source instanceof ImageArcGISRest;
  }
  
  getTypeName(): string {
    return 'ImageArcGISRest';
  }
  
  serialize(source: ImageArcGISRest): IImageArcGISRest {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'ImageArcGISRest',
      attributions: (source.getAttributions() as any) ?? null,
      crossOrigin: this.getSourceProperty(source, 'crossOrigin') || source.get('crossOrigin'),
      hidpi: (source as any)['hidpi_'] ?? true,
      interpolate: source.getInterpolate() ?? true,
      params: source.getParams(),
      projection: source.getProjection()?.getCode() ?? undefined,
      ratio: (source as any)['ratio_'] ?? 1.5,
      resolutions: source.getResolutions(),
      url: source.getUrl()
    };
  }
  
  deserialize(data: IImageArcGISRest): ImageArcGISRest {
    const imageArcGISRestSource = new ImageArcGISRest({
      attributions: data.attributions as any,
      crossOrigin: data.crossOrigin,
      hidpi: data.hidpi ?? true,
      interpolate: data.interpolate ?? true,
      params: data.params as any,
      projection: data.projection ?? undefined,
      ratio: data.ratio ?? 1.5,
      resolutions: data.resolutions ?? undefined,
      url: data.url
    });
    
    this.setBaseProperties(imageArcGISRestSource, data);
    return imageArcGISRestSource;
  }
}

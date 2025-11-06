import { ImageWMS } from 'ol/source.js';
import type { Source } from 'ol/source.js';
import type { ServerType } from 'ol/source/wms.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IImageWMS } from '../../dto/source.js';

/**
 * ImageWMS Source序列化器
 */
export class ImageWMSSourceSerializer extends BaseSourceSerializer<ImageWMS, IImageWMS> {
  
  canSerialize(source: Source): source is ImageWMS {
    return source instanceof ImageWMS;
  }
  
  getTypeName(): string {
    return 'ImageWMS';
  }
  
  serialize(source: ImageWMS): IImageWMS {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'ImageWMS',
      attributions: (source.getAttributions() as any),
      crossOrigin: this.getSourceProperty(source, 'crossOrigin') || source.get('crossOrigin'),
      hidpi: (source as any)['hidpi_'] ?? true,
      serverType: (source as any)['serverType_'],
      interpolate: source.getInterpolate() ?? true,
      params: source.getParams(),
      projection: source.getProjection()?.getCode() ?? undefined,
      ratio: (source as any)['ratio_'] ?? 1.5,
      resolutions: source.getResolutions(),
      url: source.getUrl(),
    };
  }
  
  deserialize(data: IImageWMS): ImageWMS {
    const imageWMSSource = new ImageWMS({
      attributions: data.attributions as any,
      crossOrigin: data.crossOrigin,
      hidpi: data.hidpi ?? true,
      serverType: data.serverType as ServerType,
      interpolate: data.interpolate ?? true,
      params: data.params as any,
      projection: data.projection ?? undefined,
      ratio: data.ratio ?? 1.5,
      resolutions: data.resolutions ?? undefined,
      url: data.url
    });
    
    this.setBaseProperties(imageWMSSource, data);
    return imageWMSSource;
  }
}

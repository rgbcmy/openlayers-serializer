import { UTFGrid } from 'ol/source.js';
import type { Source } from 'ol/source.js';
import { BaseSourceSerializer } from '../base/BaseSourceSerializer.js';
import type { IUTFGrid } from '../../dto/source.js';

/**
 * UTFGrid Source序列化器
 * TODO: 原文件注释 - UTF网格交互完善
 */
export class UTFGridSourceSerializer extends BaseSourceSerializer<UTFGrid, IUTFGrid> {
  
  canSerialize(source: Source): source is UTFGrid {
    return source instanceof UTFGrid;
  }
  
  getTypeName(): string {
    return 'UTFGrid';
  }
  
  serialize(source: UTFGrid): IUTFGrid {
    const baseProps = this.getBaseProperties(source);
    
    return {
      ...baseProps,
      type: 'UTFGrid',
      jsonp: this.getSourceProperty(source, 'jsonp') || source.get('jsonp') || false,
      preemptive: this.getSourceProperty(source, 'preemptive') || source.get('preemptive') || true,
      tileJSON: this.getSourceProperty(source, 'tileJSON') || source.get('tileJSON') || null,
      url: this.getSourceProperty(source, 'url') || source.get('url') || null,
      wrapX: source.get('wrapX') ?? true
      // TODO: 原文件中需要处理更多UTFGrid特定配置
    };
  }
  
  deserialize(data: IUTFGrid): UTFGrid {
    const utfGridSource = new UTFGrid({
      jsonp: data.jsonp ?? false,
      preemptive: data.preemptive ?? true,
      tileJSON: data.tileJSON as any,
      url: data.url || undefined,
      wrapX: data.wrapX ?? true
    });
    
    this.setBaseProperties(utfGridSource, data);
    return utfGridSource;
  }
}
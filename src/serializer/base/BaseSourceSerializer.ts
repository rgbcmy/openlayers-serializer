import type { Source } from 'ol/source.js';
import type { ISerializedSource, ISource } from '../../dto/source.js';
import type { ISourceSerializer } from './ISerializer.js';
import { serializeFunction, deserializeFunction } from '../utils.js';

/**
 * Source序列化器基类
 * 提供通用的序列化功能
 */
export abstract class BaseSourceSerializer<T extends Source = Source, D extends ISerializedSource = ISerializedSource> 
  implements ISourceSerializer<T, D> {
  
  abstract canSerialize(source: Source): source is T;
  abstract serialize(source: T): D;
  abstract deserialize(data: D): T;
  abstract getTypeName(): string;
  
  /**
   * 获取source的基础属性
   */
  protected getBaseProperties(source: Source): Pick<ISource, 'id' | 'name'> {
    return {
      id: source.get('id') || crypto.randomUUID(),
      name: source.get('name') || 'Untitled'
    };
  }
  
  /**
   * 设置source的基础属性
   */
  protected setBaseProperties(source: Source, data: D): void {
    source.setProperties({
      id: (data as any).id ?? crypto.randomUUID(),
      name: (data as any).name ?? 'Untitled'
    });
  }
  
  /**
   * 序列化函数为DTO格式
   * 直接返回函数字符串，供 injectFunction() 使用
   */
  protected serializeFunctionForDto(func: Function | undefined): string | undefined {
    if (!func) return undefined;
    return func.toString();
  }
  
  /**
   * 安全获取source属性
   */
  protected getSourceProperty<K>(source: Source, key: string, defaultValue?: K): K | undefined {
    return (source as any)[key] ?? source.get(key) ?? defaultValue;
  }
}
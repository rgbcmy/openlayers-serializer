import { 
  serializeFunction as serializeFunctionCore, 
  deserializeFunction as deserializeFunctionCore, 
  type SerializedFunction 
} from '../common/safe-functions';

export function cleanUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined);
  } else if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) {
        result[key] = null;
      } else {
        result[key] = cleanUndefined(value);
      }
    }
    return result;
  }
  return obj;
}

/**
 * 移除所有值为 null 的字段，防止传入构造函数时报错。
 */
export function cleanNull<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null)
  ) as Partial<T>;
}

export function cleanNullToUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== null) {
      result[key] = value;
    }
    // 如果是 null，就不加进去 => 变成 undefined
  }
  return result;
}

/**
 * 安全的函数序列化
 */
export function serializeFunction(func: Function | undefined): SerializedFunction | undefined {
  return serializeFunctionCore(func);
}

/**
 * 安全的函数反序列化
 */
export function deserializeFunction(serialized: SerializedFunction | string | null): Function | undefined {
  if (!serialized) {
    return undefined;
  }
  
  // 兼容旧的字符串格式
  if (typeof serialized === 'string') {
    console.warn('Using legacy string-based function deserialization. Consider upgrading to new format.');
    try {
      // 使用 Function 构造器替代 eval
      return new Function('return ' + serialized)();
    } catch (e) {
      console.error('反序列化函数失败', e);
      return undefined;
    }
  }
  
  return deserializeFunctionCore(serialized);
}
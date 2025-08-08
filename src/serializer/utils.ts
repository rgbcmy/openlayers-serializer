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

export function serializeFunction(func: Function | undefined) {
  if (!func) {
    return undefined;
  }
  return func.toString();
}

export function deserializeFunction(funcStr: string | null) {
  if (!funcStr) {
    return undefined;
  }
  try {
    return eval(`(${funcStr})`);
  } catch (e) {
    console.error('反序列化函数失败', e);
    return undefined;
  }
}
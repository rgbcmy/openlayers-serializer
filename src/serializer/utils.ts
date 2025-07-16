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
function cleanNull<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null)
  ) as Partial<T>;
}
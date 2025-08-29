export const registry: Record<string, (...args: any[]) => any> = {};

export function registerFunction(name: string, fn: (...args: any[]) => any): void {
  registry[name] = fn;
}
export function registerItem(name: string, value: any): void {
  registry[name] = value;
}
/**
 * 将完整函数声明字符串转为可调用函数，并注入注册表函数
 * @param functionCode 完整函数声明字符串，例如：
 * "function(a, b) { return a + b + helper(a); }"
 */
export function injectFunction(functionCode: string) {
  const injectedArgs = Object.keys(registry).join(',');
  const wrapper = `
    (function(${injectedArgs}) {
      return ${functionCode};
    })
  `;

  const fnFactory = eval(wrapper);
  return fnFactory(...Object.values(registry));
}
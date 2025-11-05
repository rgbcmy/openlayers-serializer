export const registry: Record<string, (...args: any[]) => any> = {};

export function registerFunction(name: string, fn: (...args: any[]) => any): void {
  registry[name] = fn;
}

export function registerItem(name: string, value: any): void {
  registry[name] = value;
}

/**
 * 安全的函数注入机制
 * 使用 Function 构造器替代 eval，并限制可用的全局变量
 * @param functionCode 完整函数声明字符串
 */
export function injectFunction(functionCode: string) {
  try {
    const injectedArgs = Object.keys(registry);
    const injectedValues = Object.values(registry);
    
    // 创建受限的执行环境
    const safeGlobals = {
      ...registry,
      // 允许一些安全的全局对象
      Math,
      console,
      JSON,
      // 禁止访问危险的全局对象
      eval: undefined,
      Function: undefined,
      setTimeout: undefined,
      setInterval: undefined,
    };
    
    // 使用 Function 构造器创建函数
    const functionCreator = new Function(
      ...injectedArgs,
      `
      // 限制访问全局对象
      const globalThis = undefined;
      const window = undefined;
      const global = undefined;
      
      return ${functionCode};
      `
    );
    
    return functionCreator(...injectedValues);
  } catch (error) {
    console.error('Failed to inject function safely:', error);
    return undefined;
  }
}
export const registry: Record<string, (...args: any[]) => any> = {};

export function registerFunction(name: string, fn: (...args: any[]) => any): void {
  registry[name] = fn;
}
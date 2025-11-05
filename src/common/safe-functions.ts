/**
 * 函数序列化和反序列化机制
 * 专为地图编辑器优化 - 默认使用 eval 模式，简单直接
 */

import { quadKey } from 'ol/source/BingMaps.js';
import { all, bbox, tile } from 'ol/loadingstrategy.js';

// 序列化模式
export const SerializationMode = {
  SAFE: 'safe',         // 安全模式 - 使用 Function 构造器
  EVAL: 'eval',         // Eval 模式 - 直接使用 eval（默认，最兼容）
  HYBRID: 'hybrid'      // 混合模式 - 常用函数优化 + eval
} as const;

export type SerializationMode = typeof SerializationMode[keyof typeof SerializationMode];

// 当前序列化模式（默认 eval 模式，最适合地图编辑器）
let currentMode: SerializationMode = SerializationMode.EVAL;

/**
 * 设置序列化模式
 */
export function setSerializationMode(mode: SerializationMode): void {
  currentMode = mode;
  console.info(`Function serialization mode set to: ${mode}`);
}

/**
 * 获取当前序列化模式
 */
export function getSerializationMode(): SerializationMode {
  return currentMode;
}

// 常用函数映射表（用于性能优化）
export const COMMON_FUNCTIONS = {
  // OpenLayers 核心
  quadKey,
  all,
  bbox,
  tile,
  
  // 基础对象
  Math,
  console,
  JSON,
  Date,
  
  // 常用全局函数
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  
  // 地图编辑器常用 Web API
  fetch,
  Image,
  URL,
  setTimeout,
  clearTimeout,
  
  // 数学函数
  pow: Math.pow,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  abs: Math.abs,
  min: Math.min,
  max: Math.max,
  random: Math.random,
  PI: Math.PI,
} as const;

export type CommonFunctionKey = keyof typeof COMMON_FUNCTIONS;

// 函数序列化结果
export interface SerializedFunction {
  type: 'common' | 'custom';
  key?: CommonFunctionKey;
  code?: string;
}

// 最小安全检查 - 只防止明显的恶意代码注入
const CRITICAL_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,  // 脚本标签
  /javascript\s*:\s*void/i,               // javascript: 协议
  /data\s*:\s*text\/html/i,               // HTML data URL
];

function minimalSecurityCheck(funcStr: string): boolean {
  if (currentMode === SerializationMode.EVAL) {
    // EVAL 模式跳过所有检查
    return true;
  }
  
  for (const pattern of CRITICAL_PATTERNS) {
    if (pattern.test(funcStr)) {
      console.warn('Critical security pattern detected:', pattern);
      return false;
    }
  }
  return true;
}

/**
 * 函数序列化（地图编辑器优化版）
 */
export function serializeFunction(func: Function | undefined): SerializedFunction | undefined {
  if (!func) {
    return undefined;
  }

  // 检查是否是常用函数（性能优化）
  for (const [key, commonFunc] of Object.entries(COMMON_FUNCTIONS)) {
    if (func === commonFunc) {
      return {
        type: 'common',
        key: key as CommonFunctionKey,
      };
    }
  }

  // 自定义函数处理
  const funcStr = func.toString();
  
  if (!minimalSecurityCheck(funcStr)) {
    console.error('Function failed security check:', funcStr.substring(0, 100) + '...');
    return undefined;
  }

  return {
    type: 'custom',
    code: funcStr,
  };
}

/**
 * 函数反序列化（地图编辑器优化版）
 */
export function deserializeFunction(serialized: SerializedFunction | undefined): Function | undefined {
  if (!serialized) {
    return undefined;
  }

  try {
    // 常用函数直接返回
    if (serialized.type === 'common' && serialized.key) {
      return COMMON_FUNCTIONS[serialized.key] as Function;
    }

    // 自定义函数处理
    if (serialized.type === 'custom' && serialized.code) {
      if (!minimalSecurityCheck(serialized.code)) {
        console.error('Function code failed security check during deserialization');
        return undefined;
      }

      if (currentMode === SerializationMode.EVAL) {
        // 直接使用 eval - 最简单最兼容
        return eval(`(${serialized.code})`);
      } else {
        // 使用 Function 构造器 - 相对安全
        return new Function('return ' + serialized.code)();
      }
    }

    return undefined;
  } catch (error) {
    console.error('Failed to deserialize function:', error);
    return undefined;
  }
}

/**
 * 注册新的常用函数（扩展性）
 */
export function registerCommonFunction(key: string, func: Function): void {
  (COMMON_FUNCTIONS as any)[key] = func;
}

/**
 * 批量注册常用函数
 */
export function registerCommonFunctions(functions: Record<string, Function>): void {
  for (const [key, func] of Object.entries(functions)) {
    registerCommonFunction(key, func);
  }
}

/**
 * 预注册一些地图编辑器常用的函数
 */
export function registerMapEditorFunctions(): void {
  registerCommonFunctions({
    // 瓦片加载器
    simpleTileLoader: function(tile: any, src: string) {
      tile.getImage().src = src;
    },
    
    // 带重试的瓦片加载器
    retryTileLoader: function(tile: any, src: string) {
      const img = tile.getImage();
      let retries = 0;
      const load = () => {
        img.addEventListener('error', () => {
          if (retries < 3) {
            retries++;
            setTimeout(load, 1000);
          }
        });
        img.src = src;
      };
      load();
    },
    
    // 调试加载器
    debugTileLoader: function(tile: any, src: string) {
      console.log('Loading tile:', src);
      tile.getImage().src = src;
    }
  });
}

// 使用建议
/*
地图编辑器推荐配置：

1. 默认 eval 模式（已设置）- 最简单最兼容，适合地图编辑器
   // 无需设置，已经是默认模式

2. 如果需要更多安全性（企业环境）
   setSerializationMode(SerializationMode.SAFE);

3. 如果需要性能优化（大量重复函数）
   setSerializationMode(SerializationMode.HYBRID);
   registerMapEditorFunctions();

示例使用：
```javascript
// 直接使用，支持所有 JavaScript 函数
const customLoader = function(tile, src) {
  fetch(src).then(response => response.blob())
    .then(blob => tile.getImage().src = URL.createObjectURL(blob));
};

// 序列化和反序列化
const serialized = serializeFunction(customLoader);
const restored = deserializeFunction(serialized);
```
*/
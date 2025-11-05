/**
 * 改进的错误处理机制
 * 为序列化/反序列化过程提供详细的错误信息和恢复策略
 */

// 自定义错误类型
export class SerializationError extends Error {
  public readonly code: string;
  public readonly context?: any;
  public readonly suggestions?: string[];

  constructor(
    message: string, 
    code: string = 'SERIALIZATION_ERROR', 
    context?: any, 
    suggestions?: string[]
  ) {
    super(message);
    this.name = 'SerializationError';
    this.code = code;
    this.context = context;
    this.suggestions = suggestions;
  }
}

export class DeserializationError extends Error {
  public readonly code: string;
  public readonly context?: any;
  public readonly suggestions?: string[];

  constructor(
    message: string, 
    code: string = 'DESERIALIZATION_ERROR', 
    context?: any, 
    suggestions?: string[]
  ) {
    super(message);
    this.name = 'DeserializationError';
    this.code = code;
    this.context = context;
    this.suggestions = suggestions;
  }
}

export class ValidationError extends Error {
  public readonly code: string;
  public readonly context?: any;
  public readonly validationErrors?: any[];

  constructor(
    message: string, 
    code: string = 'VALIDATION_ERROR', 
    context?: any, 
    validationErrors?: any[]
  ) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.context = context;
    this.validationErrors = validationErrors;
  }
}

// 错误恢复策略
export interface ErrorRecoveryOptions {
  skipInvalidLayers?: boolean;
  useDefaultValues?: boolean;
  logWarnings?: boolean;
  throwOnCriticalErrors?: boolean;
}

// 默认恢复选项
export const DEFAULT_RECOVERY_OPTIONS: ErrorRecoveryOptions = {
  skipInvalidLayers: true,
  useDefaultValues: true,
  logWarnings: true,
  throwOnCriticalErrors: false,
};

// 错误处理工具函数
export class ErrorHandler {
  private options: ErrorRecoveryOptions;

  constructor(options: ErrorRecoveryOptions = DEFAULT_RECOVERY_OPTIONS) {
    this.options = { ...DEFAULT_RECOVERY_OPTIONS, ...options };
  }

  /**
   * 安全执行函数，捕获并处理错误
   */
  safeExecute<T>(
    operation: () => T,
    fallback: T,
    context?: string
  ): T {
    try {
      return operation();
    } catch (error) {
      this.handleError(error, context);
      return fallback;
    }
  }

  /**
   * 安全执行异步函数
   */
  async safeExecuteAsync<T>(
    operation: () => Promise<T>,
    fallback: T,
    context?: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, context);
      return fallback;
    }
  }

  /**
   * 处理错误的核心逻辑
   */
  private handleError(error: any, context?: string): void {
    if (this.options.logWarnings) {
      console.warn(`Error in ${context || 'unknown context'}:`, error);
    }

    if (this.options.throwOnCriticalErrors && this.isCriticalError(error)) {
      throw error;
    }
  }

  /**
   * 判断是否为关键错误
   */
  private isCriticalError(error: any): boolean {
    return error instanceof TypeError || 
           error instanceof ReferenceError ||
           (error instanceof DeserializationError && error.code === 'CRITICAL_ERROR');
  }

  /**
   * 验证并修复地图数据
   */
  validateAndFixMapData(data: any): { data: any; warnings: string[] } {
    const warnings: string[] = [];

    // 基本结构检查
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Map data must be an object');
    }

    // 必需字段检查和修复
    if (!data.id) {
      data.id = crypto.randomUUID();
      warnings.push('Missing map ID, generated new one');
    }

    if (!data.name) {
      data.name = 'Untitled Map';
      warnings.push('Missing map name, using default');
    }

    if (!data.target) {
      data.target = 'mapContainer';
      warnings.push('Missing map target, using default');
    }

    if (!data.view) {
      throw new ValidationError('Map view is required', 'MISSING_VIEW');
    }

    if (!Array.isArray(data.layers)) {
      data.layers = [];
      warnings.push('Invalid or missing layers array, using empty array');
    }

    // 清理无效的图层
    if (this.options.skipInvalidLayers) {
      const originalLayerCount = data.layers.length;
      data.layers = data.layers.filter((layer: any) => {
        return layer && 
               typeof layer === 'object' && 
               layer.type && 
               layer.source;
      });
      
      const removedCount = originalLayerCount - data.layers.length;
      if (removedCount > 0) {
        warnings.push(`Removed ${removedCount} invalid layer(s)`);
      }
    }

    return { data, warnings };
  }

  /**
   * 验证并修复视图数据
   */
  validateAndFixViewData(data: any): { data: any; warnings: string[] } {
    const warnings: string[] = [];

    if (!data || typeof data !== 'object') {
      throw new ValidationError('View data must be an object');
    }

    // 检查并修复中心点
    if (!Array.isArray(data.center) || data.center.length !== 2) {
      data.center = [0, 0];
      warnings.push('Invalid center, using [0, 0]');
    }

    // 检查并修复缩放级别
    if (typeof data.zoom !== 'number' || data.zoom < 0 || data.zoom > 30) {
      data.zoom = 2;
      warnings.push('Invalid zoom level, using 2');
    }

    // 检查投影
    if (!data.projection) {
      data.projection = 'EPSG:3857';
      warnings.push('Missing projection, using EPSG:3857');
    }

    // 检查旋转
    if (typeof data.rotation !== 'number') {
      data.rotation = 0;
      warnings.push('Invalid rotation, using 0');
    }

    return { data, warnings };
  }

  /**
   * 验证并修复图层数据
   */
  validateAndFixLayerData(data: any): { data: any; warnings: string[] } {
    const warnings: string[] = [];

    if (!data || typeof data !== 'object') {
      throw new ValidationError('Layer data must be an object');
    }

    // 必需字段检查
    if (!data.type) {
      throw new ValidationError('Layer type is required', 'MISSING_LAYER_TYPE');
    }

    if (!data.source) {
      throw new ValidationError('Layer source is required', 'MISSING_LAYER_SOURCE');
    }

    // 设置默认值
    if (!data.id) {
      data.id = crypto.randomUUID();
      warnings.push('Generated layer ID');
    }

    if (!data.name) {
      data.name = `${data.type} Layer`;
      warnings.push('Generated layer name');
    }

    if (typeof data.opacity !== 'number' || data.opacity < 0 || data.opacity > 1) {
      data.opacity = 1;
      warnings.push('Invalid opacity, using 1');
    }

    if (typeof data.visible !== 'boolean') {
      data.visible = true;
      warnings.push('Invalid visibility, using true');
    }

    return { data, warnings };
  }

  /**
   * 验证并修复数据源数据
   */
  validateAndFixSourceData(data: any): { data: any; warnings: string[] } {
    const warnings: string[] = [];

    if (!data || typeof data !== 'object') {
      throw new ValidationError('Source data must be an object');
    }

    if (!data.type) {
      throw new ValidationError('Source type is required', 'MISSING_SOURCE_TYPE');
    }

    // 设置默认值
    if (!data.id) {
      data.id = crypto.randomUUID();
      warnings.push('Generated source ID');
    }

    if (!data.name) {
      data.name = `${data.type} Source`;
      warnings.push('Generated source name');
    }

    return { data, warnings };
  }
}

// 全局错误处理器实例
export const globalErrorHandler = new ErrorHandler();

// 便利函数
export function safeSerialize<T>(
  serializer: () => T,
  fallback: T,
  context?: string
): T {
  return globalErrorHandler.safeExecute(serializer, fallback, context);
}

export function safeDeserialize<T>(
  deserializer: () => T,
  fallback: T,
  context?: string
): T {
  return globalErrorHandler.safeExecute(deserializer, fallback, context);
}
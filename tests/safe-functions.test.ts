/**
 * 函数序列化机制的单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  COMMON_FUNCTIONS,
  serializeFunction,
  deserializeFunction,
  registerCommonFunction,
  SerializationMode,
  setSerializationMode,
  getSerializationMode,
} from '../src/common/safe-functions';
import { quadKey } from 'ol/source/BingMaps.js';

describe('Function Serialization', () => {
  beforeEach(() => {
    // 重置为默认模式
    setSerializationMode(SerializationMode.EVAL);
  });

  describe('COMMON_FUNCTIONS registry', () => {
    it('should contain predefined common functions', () => {
      expect(COMMON_FUNCTIONS.quadKey).toBe(quadKey);
      expect(COMMON_FUNCTIONS.Math).toBe(Math);
      expect(typeof COMMON_FUNCTIONS.Math.pow).toBe('function');
    });
  });

  describe('serializeFunction', () => {
    it('should handle undefined input', () => {
      const result = serializeFunction(undefined);
      expect(result).toBeUndefined();
    });

    it('should serialize common functions as references', () => {
      const result = serializeFunction(quadKey);
      expect(result?.type).toBe('common');
      expect(result?.key).toBe('quadKey');
    });

    it('should serialize custom functions as code', () => {
      const customFunc = function test() { return 42; };
      const result = serializeFunction(customFunc);
      expect(result?.type).toBe('custom');
      expect(result?.code).toContain('return 42');
    });

    it('should handle arrow functions', () => {
      const arrowFunc = () => 'hello';
      const result = serializeFunction(arrowFunc);
      expect(result?.type).toBe('custom');
      expect(result?.code).toContain('hello');
    });

    it('should handle complex functions', () => {
      const complexFunc = function(a: number, b: number) {
        const sum = a + b;
        return sum * 2;
      };
      const result = serializeFunction(complexFunc);
      expect(result?.type).toBe('custom');
      expect(result?.code).toContain('a + b');
    });
  });

  describe('deserializeFunction', () => {
    it('should handle undefined input', () => {
      const result = deserializeFunction(undefined);
      expect(result).toBeUndefined();
    });

    it('should deserialize common function references', () => {
      const serialized = { type: 'common' as const, key: 'quadKey' as const };
      const result = deserializeFunction(serialized);
      expect(result).toBe(quadKey);
    });

    it('should deserialize custom functions in EVAL mode', () => {
      setSerializationMode(SerializationMode.EVAL);
      const serialized = { 
        type: 'custom' as const, 
        code: 'function() { return 42; }' 
      };
      const result = deserializeFunction(serialized);
      expect(typeof result).toBe('function');
      expect(result?.()).toBe(42);
    });

    it('should deserialize custom functions in SAFE mode', () => {
      setSerializationMode(SerializationMode.SAFE);
      const serialized = { 
        type: 'custom' as const, 
        code: 'function() { return 42; }' 
      };
      const result = deserializeFunction(serialized);
      expect(typeof result).toBe('function');
      expect(result?.()).toBe(42);
    });

    it('should handle function deserialization errors gracefully', () => {
      const serialized = { 
        type: 'custom' as const, 
        code: 'invalid javascript code !!!' 
      };
      const result = deserializeFunction(serialized);
      expect(result).toBeUndefined();
    });
  });

  describe('registerCommonFunction', () => {
    it('should register a new common function', () => {
      const testFunc = function square(x: number) { return x * x; };
      registerCommonFunction('square', testFunc);
      
      expect((COMMON_FUNCTIONS as any).square).toBe(testFunc);
    });
  });

  describe('serialization modes', () => {
    it('should get and set serialization mode', () => {
      expect(getSerializationMode()).toBe(SerializationMode.EVAL);
      
      setSerializationMode(SerializationMode.SAFE);
      expect(getSerializationMode()).toBe(SerializationMode.SAFE);
      
      setSerializationMode(SerializationMode.HYBRID);
      expect(getSerializationMode()).toBe(SerializationMode.HYBRID);
    });
  });

  describe('full roundtrip tests', () => {
    it('should serialize and deserialize common functions correctly', () => {
      const original = quadKey;
      const serialized = serializeFunction(original);
      const deserialized = deserializeFunction(serialized);
      
      expect(deserialized).toBe(original);
    });

    it('should serialize and deserialize custom functions correctly', () => {
      const original = function multiply(a: number, b: number) { return a * b; };
      const serialized = serializeFunction(original);
      const deserialized = deserializeFunction(serialized);
      
      expect(typeof deserialized).toBe('function');
      expect(deserialized?.(3, 4)).toBe(12);
    });
  });
});
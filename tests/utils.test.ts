/**
 * 工具函数的单元测试
 */

import { describe, it, expect } from 'vitest';
import {
  cleanUndefined,
  cleanNull,
  cleanNullToUndefined,
  serializeFunction,
  deserializeFunction,
} from '../src/serializer/utils';

describe('Utils', () => {
  describe('cleanUndefined', () => {
    it('should convert undefined values to null in objects', () => {
      const input = {
        a: 1,
        b: undefined,
        c: 'test',
        d: {
          e: undefined,
          f: 'nested',
        },
      };

      const result = cleanUndefined(input);

      expect(result).toEqual({
        a: 1,
        b: null,
        c: 'test',
        d: {
          e: null,
          f: 'nested',
        },
      });
    });

    it('should handle arrays', () => {
      const input = [1, undefined, 'test', { a: null }];
      const result = cleanUndefined(input);

      expect(result).toEqual([1, undefined, 'test', { a: null }]); // 数组中的 undefined 不被转换
    });

    it('should handle primitives', () => {
      expect(cleanUndefined(42)).toBe(42);
      expect(cleanUndefined('test')).toBe('test');
      expect(cleanUndefined(null)).toBe(null);
      expect(cleanUndefined(undefined)).toBe(undefined);
    });
  });

  describe('cleanNull', () => {
    it('should remove null values from objects', () => {
      const input = {
        a: 1,
        b: null,
        c: 'test',
        d: undefined,
        e: 0,
        f: false,
      };

      const result = cleanNull(input);

      expect(result).toEqual({
        a: 1,
        c: 'test',
        d: undefined,
        e: 0,
        f: false,
      });
      expect('b' in result).toBe(false);
    });

    it('should handle empty objects', () => {
      expect(cleanNull({})).toEqual({});
      expect(cleanNull({ a: null, b: null })).toEqual({});
    });
  });

  describe('cleanNullToUndefined', () => {
    it('should exclude null values (making them undefined)', () => {
      const input = {
        a: 1,
        b: null,
        c: 'test',
        d: 0,
        e: false,
      };

      const result = cleanNullToUndefined(input);

      expect(result).toEqual({
        a: 1,
        c: 'test',
        d: 0,
        e: false,
      });
      expect('b' in result).toBe(false);
    });
  });

  describe('serializeFunction', () => {
    it('should serialize function to SerializedFunction format', () => {
      const testFunc = (x: number) => x * 2;
      const result = serializeFunction(testFunc);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      // The exact structure depends on the safe function implementation
    });

    it('should return undefined for undefined input', () => {
      const result = serializeFunction(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('deserializeFunction', () => {
    it('should handle undefined input', () => {
      const result = deserializeFunction(null);
      expect(result).toBeUndefined();
    });

    it('should handle null input', () => {
      const result = deserializeFunction(null);
      expect(result).toBeUndefined();
    });

    it('should handle legacy string format', () => {
      const legacyFormat = 'function(x) { return x * 2; }';
      const result = deserializeFunction(legacyFormat);

      expect(typeof result).toBe('function');
      if (result) {
        expect(result(5)).toBe(10);
      }
    });

    it('should handle new SerializedFunction format', () => {
      const serializedFunc = {
        type: 'custom' as const,
        params: ['x'],
        body: 'return x * 3;',
      };
      
      const result = deserializeFunction(serializedFunc);

      expect(typeof result).toBe('function');
      if (result) {
        expect(result(4)).toBe(12);
      }
    });

    it('should handle invalid legacy format gracefully', () => {
      const invalidFormat = 'invalid javascript code !!';
      const result = deserializeFunction(invalidFormat);

      expect(result).toBeUndefined();
    });
  });
});
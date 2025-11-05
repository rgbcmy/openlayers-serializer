/**
 * 错误处理机制的单元测试
 */

import { describe, it, expect, vi } from 'vitest';
import {
  SerializationError,
  DeserializationError,
  ValidationError,
  ErrorHandler,
  DEFAULT_RECOVERY_OPTIONS,
  globalErrorHandler,
  safeSerialize,
  safeDeserialize,
} from '../src/common/error-handling';

describe('Error Handling', () => {
  describe('Custom Error Classes', () => {
    it('should create SerializationError correctly', () => {
      const error = new SerializationError(
        'Test error',
        'TEST_CODE',
        { test: 'context' },
        ['suggestion1', 'suggestion2']
      );

      expect(error.name).toBe('SerializationError');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.context).toEqual({ test: 'context' });
      expect(error.suggestions).toEqual(['suggestion1', 'suggestion2']);
    });

    it('should create DeserializationError with defaults', () => {
      const error = new DeserializationError('Test error');

      expect(error.name).toBe('DeserializationError');
      expect(error.code).toBe('DESERIALIZATION_ERROR');
      expect(error.context).toBeUndefined();
      expect(error.suggestions).toBeUndefined();
    });

    it('should create ValidationError correctly', () => {
      const validationErrors = [{ path: 'test', message: 'invalid' }];
      const error = new ValidationError(
        'Validation failed',
        'VALIDATION_ERROR',
        { data: 'test' },
        validationErrors
      );

      expect(error.name).toBe('ValidationError');
      expect(error.validationErrors).toBe(validationErrors);
    });
  });

  describe('ErrorHandler', () => {
    it('should use default options when none provided', () => {
      const handler = new ErrorHandler();
      expect(handler['options']).toEqual(DEFAULT_RECOVERY_OPTIONS);
    });

    it('should merge custom options with defaults', () => {
      const customOptions = { skipInvalidLayers: false };
      const handler = new ErrorHandler(customOptions);
      
      expect(handler['options']).toEqual({
        ...DEFAULT_RECOVERY_OPTIONS,
        ...customOptions,
      });
    });

    describe('safeExecute', () => {
      it('should return result when operation succeeds', () => {
        const handler = new ErrorHandler();
        const operation = vi.fn(() => 'success');
        
        const result = handler.safeExecute(operation, 'fallback');
        
        expect(result).toBe('success');
        expect(operation).toHaveBeenCalledOnce();
      });

      it('should return fallback when operation fails', () => {
        const handler = new ErrorHandler({ logWarnings: false });
        const operation = vi.fn(() => {
          throw new Error('Test error');
        });
        
        const result = handler.safeExecute(operation, 'fallback', 'test context');
        
        expect(result).toBe('fallback');
        expect(operation).toHaveBeenCalledOnce();
      });

      it('should log warnings when enabled', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const handler = new ErrorHandler({ logWarnings: true });
        const operation = () => {
          throw new Error('Test error');
        };
        
        handler.safeExecute(operation, 'fallback', 'test context');
        
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error in test context:',
          expect.any(Error)
        );
        
        consoleSpy.mockRestore();
      });

      it('should throw critical errors when enabled', () => {
        const handler = new ErrorHandler({ throwOnCriticalErrors: true });
        const criticalError = new TypeError('Critical error');
        const operation = () => {
          throw criticalError;
        };
        
        expect(() => {
          handler.safeExecute(operation, 'fallback');
        }).toThrow(criticalError);
      });
    });

    describe('safeExecuteAsync', () => {
      it('should handle async operations', async () => {
        const handler = new ErrorHandler();
        const operation = vi.fn(async () => 'async success');
        
        const result = await handler.safeExecuteAsync(operation, 'fallback');
        
        expect(result).toBe('async success');
        expect(operation).toHaveBeenCalledOnce();
      });

      it('should return fallback for failed async operations', async () => {
        const handler = new ErrorHandler({ logWarnings: false });
        const operation = vi.fn(async () => {
          throw new Error('Async error');
        });
        
        const result = await handler.safeExecuteAsync(operation, 'fallback');
        
        expect(result).toBe('fallback');
      });
    });

    describe('validateAndFixMapData', () => {
      it('should throw error for invalid input', () => {
        const handler = new ErrorHandler();
        
        expect(() => {
          handler.validateAndFixMapData(null);
        }).toThrow(ValidationError);
        
        expect(() => {
          handler.validateAndFixMapData('invalid');
        }).toThrow(ValidationError);
      });

      it('should fix missing required fields', () => {
        const handler = new ErrorHandler();
        const invalidData = {
          view: { center: [0, 0], zoom: 2 },
        };
        
        const { data, warnings } = handler.validateAndFixMapData(invalidData);
        
        expect(data.id).toBeDefined();
        expect(data.name).toBe('Untitled Map');
        expect(data.target).toBe('mapContainer');
        expect(Array.isArray(data.layers)).toBe(true);
        expect(warnings.length).toBeGreaterThan(0);
      });

      it('should filter invalid layers when enabled', () => {
        const handler = new ErrorHandler({ skipInvalidLayers: true });
        const dataWithInvalidLayers = {
          id: 'test',
          name: 'test',
          target: 'container',
          view: { center: [0, 0], zoom: 2 },
          layers: [
            { type: 'Tile', source: { type: 'OSM' } }, // valid
            { type: 'Invalid' }, // invalid - no source
            null, // invalid - null
            { source: { type: 'XYZ' } }, // invalid - no type
          ],
        };
        
        const { data, warnings } = handler.validateAndFixMapData(dataWithInvalidLayers);
        
        expect(data.layers).toHaveLength(1);
        expect(warnings.some(w => w.includes('Removed'))).toBe(true);
      });

      it('should throw error for missing view', () => {
        const handler = new ErrorHandler();
        const dataWithoutView = {
          id: 'test',
          name: 'test',
          target: 'container',
        };
        
        expect(() => {
          handler.validateAndFixMapData(dataWithoutView);
        }).toThrow(ValidationError);
      });
    });

    describe('validateAndFixViewData', () => {
      it('should fix invalid center', () => {
        const handler = new ErrorHandler();
        const invalidView = { zoom: 2 };
        
        const { data, warnings } = handler.validateAndFixViewData(invalidView);
        
        expect(data.center).toEqual([0, 0]);
        expect(warnings.some(w => w.includes('center'))).toBe(true);
      });

      it('should fix invalid zoom', () => {
        const handler = new ErrorHandler();
        const invalidView = { center: [0, 0], zoom: -5 };
        
        const { data, warnings } = handler.validateAndFixViewData(invalidView);
        
        expect(data.zoom).toBe(2);
        expect(warnings.some(w => w.includes('zoom'))).toBe(true);
      });

      it('should set default projection', () => {
        const handler = new ErrorHandler();
        const viewWithoutProjection = { center: [0, 0], zoom: 2 };
        
        const { data, warnings } = handler.validateAndFixViewData(viewWithoutProjection);
        
        expect(data.projection).toBe('EPSG:3857');
        expect(warnings.some(w => w.includes('projection'))).toBe(true);
      });
    });

    describe('validateAndFixLayerData', () => {
      it('should throw error for missing type', () => {
        const handler = new ErrorHandler();
        
        expect(() => {
          handler.validateAndFixLayerData({ source: {} });
        }).toThrow(ValidationError);
      });

      it('should throw error for missing source', () => {
        const handler = new ErrorHandler();
        
        expect(() => {
          handler.validateAndFixLayerData({ type: 'Tile' });
        }).toThrow(ValidationError);
      });

      it('should generate missing fields', () => {
        const handler = new ErrorHandler();
        const minimalLayer = { type: 'Tile', source: { type: 'OSM' } };
        
        const { data, warnings } = handler.validateAndFixLayerData(minimalLayer);
        
        expect(data.id).toBeDefined();
        expect(data.name).toBe('Tile Layer');
        expect(data.opacity).toBe(1);
        expect(data.visible).toBe(true);
        expect(warnings.length).toBeGreaterThan(0);
      });
    });

    describe('validateAndFixSourceData', () => {
      it('should throw error for missing type', () => {
        const handler = new ErrorHandler();
        
        expect(() => {
          handler.validateAndFixSourceData({});
        }).toThrow(ValidationError);
      });

      it('should generate missing fields', () => {
        const handler = new ErrorHandler();
        const minimalSource = { type: 'OSM' };
        
        const { data, warnings } = handler.validateAndFixSourceData(minimalSource);
        
        expect(data.id).toBeDefined();
        expect(data.name).toBe('OSM Source');
        expect(warnings.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Global utilities', () => {
    it('should provide global error handler instance', () => {
      expect(globalErrorHandler).toBeInstanceOf(ErrorHandler);
    });

    it('should provide safeSerialize utility', () => {
      const serializer = vi.fn(() => 'serialized');
      const result = safeSerialize(serializer, 'fallback', 'test');
      
      expect(result).toBe('serialized');
      expect(serializer).toHaveBeenCalledOnce();
    });

    it('should provide safeDeserialize utility', () => {
      const deserializer = vi.fn(() => ({ test: 'data' }));
      const result = safeDeserialize(deserializer, null, 'test');
      
      expect(result).toEqual({ test: 'data' });
      expect(deserializer).toHaveBeenCalledOnce();
    });

    it('should handle errors in safe utilities', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const failingSerializer = () => {
        throw new Error('Serialization failed');
      };
      
      const result = safeSerialize(failingSerializer, 'fallback');
      
      expect(result).toBe('fallback');
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});
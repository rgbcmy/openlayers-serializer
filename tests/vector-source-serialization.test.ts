import { describe, it, expect } from 'vitest';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import KML from 'ol/format/KML.js';
import { Feature } from 'ol';
import { Point, Polygon } from 'ol/geom';
import { serializeSource, deserializeSource } from '../src/serializer/source';
import { IVectorSource } from '../src/dto/source';

describe('VectorSource Serialization Strategy', () => {
  
  describe('URL-based VectorSource', () => {
    it('should serialize VectorSource with URL priority', () => {
      const source = new VectorSource({
        url: 'https://example.com/data.geojson',
        format: new GeoJSON()
      });
      source.set('id', 'test-vector');
      source.set('name', 'Test Vector');

      const serialized = serializeSource(source) as IVectorSource;
      
      expect(serialized.type).toBe('Vector');
      expect(serialized.url).toBe('https://example.com/data.geojson');
      expect(serialized.format).toBe('GeoJSON');
      expect(serialized.features).toBeUndefined(); // 没有features时不应该序列化
    });

    it('should serialize URL-based source with backup features when feature count is small', () => {
      const features = [
        new Feature({
          geometry: new Point([0, 0]),
          name: 'Test Point'
        })
      ];

      const source = new VectorSource({
        url: 'https://example.com/data.geojson',
        format: new GeoJSON(),
        features: features
      });
      source.set('id', 'test-vector');
      source.set('name', 'Test Vector');

      const serialized = serializeSource(source) as IVectorSource;
      
      expect(serialized.type).toBe('Vector');
      expect(serialized.url).toBe('https://example.com/data.geojson');
      expect(serialized.format).toBe('GeoJSON');
      expect(serialized.features).toBeDefined(); // 少量features应该作为备份保存
    });

    it('should not serialize features when URL-based source has too many features', () => {
      // 创建超过100个features
      const features = Array.from({ length: 150 }, (_, i) => 
        new Feature({
          geometry: new Point([i, i]),
          name: `Feature ${i}`
        })
      );

      const source = new VectorSource({
        url: 'https://example.com/data.geojson',
        format: new GeoJSON()
      });
      source.addFeatures(features);
      source.set('id', 'test-vector');
      source.set('name', 'Test Vector');

      const serialized = serializeSource(source) as IVectorSource;
      
      expect(serialized.type).toBe('Vector');
      expect(serialized.url).toBe('https://example.com/data.geojson');
      expect(serialized.features).toBeUndefined(); // 太多features，不保存备份
    });
  });

  describe('Features-based VectorSource', () => {
    it('should serialize VectorSource with features when no URL', () => {
      const features = [
        new Feature({
          geometry: new Point([0, 0]),
          name: 'Test Point'
        }),
        new Feature({
          geometry: new Polygon([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]),
          name: 'Test Polygon'
        })
      ];

      const source = new VectorSource({
        format: new GeoJSON(),
        features: features
      });
      source.set('id', 'test-vector');
      source.set('name', 'Test Vector');

      const serialized = serializeSource(source) as IVectorSource;
      
      expect(serialized.type).toBe('Vector');
      expect(serialized.url).toBeUndefined();
      expect(serialized.format).toBe('GeoJSON');
      expect(serialized.features).toBeDefined();
      expect((serialized.features as any).features).toHaveLength(2);
    });

    it('should handle different format types correctly', () => {
      const features = [
        new Feature({
          geometry: new Point([0, 0]),
          name: 'Test Point'
        })
      ];

      const source = new VectorSource({
        format: new KML(),
        features: features
      });
      source.set('id', 'test-vector');
      source.set('name', 'Test Vector');

      const serialized = serializeSource(source) as IVectorSource;
      
      expect(serialized.type).toBe('Vector');
      expect(serialized.format).toBe('KML');
      expect(serialized.features).toBeDefined();
    });

    it('should fallback to GeoJSON when format is not GeoJSON', () => {
      const features = [
        new Feature({
          geometry: new Point([0, 0]),
          name: 'Test Point'
        })
      ];

      const source = new VectorSource({
        format: new KML(), // 使用KML format
        features: features
      });
      source.set('id', 'test-vector');
      source.set('name', 'Test Vector');

      const serialized = serializeSource(source) as IVectorSource;
      
      expect(serialized.features).toBeDefined();
      // features应该使用GeoJSON格式序列化，即使原始format是KML
      expect((serialized.features as any).type).toBe('FeatureCollection');
    });
  });

  describe('Empty VectorSource', () => {
    it('should serialize empty VectorSource without URL or features', () => {
      const source = new VectorSource({
        format: new GeoJSON()
      });
      source.set('id', 'test-vector');
      source.set('name', 'Test Vector');

      const serialized = serializeSource(source) as IVectorSource;
      
      expect(serialized.type).toBe('Vector');
      expect(serialized.url).toBeUndefined();
      expect(serialized.features).toBeUndefined();
      expect(serialized.format).toBe('GeoJSON');
    });
  });

  describe('VectorSource Deserialization', () => {
    it('should deserialize URL-based VectorSource correctly', () => {
      const sourceDto: IVectorSource = {
        id: 'test-vector',
        name: 'Test Vector',
        type: 'Vector',
        url: 'https://example.com/data.geojson',
        format: 'GeoJSON',
        overlaps: true,
        strategy: 'all',
        useSpatialIndex: true,
        wrapX: true
      };

      const source = deserializeSource(sourceDto) as VectorSource;
      
      expect(source).toBeInstanceOf(VectorSource);
      expect(source.getUrl()).toBe('https://example.com/data.geojson');
      expect(source.getFormat()).toBeInstanceOf(GeoJSON);
      expect(source.getFeatures()).toHaveLength(0); // 新创建的source没有features
    });

    it('should deserialize features-based VectorSource correctly', () => {
      const geoJsonData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [0, 0]
            },
            properties: {
              name: 'Test Point'
            }
          }
        ]
      };

      const sourceDto: IVectorSource = {
        id: 'test-vector',
        name: 'Test Vector',
        type: 'Vector',
        features: geoJsonData as any,
        format: 'GeoJSON',
        overlaps: true,
        strategy: 'all',
        useSpatialIndex: true,
        wrapX: true
      };

      const source = deserializeSource(sourceDto) as VectorSource;
      
      expect(source).toBeInstanceOf(VectorSource);
      expect(source.getFeatures()).toHaveLength(1);
      expect(source.getFeatures()[0].get('name')).toBe('Test Point');
    });

    it('should deserialize VectorSource with both URL and features (backup scenario)', () => {
      const geoJsonData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [0, 0]
            },
            properties: {
              name: 'Backup Feature'
            }
          }
        ]
      };

      const sourceDto: IVectorSource = {
        id: 'test-vector',
        name: 'Test Vector',
        type: 'Vector',
        url: 'https://example.com/data.geojson',
        features: geoJsonData as any,
        format: 'GeoJSON',
        overlaps: true,
        strategy: 'all',
        useSpatialIndex: true,
        wrapX: true
      };

      const source = deserializeSource(sourceDto) as VectorSource;
      
      expect(source).toBeInstanceOf(VectorSource);
      expect(source.getUrl()).toBe('https://example.com/data.geojson');
      expect(source.getFeatures()).toHaveLength(1); // 应该加载备份的features
      expect(source.getFeatures()[0].get('name')).toBe('Backup Feature');
    });
  });

  describe('Round-trip Serialization', () => {
    it('should maintain data integrity through serialization round-trip', () => {
      const originalFeatures = [
        new Feature({
          geometry: new Point([1, 2]),
          name: 'Point Feature',
          id: 1
        }),
        new Feature({
          geometry: new Polygon([[[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]]),
          name: 'Polygon Feature',
          id: 2
        })
      ];

      const originalSource = new VectorSource({
        format: new GeoJSON(),
        features: originalFeatures
      });
      originalSource.set('id', 'test-vector');
      originalSource.set('name', 'Test Vector');

      // 序列化
      const serialized = serializeSource(originalSource) as IVectorSource;
      
      // 反序列化
      const deserializedSource = deserializeSource(serialized) as VectorSource;
      
      // 验证
      expect(deserializedSource.getFeatures()).toHaveLength(2);
      
      const deserializedFeatures = deserializedSource.getFeatures();
      expect(deserializedFeatures[0].get('name')).toBe('Point Feature');
      expect(deserializedFeatures[1].get('name')).toBe('Polygon Feature');
      
      // 检查几何类型
      expect(deserializedFeatures[0].getGeometry()).toBeInstanceOf(Point);
      expect(deserializedFeatures[1].getGeometry()).toBeInstanceOf(Polygon);
    });
  });
});
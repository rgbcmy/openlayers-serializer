// 快速测试新序列化器
import { serializeSource, deserializeSource, getSupportedSourceTypes } from './src/serializer/source-new.js';
import { serializeLayer, deserializeLayer, getSupportedLayerTypes } from './src/serializer/layer-new.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, XYZ, Vector as VectorSource } from 'ol/source.js';
import { Point } from 'ol/geom.js';
import { Feature } from 'ol';

console.log('🧪 开始快速测试新序列化器...\n');

// 测试支持的类型
console.log('📡 支持的Source类型:', getSupportedSourceTypes());
console.log('🗂️ 支持的Layer类型:', getSupportedLayerTypes());

// 测试Source序列化
console.log('\n🧪 测试Source序列化...');
try {
    const osmSource = new OSM();
    osmSource.set('id', 'test-osm');
    osmSource.set('name', 'Test OSM Source');
    
    console.log('原始Source ID:', osmSource.get('id'));
    
    const serialized = serializeSource(osmSource);
    console.log('序列化成功，类型:', serialized.type);
    
    const deserialized = deserializeSource(serialized);
    console.log('反序列化Source ID:', deserialized.get('id'));
    console.log('✅ Source测试通过');
} catch (error) {
    console.error('❌ Source测试失败:', error.message);
}

// 测试Layer序列化
console.log('\n🧪 测试Layer序列化...');
try {
    const tileLayer = new TileLayer({
        source: new OSM()
    });
    tileLayer.set('id', 'test-layer');
    tileLayer.set('name', 'Test Tile Layer');
    
    console.log('原始Layer ID:', tileLayer.get('id'));
    
    const serialized = serializeLayer(tileLayer);
    console.log('序列化成功，类型:', serialized.type);
    
    const deserialized = deserializeLayer(serialized);
    console.log('反序列化Layer ID:', deserialized.get('id'));
    console.log('✅ Layer测试通过');
} catch (error) {
    console.error('❌ Layer测试失败:', error.message);
}

console.log('\n🎉 测试完成！');
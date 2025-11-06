import type { Source } from 'ol/source.js';
import type { ISerializedSource } from '../dto/source.js';
import { serializerRegistry } from './base/ISerializer.js';

// 导入所有source序列化器 - 核心类型
import { OSMSourceSerializer } from './sources/OSMSourceSerializer.js';
import { XYZSourceSerializer } from './sources/XYZSourceSerializer.js';
import { BingMapsSourceSerializer } from './sources/BingMapsSourceSerializer.js';
import { TileDebugSourceSerializer } from './sources/TileDebugSourceSerializer.js';
import { StadiaMapsSourceSerializer } from './sources/StadiaMapsSourceSerializer.js';
import { TileWMSSourceSerializer } from './sources/TileWMSSourceSerializer.js';
import { VectorSourceSerializer } from './sources/VectorSourceSerializer.js';
import { ImageStaticSourceSerializer } from './sources/ImageStaticSourceSerializer.js';
import { IIIFSourceSerializer } from './sources/IIIFSourceSerializer.js';

// 导入所有source序列化器 - 高级类型
import { ClusterSourceSerializer } from './sources/ClusterSourceSerializer.js';
import { GeoTIFFSourceSerializer } from './sources/GeoTIFFSourceSerializer.js';
import { VectorTileSourceSerializer } from './sources/VectorTileSourceSerializer.js';
import { WMTSSourceSerializer } from './sources/WMTSSourceSerializer.js';
import { UTFGridSourceSerializer } from './sources/UTFGridSourceSerializer.js';

// 导入所有source序列化器 - 额外类型 (新增7个)
import { TileJSONSourceSerializer } from './sources/TileJSONSourceSerializer.js';
import { ZoomifySourceSerializer } from './sources/ZoomifySourceSerializer.js';
import { OGCMapTileSourceSerializer } from './sources/OGCMapTileSourceSerializer.js';
import { ImageArcGISRestSourceSerializer } from './sources/ImageArcGISRestSourceSerializer.js';
import { ImageWMSSourceSerializer } from './sources/ImageWMSSourceSerializer.js';
import { OGCVectorTileSourceSerializer } from './sources/OGCVectorTileSourceSerializer.js';
import { TileArcGISRestSourceSerializer } from './sources/TileArcGISRestSourceSerializer.js';

/**
 * 初始化并注册所有source序列化器
 */
function initializeSourceSerializers() {
    // 注册核心source序列化器
    serializerRegistry.registerSourceSerializer(new OSMSourceSerializer());
    serializerRegistry.registerSourceSerializer(new XYZSourceSerializer());
    serializerRegistry.registerSourceSerializer(new BingMapsSourceSerializer());
    serializerRegistry.registerSourceSerializer(new TileDebugSourceSerializer());
    serializerRegistry.registerSourceSerializer(new StadiaMapsSourceSerializer());
    serializerRegistry.registerSourceSerializer(new TileWMSSourceSerializer());
    serializerRegistry.registerSourceSerializer(new VectorSourceSerializer());
    serializerRegistry.registerSourceSerializer(new ImageStaticSourceSerializer());
    serializerRegistry.registerSourceSerializer(new IIIFSourceSerializer());

    // 注册高级source序列化器
    serializerRegistry.registerSourceSerializer(new ClusterSourceSerializer());
    serializerRegistry.registerSourceSerializer(new GeoTIFFSourceSerializer());
    serializerRegistry.registerSourceSerializer(new VectorTileSourceSerializer());
    serializerRegistry.registerSourceSerializer(new WMTSSourceSerializer());
    serializerRegistry.registerSourceSerializer(new UTFGridSourceSerializer());

    // 注册额外source序列化器 (新增7个)
    serializerRegistry.registerSourceSerializer(new TileJSONSourceSerializer());
    serializerRegistry.registerSourceSerializer(new ZoomifySourceSerializer());
    serializerRegistry.registerSourceSerializer(new OGCMapTileSourceSerializer());
    serializerRegistry.registerSourceSerializer(new ImageArcGISRestSourceSerializer());
    serializerRegistry.registerSourceSerializer(new ImageWMSSourceSerializer());
    serializerRegistry.registerSourceSerializer(new OGCVectorTileSourceSerializer());
    serializerRegistry.registerSourceSerializer(new TileArcGISRestSourceSerializer());

    console.log('✅ Registered 21 source serializers:', serializerRegistry.getRegisteredSourceTypes());
}

// 自动初始化
initializeSourceSerializers();

/**
 * 序列化source（重构后的版本）
 */
export function serializeSource(source: Source): ISerializedSource {
    debugger;
    const serializer = serializerRegistry.getSourceSerializer(source);

    if (!serializer) {
        throw new Error(`Unsupported source type: ${source.constructor.name}`);
    }

    return serializer.serialize(source);
}

/**
 * 反序列化source（重构后的版本）
 */
export function deserializeSource(data: ISerializedSource): Source {
    const serializer = serializerRegistry.getSourceSerializerByType(data.type);

    if (!serializer) {
        throw new Error(`Unsupported source type: ${data.type}`);
    }

    return serializer.deserialize(data);
}

/**
 * 获取所有支持的source类型
 */
export function getSupportedSourceTypes(): string[] {
    return serializerRegistry.getRegisteredSourceTypes();
}
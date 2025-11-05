import { Map } from 'ol';
import type { IMap } from '../dto/map';
import { deserializeView, serializeView } from './view';
import { deserializeLayer, serializeMapLayers } from './layer';
import { validateMapData, safeValidateMapData } from '../common/validation';
import { ErrorHandler, DeserializationError, safeDeserialize } from '../common/error-handling';
export function serializeMap(map: Map) {
    debugger
    const layers = serializeMapLayers(map);
    let viewDto = serializeView(map.getView());
    let mapName=map.get('name')??'Untitled';
    let mapDto: IMap = {
        id:map.get('id') || crypto.randomUUID(),
        name:mapName,
        controls: [],
        interactions: [],
        layers: layers,
        maxTilesLoading: (map as any)['maxTilesLoading_'],
        moveTolerance: (map as any)['moveTolerance_'],
        overlays: [],
        target: map.getTarget() as string,
        view: viewDto
    }
    return mapDto
}

export function deserializeMap(mapDto: IMap): Map {
    const errorHandler = new ErrorHandler();
    
    // 验证并修复地图数据
    const { data: fixedMapDto, warnings } = errorHandler.validateAndFixMapData(mapDto);
    
    if (warnings.length > 0) {
        console.warn('Map data issues detected and fixed:', warnings);
    }

    // 安全反序列化图层
    const layers = fixedMapDto.layers.map((layerDto: any, index: number) => {
        return safeDeserialize(
            () => deserializeLayer(layerDto),
            null, // 如果失败返回 null，稍后过滤掉
            `layer ${index} (${layerDto.type || 'unknown'})`
        );
    }).filter(Boolean); // 过滤掉失败的图层

    // 安全反序列化视图
    const view = safeDeserialize(
        () => deserializeView(fixedMapDto.view),
        null,
        'map view'
    );

    if (!view) {
        throw new DeserializationError(
            'Failed to deserialize map view',
            'CRITICAL_VIEW_ERROR',
            fixedMapDto.view
        );
    }

    try {
        const map = new Map({
            target: fixedMapDto.target,
            view: view,
            layers: layers,
            controls: fixedMapDto.controls || [],
            interactions: undefined, // TODO: 实现 interactions 反序列化
            overlays: fixedMapDto.overlays || [],
            maxTilesLoading: fixedMapDto.maxTilesLoading,
            moveTolerance: fixedMapDto.moveTolerance
        });

        map.set('name', fixedMapDto.name ?? "Untitled");
        map.set('id', fixedMapDto.id ?? crypto.randomUUID());
        
        return map;
    } catch (error) {
        throw new DeserializationError(
            'Failed to create OpenLayers Map instance',
            'MAP_CREATION_ERROR',
            fixedMapDto,
            ['Check that all required OpenLayers dependencies are loaded', 'Verify the target element exists in the DOM']
        );
    }
}
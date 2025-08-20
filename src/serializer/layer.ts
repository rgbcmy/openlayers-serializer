import Map from "ol/Map";
import type BaseLayer from "ol/layer/Base";
import type { IBaseLayer, IGroupLayer, IImageLayer, ISerializedLayer, ITileLayer, IVectorLayer } from "../dto";
import LayerGroup from "ol/layer/Group";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { deserializeLayerStyle, deserializeStyle, serializeLayerStyle, serializeStyle } from "./style";
import { deserializeSource, serializeSource } from "./source";
import type { IVectorSource } from "../dto/source";
import ImageLayer from "ol/layer/Image";


export function serializeLayer(layer: BaseLayer): IBaseLayer {
    const layerDto: IBaseLayer = {
        type: "",
        id: layer.get('id') ||crypto.randomUUID(),
        name: layer.get('name') || 'Untitled',
        className: layer.getClassName() ?? "ol-layer",
        opacity: layer.getOpacity() ?? 1,
        visible: layer.getVisible() ?? true,
        extent: (layer.getExtent() as [number, number, number, number]) ?? null,
        minResolution: layer.getMinResolution() ?? null,
        maxResolution: layer.getMaxResolution() ?? null,
        minZoom: layer.getMinZoom() ?? null,
        maxZoom: layer.getMaxZoom() ?? null,
        zIndex: layer.getZIndex() ?? null,
        background: (layer.getBackground() as string) ?? null,
        properties: getSerializableLayerProps(layer) || null,
    };

    const name = layer.get('name');
    if (name) layerDto.name = name;

    if (layer instanceof LayerGroup) {
        layerDto.type = 'Group';
        (layerDto as IGroupLayer).layers = layer.getLayers().getArray().map(serializeLayer);
    } else {
        if (layer instanceof TileLayer) {
            layerDto as ITileLayer;
            layerDto.type = 'Tile';
            (layerDto as ITileLayer).useInterimTilesOnError = layer.getUseInterimTilesOnError() ?? null;
            (layerDto as ITileLayer).preload = layer.getPreload() ?? null
            let sourceDto = serializeSource(layer.getSource() as any);
            (layerDto as ITileLayer).source = (sourceDto as any);
        } else if (layer instanceof VectorLayer) {
            layerDto.type = 'Vector';
            (layerDto as IVectorLayer).renderBuffer = layer.getRenderBuffer() ?? 100;
            (layerDto as IVectorLayer).declutter = layer.getDeclutter() ?? false;
            (layerDto as IVectorLayer).updateWhileAnimating = layer.getUpdateWhileAnimating() ?? false;
            (layerDto as IVectorLayer).updateWhileInteracting = layer.getUpdateWhileInteracting() ?? false;
            let sourceDto = serializeSource(layer.getSource() as any);
            (layerDto as IVectorLayer).source = sourceDto as IVectorSource;
            let styleDto = serializeLayerStyle(layer.getStyle() as any);
            (layerDto as IVectorLayer).style = (styleDto as any);

        }
        else if (layer instanceof ImageLayer) {
            layerDto.type = 'Image';
            let sourceDto = serializeSource(layer.getSource() as any);
            (layerDto as IImageLayer).source = sourceDto as any;
        }

        //todo other layer
        // const source: any = (layer as any).getSource?.();
        // if (source) {
        //     layerDto.source = {
        //         type: source.constructor.name,
        //         url: source.getUrls?.() ?? source.getUrl?.(),
        //         params: source.getParams?.()
        //     };
        // }
    }

    return layerDto;
}
export function deserializeLayer(layerDto: IBaseLayer): BaseLayer {
    let layer: BaseLayer;
    if (layerDto.type === 'Group') {
        layer = new LayerGroup({
            layers: (layerDto as IGroupLayer).layers.map(deserializeLayer)
        });
    } else if (layerDto.type === 'Tile') {
        let source = (layerDto as ITileLayer).source ? deserializeSource((layerDto as ITileLayer).source) : undefined

        layer = new TileLayer({
            className: layerDto.className ?? 'ol-layer',
            opacity: layerDto.opacity ?? 1,
            visible: layerDto.visible ?? true,
            extent: layerDto.extent ?? undefined,
            zIndex: layerDto.zIndex ?? undefined,
            minResolution: layerDto.minResolution ?? undefined,
            maxResolution: layerDto.maxResolution ?? undefined,
            minZoom: layerDto.minZoom ?? undefined,
            maxZoom: layerDto.maxZoom ?? undefined,
            preload: (layerDto as ITileLayer).preload ?? 0,
            source: source,
            useInterimTilesOnError: (layerDto as ITileLayer).useInterimTilesOnError ?? true,
            properties: layerDto.properties || {},

        });
    } else if (layerDto.type === 'Vector') {
        layer = new VectorLayer({
            className: layerDto.className ?? 'ol-layer',
            opacity: layerDto.opacity ?? 1,
            visible: layerDto.visible ?? true,
            extent: layerDto.extent ?? undefined,
            zIndex: layerDto.zIndex ?? undefined,
            minResolution: layerDto.minResolution ?? undefined,
            maxResolution: layerDto.maxResolution ?? undefined,
            minZoom: layerDto.minZoom ?? undefined,
            maxZoom: layerDto.maxZoom ?? undefined,
            renderOrder: eval(`(${(layerDto as IVectorLayer).renderOrder})`) ?? undefined,
            renderBuffer: (layerDto as IVectorLayer).renderBuffer ?? 100,
            source: (layerDto as IVectorLayer).source ? deserializeSource((layerDto as IVectorLayer).source) : undefined,
            style: deserializeLayerStyle((layerDto as IVectorLayer).style),
            declutter: (layerDto as IVectorLayer).declutter ?? false,
            background: layerDto.background ?? undefined,
            updateWhileAnimating: (layerDto as IVectorLayer).updateWhileAnimating ?? false,
            updateWhileInteracting: (layerDto as IVectorLayer).updateWhileInteracting ?? false,
            properties: layerDto.properties || {},
        });
    } else if (layerDto.type === 'Image') {
        let source = (layerDto as IImageLayer).source ? deserializeSource((layerDto as IImageLayer).source) : undefined

        layer = new ImageLayer({
            className: layerDto.className ?? 'ol-layer',
            opacity: layerDto.opacity ?? 1,
            visible: layerDto.visible ?? true,
            extent: layerDto.extent ?? undefined,
            zIndex: layerDto.zIndex ?? undefined,
            minResolution: layerDto.minResolution ?? undefined,
            maxResolution: layerDto.maxResolution ?? undefined,
            minZoom: layerDto.minZoom ?? undefined,
            maxZoom: layerDto.maxZoom ?? undefined,
            source: source,
            properties: layerDto.properties || {},

        });
    }
    else {
        throw new Error(`Unsupported layer type: ${layerDto.type}`);
    }
    layer.set('id',layerDto.id??crypto.randomUUID());
    layer.set('name',layerDto.name??"Untitled")
    return layer;
}

export function serializeMapLayers(map: Map): IBaseLayer[] {
    return map.getLayers().getArray().map(serializeLayer);
}

/**
 * 提取可序列化的 layer 属性
 * @param {ol.layer.Base} layer - OpenLayers 图层
 * @param {string[]} excludeKeys - 需要排除的属性 key
 * @returns {Object} 可安全 JSON.stringify 的属性对象
 */
export function getSerializableLayerProps(layer: BaseLayer, excludeKeys = []) {
    const props = layer.getProperties();
    const cleanProps: Record<string, any> = {};

    // 默认要排除的字段
    const defaultExcludes = ["map", "source"];
    const excludes = new Set([...defaultExcludes, ...excludeKeys]);

    Object.keys(props).forEach(key => {
        const value = props[key];
        // 跳过在排除列表中的字段，或者函数
        if (excludes.has(key)) {
            return;
        }
        cleanProps[key] = value;
    });

    return cleanProps;
}
import Map from "ol/Map.js";
import type BaseLayer from "ol/layer/Base.js";
import type { IBaseLayer, IGroupLayer, IHeatmap, IImageLayer, ISerializedLayer, ITileLayer, IVectorLayer, IVectorTileLayer, IWebGLTileLayer } from "../dto";
import LayerGroup from "ol/layer/Group.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import { deserializeLayerStyle, deserializeStyle, serializeLayerStyle, serializeStyle } from "./style";
import { deserializeSource, serializeSource } from "./source";
import type { IVectorSource, IVectorTile } from "../dto/source";
import ImageLayer from "ol/layer/Image.js";
import WebGLTileLayer from 'ol/layer/WebGLTile.js';
import VectorTileLayer from "ol/layer/VectorTile.js";
import HeatmapLayer from "ol/layer/Heatmap.js";
import Style from "ol/style/Style.js";
import CircleStyle from "ol/style/Circle.js";
import Stroke from "ol/style/Stroke.js";
import Fill from "ol/style/Fill.js";
import TextStyle from "ol/style/Text.js";
import { injectFunction, registerItem } from "../common/registry";
registerItem('Style', Style);
registerItem('CircleStyle', CircleStyle);
registerItem('Stroke', Stroke);
registerItem('Fill', Fill);
registerItem('TextStyle', TextStyle);

const styleCache: Record<string, any> = {};
registerItem('styleCache', styleCache);


export function serializeLayer(layer: BaseLayer): IBaseLayer {
    const layerDto: IBaseLayer = {
        type: "",
        id: layer.get('id') || crypto.randomUUID(),
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
        } else if (layer instanceof WebGLTileLayer) {
            //todo
            layerDto.type = 'WebGLTile';
            (layerDto as IWebGLTileLayer).style = layer['style_'];
            (layerDto as IWebGLTileLayer).preload = layer.getPreload() ?? 0,
                (layerDto as IWebGLTileLayer).source = serializeSource(layer.getSource() as any) as any;
            //todo sources好像还可以是function
            (layerDto as IWebGLTileLayer).sources = layer['sources_'];
            (layerDto as IWebGLTileLayer).useInterimTilesOnError = layer.getUseInterimTilesOnError() ?? true;
            (layerDto as IWebGLTileLayer).cacheSize = null

        } else if (layer instanceof VectorTileLayer) {
            layerDto.type = 'VectorTile';
            let sourceDto = serializeSource(layer.getSource() as any);
            //todo
            (layerDto as IVectorTileLayer).renderOrder = undefined;
            (layerDto as IVectorTileLayer).renderBuffer = layer.getRenderBuffer() ?? 100;
            (layerDto as IVectorTileLayer).renderMode = (layer.getRenderMode() as any) ?? 'hybrid';
            
            (layerDto as IVectorTileLayer).source = sourceDto as IVectorTile;
            (layerDto as IVectorTileLayer).declutter = layer.getDeclutter() ?? false;
            //todo
            let styleDto = serializeLayerStyle(layer.getStyle() as any);
            (layerDto as IVectorTileLayer).style = styleDto as any;
            (layerDto as IVectorTileLayer).updateWhileAnimating = layer.getUpdateWhileAnimating() ?? false;
            (layerDto as IVectorTileLayer).updateWhileInteracting = layer.getUpdateWhileInteracting() ?? false;
            (layerDto as IVectorTileLayer).preload = layer.getPreload() ?? 0;
            (layerDto as IVectorTileLayer).useInterimTilesOnError = layer.getUseInterimTilesOnError() ?? true;
        } else if (layer instanceof HeatmapLayer) {
            layerDto.type = 'Heatmap';
            let sourceDto = serializeSource(layer.getSource() as any);
            (layerDto as IHeatmap).gradient = layer.getGradient() ?? ['#00f', '#0ff', '#0f0', '#ff0', '#f00'];
            (layerDto as IHeatmap).gradient = layer.getGradient() ?? 8;
            (layerDto as IHeatmap).radius = layer.getRadius() ?? 8;
            (layerDto as IHeatmap).blur = layer.getBlur() ?? 15;
            (layerDto as IHeatmap).radius = layer.getRadius() ?? 8;
            //todo openlayers没有存储weight
            (layerDto as IHeatmap).weight = layer.get('weight').toString() ?? 'weight';
            (layerDto as IHeatmap).source = sourceDto as IVectorSource;
        }

        else {
            throw new Error(`Unsupported layer type: ${layer.constructor.name}`);

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
        const styleCache: Record<string, any> = {};
        let style=deserializeLayerStyle((layerDto as IVectorLayer).style)
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
            style: style,
            // function (feature: FeatureLike) {
                
            //     const size = feature.get('features').length;
            //     let style: StyleLike | FlatStyleLike | undefined = styleCache[size];
            //     if (!style) {
            //         style = new Style({
            //             image: new CircleStyle({
            //                 radius: 15,
            //                 stroke: new Stroke({ color: '#fff' }),
            //                 fill: new Fill({ color: size > 1 ? '#3399CC' : '#66CC66' })
            //             }),
            //             text: new TextStyle({
            //                 text: size.toString(),
            //                 fill: new Fill({ color: '#fff' })
            //             })
            //         });
            //         styleCache[size] = style;
            //     }
            //     return style as any;
            // },// deserializeLayerStyle((layerDto as IVectorLayer).style),
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
    } else if (layerDto.type === 'VectorTile') {
        //todo
        let source = (layerDto as IVectorTileLayer).source ? deserializeSource((layerDto as IVectorTileLayer).source as any) : undefined
        
        console.log((layerDto as IVectorTileLayer).style);
        let style = (deserializeLayerStyle((layerDto as IVectorTileLayer).style) as any) ?? undefined;
        layer = new VectorTileLayer({
            className: layerDto.className ?? 'ol-layer',
            opacity: layerDto.opacity ?? 1,
            visible: layerDto.visible ?? true,
            extent: layerDto.extent ?? undefined,
            zIndex: layerDto.zIndex ?? undefined,
            minResolution: layerDto.minResolution ?? undefined,
            maxResolution: layerDto.maxResolution ?? undefined,
            minZoom: layerDto.minZoom ?? undefined,
            maxZoom: layerDto.maxZoom ?? undefined,
            //todo
            renderOrder: undefined, //eval(`(${(layerDto as IVectorTileLayer).renderOrder})`) ?? undefined,
            renderBuffer: (layerDto as IVectorTileLayer).renderBuffer ?? 100,
            renderMode: (layerDto as IVectorTileLayer).renderMode as any,
            source: source,
            //todo 需要验证 
            style: style,
            declutter: (layerDto as IVectorTileLayer).declutter ?? false,
            background: layerDto.background ?? undefined,
            updateWhileAnimating: (layerDto as IVectorTileLayer).updateWhileAnimating ?? false,
            updateWhileInteracting: (layerDto as IVectorTileLayer).updateWhileInteracting ?? false,
            preload: (layerDto as IVectorTileLayer).preload ?? 0,
            useInterimTilesOnError: (layerDto as IVectorTileLayer).useInterimTilesOnError ?? true,
            properties: layerDto.properties || {},

        });
    } else if (layerDto.type === 'WebGLTile') {
        let webGLTileLayerDto = layerDto as IWebGLTileLayer
        let source = (layerDto as IWebGLTileLayer).source ? deserializeSource((layerDto as IWebGLTileLayer).source) : undefined
        let sources = (layerDto as IWebGLTileLayer).sources ? (layerDto as IWebGLTileLayer).sources?.map((item) => deserializeSource((item))) : undefined
        layer = new WebGLTileLayer({
            style: (webGLTileLayerDto.style as any) ?? undefined,
            className: webGLTileLayerDto.className ?? 'ol-layer',
            opacity: layerDto.opacity ?? 1,
            visible: layerDto.visible ?? true,
            extent: layerDto.extent ?? undefined,
            zIndex: layerDto.zIndex ?? undefined,
            minResolution: layerDto.minResolution ?? undefined,
            maxResolution: layerDto.maxResolution ?? undefined,
            minZoom: layerDto.minZoom ?? undefined,
            maxZoom: layerDto.maxZoom ?? undefined,
            preload: (layerDto as IWebGLTileLayer).preload ?? 0,
            source: source,
            sources: sources,
            useInterimTilesOnError: (layerDto as IWebGLTileLayer).useInterimTilesOnError ?? true,
            cacheSize: undefined,
            properties: layerDto.properties || {},
        });
    } else if (layerDto.type === 'Heatmap') {
        //todo
        let heatmapDto = layerDto as IHeatmap;
        let source = heatmapDto.source ? deserializeSource(heatmapDto.source) : undefined
        
        let weight = layerDto.weight ?? 'weight';
        if (isFunctionString(heatmapDto.weight!)) {
            weight = injectFunction(weight);
        }
        layer = new HeatmapLayer({
            className: layerDto.className ?? 'ol-layer',
            opacity: layerDto.opacity ?? 1,
            visible: layerDto.visible ?? true,
            extent: layerDto.extent ?? undefined,
            zIndex: layerDto.zIndex ?? undefined,
            minResolution: layerDto.minResolution ?? undefined,
            maxResolution: layerDto.maxResolution ?? undefined,
            minZoom: layerDto.minZoom ?? undefined,
            maxZoom: layerDto.maxZoom ?? undefined,
            gradient: heatmapDto.gradient ?? ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
            radius: heatmapDto.radius ?? 8,
            blur: heatmapDto.blur ?? 15,
            //TODO weight可能为函数
            weight: weight,
            source: source,
            properties: layerDto.properties || {},
        })
    }
    else {
        throw new Error(`Unsupported layer type: ${layerDto.type}`);
    }
    layer.set('id', layerDto.id ?? crypto.randomUUID());
    layer.set('name', layerDto.name ?? "Untitled")
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
/**
 * 
 * @param str 判断字符串是否为函数
 * @returns 
 */
export function isFunctionString(str: string): boolean {
    if (typeof str !== 'string') return false;

    // 普通函数 / 异步函数 / 生成器函数
    const funcPattern = /^\s*(async\s*)?function(\*)?\s*\w*\s*\([^)]*\)\s*\{[\s\S]*\}\s*$/;

    // 箭头函数 / 异步箭头函数
    const arrowPattern = /^\s*(async\s*)?(\([^)]*\)|[a-zA-Z_$][\w$]*)\s*=>\s*([\s\S]+)$/;

    return funcPattern.test(str) || arrowPattern.test(str);
}
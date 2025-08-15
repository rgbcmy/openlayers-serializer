import Map from "ol/Map";
import type BaseLayer from "ol/layer/Base";
import type { IBaseLayer, IGroupLayer, ISerializedLayer, ITileLayer, IVectorLayer } from "../dto";
import LayerGroup from "ol/layer/Group";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { serializeLayerStyle, serializeStyle } from "./style";
import { serializeSource } from "./source";
import type { IVectorSource } from "../dto/source";

function serializeLayer(layer: BaseLayer): IBaseLayer {
    const layerDto: IBaseLayer = {
        type: "",
        id: layer.get('id') || '',
        name: layer.get('name') || '',
        className: layer.getClassName() || null,
        opacity: layer.getOpacity() ?? null,
        visible: layer.getVisible() ?? null,
        extent: (layer.getExtent() as [number, number, number, number]) ?? null,
        minResolution: layer.getMinResolution() ?? null,
        maxResolution: layer.getMaxResolution() ?? null,
        minZoom: layer.getMinZoom() ?? null,
        maxZoom: layer.getMaxZoom() ?? null,
        zIndex: layer.getZIndex() ?? null,
        background: (layer.getBackground() as string) ?? null,
        properties: layer.getProperties() || null,
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
            let styleDto = serializeLayerStyle(layer.getStyle() as any);
            (layerDto as IVectorLayer).style =(styleDto as any);

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

export function serializeMapLayers(map: Map): IBaseLayer[] {
    return map.getLayers().getArray().map(serializeLayer);
}
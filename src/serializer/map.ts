import { Map } from 'ol';
import type Layer from 'ol/layer/Layer';
import type { IMap } from '../dto/map';
import { deserializeView, serializeView } from './view';
import {serializeSource} from './source';
import { deserializeLayer, serializeMapLayers } from './layer';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
export function serializeMap(map: Map) {
    const layers = serializeMapLayers(map);
    let viewDto = serializeView(map.getView());
    debugger
    let mapDto: IMap = {
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
    let layers= mapDto.layers.map(layer => deserializeLayer(layer))
    let view=deserializeView(mapDto.view)
    const map = new Map({
        target: mapDto.target,
        view: view,
        layers:layers,
        controls: mapDto.controls || [],
        //TODO interactions 交互设置
        interactions: undefined,// mapDto.interactions || undefined,
        overlays: mapDto.overlays || [],
        maxTilesLoading: mapDto.maxTilesLoading,
        moveTolerance: mapDto.moveTolerance
    });
    return map;
}
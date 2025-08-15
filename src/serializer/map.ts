import { Map } from 'ol';
import type Layer from 'ol/layer/Layer';
import type { IMap } from '../dto/map';
import { serializeView } from './view';
import {serializeSource} from './source';
import { serializeMapLayers } from './layer';
export function serializeMap(map: Map) {
    const layers = serializeMapLayers(map);
    let viewDto = serializeView(map.getView());
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
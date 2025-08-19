import { Map, Tile, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import 'ol/ol.css';
import type { Projection } from "ol/proj";
import { XYZ, Vector, VectorTile, BingMaps } from "ol/source";
import { quadKey } from "ol/source/BingMaps";
import { GeoJSON,WKT,WKB} from "ol/format";
import type { TileCoord } from "ol/tilecoord";
import { deserializeMap, serializeMap } from "./serializer";
import {mapDto} from "./testData";
import type { IMap } from "./dto/map";
// let bingLayer = new TileLayer({
//     source: new XYZ({
//         //url: 'https://dev.virtualearth.net/REST/V1/Imagery/Metadata/Aerial?output=json&include=ImageryProviders&key=YourBingMapsKey',
//         tileUrlFunction: function (tileCoord: TileCoord, pixelRatio: number, projection: Projection): string|undefined {
//             // let imageUrl = 'http://ecn.t1.tiles.virtualearth.net/tiles/a{q}.jpeg?g=1';
//             // let url = new URL(
//             //     //imageUrl.replace('{quadkey}', quadKey(tileCoord)),
//             //     imageUrl.replace('{q}', quadKey(tileCoord)),
//             // );
//             // return url.toString();
//             debugger
//             return "ttps://webst01.is.autonavi.com/appmaptile?style=6&x={1}&y={1}&z={1}"
//         }
//     })
// })

// let testVectorLayer =new VectorLayer({
//     source: new Vector({
//         url: 'https://openlayers.org/data/vector/ecoregions.json',
//         format: new GeoJSON(), 
//     }),
//     style:{'fill-color': ['string', ['get', 'COLOR'], '#eee']}
//     // new Style({
//     //     fill:new Fill({
//     //         color: 'rgba(255, 255, 255, 0.6)'
//     //     })
        
//     // })
// });
// let amapsLayer=new TileLayer({
//     source:new XYZ({
//         url:"https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
//     })
// })
// let map: Map = new Map({
//     target: 'mapContainer',
//     view: new View({
//         center: [0, 0],
//         zoom: 2
//     }), 
//     controls: [],
//     layers: [bingLayer,amapsLayer,testVectorLayer]
// });
// setTimeout(() => {
// let mapDto=serializeMap(map);
// debugger
// }, 5000);

let map=deserializeMap(mapDto as IMap)
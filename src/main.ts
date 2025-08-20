import { Map, Tile, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import 'ol/ol.css';
import { fromLonLat, Projection } from "ol/proj";
import { XYZ, Vector, VectorTile, BingMaps } from "ol/source";
import { quadKey } from "ol/source/BingMaps";
import { GeoJSON, WKT, WKB } from "ol/format";
import type { TileCoord } from "ol/tilecoord";
import { deserializeMap, serializeMap } from "./serializer";
import { mapDto } from "./testData";
import type { IMap } from "./dto/map";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";

//initMap();
deInitMap();

function initMap() {
    let bingLayer = new TileLayer({
        source: new XYZ({
            //url: 'https://dev.virtualearth.net/REST/V1/Imagery/Metadata/Aerial?output=json&include=ImageryProviders&key=YourBingMapsKey',
            tileUrlFunction: function (tileCoord: TileCoord, pixelRatio: number, projection: Projection): string | undefined {
                let imageUrl = 'http://ecn.t1.tiles.virtualearth.net/tiles/a{q}.jpeg?g=1';
                let url = new URL(
                    //imageUrl.replace('{quadkey}', quadKey(tileCoord)),
                    imageUrl.replace('{q}', quadKey(tileCoord)),
                );
                return url.toString();
            }
        })
    })

    let testVectorLayer = new VectorLayer({
        source: new Vector({
            url: 'https://openlayers.org/data/vector/ecoregions.json',
            format: new GeoJSON(),
        }),
        style: { 'fill-color': ['string', ['get', 'COLOR'], '#eee'] }
        // new Style({
        //     fill:new Fill({
        //         color: 'rgba(255, 255, 255, 0.6)'
        //     })

        // })
    });
    let amapsLayer = new TileLayer({
        source: new XYZ({
            url: "https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
        })
    })
    const extentLonLat = [-74, 40, -73, 41];

    // 转换为 Web Mercator (EPSG:3857)
    const imageExtent = [
        fromLonLat([extentLonLat[0], extentLonLat[1]]), // minX, minY
        fromLonLat([extentLonLat[2], extentLonLat[3]]), // maxX, maxY
    ];

    // 注意：fromLonLat 返回 [x, y]，所以需要拆开
    const imageExtent3857: [number, number, number, number] = [
        imageExtent[0][0], // minX
        imageExtent[0][1], // minY
        imageExtent[1][0], // maxX
        imageExtent[1][1], // maxY
    ];

    let imageStaticLayer = new ImageLayer({
        source: new ImageStatic({
            attributions: '© <a href="https://xkcd.com/license.html">xkcd</a>',
            url: 'https://imgs.xkcd.com/comics/online_communities.png',
            // projection: projection,
            imageExtent: imageExtent3857,
        }),
    })

    let map: Map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        layers: [bingLayer, amapsLayer, testVectorLayer, imageStaticLayer]
    });
    setTimeout(() => {
        map.getView().fit(imageExtent3857 as any, {
            //padding: [20, 20, 20, 20], // 可选，留一些边距
            duration: 500,             // 可选，动画时长
        });
        let mapDto = serializeMap(map);
        console.log('mapDto', mapDto)
    }, 5000);
}
function deInitMap() {
    const extentLonLat = [-74, 40, -73, 41];

    // 转换为 Web Mercator (EPSG:3857)
    const imageExtent = [
        fromLonLat([extentLonLat[0], extentLonLat[1]]), // minX, minY
        fromLonLat([extentLonLat[2], extentLonLat[3]]), // maxX, maxY
    ];

    // 注意：fromLonLat 返回 [x, y]，所以需要拆开
    const imageExtent3857: [number, number, number, number] = [
        imageExtent[0][0], // minX
        imageExtent[0][1], // minY
        imageExtent[1][0], // maxX
        imageExtent[1][1], // maxY
    ];
    let map = deserializeMap(mapDto as IMap)
    setTimeout(() => {
        map.getView().fit(imageExtent3857 as any, {
            //padding: [20, 20, 20, 20], // 可选，留一些边距
            duration: 500,             // 可选，动画时长
        });
        let mapDto = serializeMap(map);
        console.log('mapDto', mapDto)
    }, 5000);
}

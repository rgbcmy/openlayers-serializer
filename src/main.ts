import { Map, Tile, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import 'ol/ol.css';
import { fromLonLat, Projection } from "ol/proj";
import { XYZ, Vector, VectorTile as VectorTileSource, BingMaps, TileArcGISRest, ImageArcGISRest, TileJSON, WMTS, TileWMS, Zoomify, GeoTIFF, OGCMapTile, ImageWMS } from "ol/source";
import { quadKey } from "ol/source/BingMaps";
import { GeoJSON, WKT, WKB, MVT } from "ol/format";
import type { TileCoord } from "ol/tilecoord";
import { deserializeMap, serializeMap } from "./serializer";
import { mapDto } from "./testData";
import type { IMap } from "./dto/map";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import { getTopLeft, getWidth } from "ol/extent";
import { get as getProjection } from 'ol/proj';
import WMTSTileGrid from "ol/tilegrid/WMTS";
import WebGLTileLayer from 'ol/layer/WebGLTile.js';
import VectorTileLayer from "ol/layer/VectorTile";
let map: Map;
//initMap();
//deInitMap();

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

    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        layers: [bingLayer, testVectorLayer, imageStaticLayer]
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
    map = deserializeMap(mapDto as IMap)
    setTimeout(() => {
        map.getView().fit(imageExtent3857 as any, {
            //padding: [20, 20, 20, 20], // 可选，留一些边距
            duration: 500,             // 可选，动画时长
        });
        let mapDto = serializeMap(map);
        console.log('mapDto', mapDto)
    }, 5000);
}
function exportMap(filename: string = "map.json") {
    debugger
    let mapDto = serializeMap(map);

    const jsonStr = typeof mapDto === "string" ? mapDto : JSON.stringify(mapDto, null, 2);
    const blob = new Blob([jsonStr], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";

    document.body.appendChild(a);   // 插入
    a.click();                      // 触发下载
    document.body.removeChild(a);   // 立刻删除

    // 异步释放，避免还没开始下载就把 URL 回收了
    setTimeout(() => URL.revokeObjectURL(url), 0);
}
const fileInput = document.getElementById("mapFile") as HTMLInputElement;
function importMap() {
    // 触发隐藏的文件选择框
    fileInput.click();
    // if (!mapDto) {
    //     alert("请先选择一个文件");
    //     return;
    // }


}
fileInput.addEventListener("change", (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
            const text = e.target?.result as string;
            const mapDto = JSON.parse(text);
            map = deserializeMap(mapDto);
            //output.textContent = JSON.stringify(json, null, 2); // 美化后显示
        } catch (err) {
            // "❌ 文件内容不是合法 JSON";
            console.error(err);
        }
    };

    reader.readAsText(file, "utf-8");
});
function testVectorSource() {
    if (map) {
        map.setTarget(undefined);
    }
    //todo many format
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

    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        layers: [testVectorLayer]
    });
}
function testXYZSource() {
    if (map) {
        map.setTarget(undefined);
    }
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
    let amapsLayer = new TileLayer({
        source: new XYZ({
            url: "https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
        })
    })
    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        //[bingLayer,amapsLayer]
        layers: [bingLayer]
    });
}
function testStaticImageSource() {
    if (map) {
        map.setTarget(undefined);
    }
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
    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        //[bingLayer,amapsLayer]
        layers: [imageStaticLayer]
    });
}
function testTileArcGISRestSource() {
    if (map) {
        map.setTarget(undefined);
    }
    const url =
        'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/' +
        'USA/MapServer';

    const tileArcGISRestLayer = new TileLayer({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new TileArcGISRest({
            url: url,
        }),
    })

    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        //[bingLayer,amapsLayer]
        layers: [tileArcGISRestLayer]
    });
}
function testImageArcGISRestSource() {
    if (map) {
        map.setTarget(undefined);
    }
    const url =
        'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/' +
        'USA/MapServer';

    const imageArcGISRestLayer = new ImageLayer({
        source: new ImageArcGISRest({
            ratio: 1,
            params: {},
            url: url,
        }),
    })

    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        //[bingLayer,amapsLayer]
        layers: [imageArcGISRestLayer]
    });
}
function testTileJSONSource() {
    if (map) {
        map.setTarget(undefined);
    }
    //todo
    let layer = new TileLayer({
        source: new TileJSON({
            url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad?f=tilejson',
            crossOrigin: 'anonymous',
        }),
    })
    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        layers: [layer]
    });
}
function testWMTSSource() {
    if (map) {
        map.setTarget(undefined);
    }
    const projection = getProjection('EPSG:3857') ?? new Projection({ code: 'EPSG:3857' });
    const projectionExtent = projection.getExtent();
    const size = getWidth(projectionExtent ?? []) / 256;
    const resolutions = new Array(19);
    const matrixIds = new Array(19);
    for (let z = 0; z < 19; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = z;
    }
    let layer = new TileLayer({
        opacity: 0.7,
        source: new WMTS({
            attributions:
                'Tiles © <a href="https://mrdata.usgs.gov/geology/state/"' +
                ' target="_blank">USGS</a>',
            url: 'https://mrdata.usgs.gov/mapcache/wmts',
            layer: 'sgmc2',
            matrixSet: 'GoogleMapsCompatible',
            format: 'image/png',
            projection: projection,
            tileGrid: new WMTSTileGrid({
                origin: getTopLeft(projectionExtent),
                resolutions: resolutions,
                matrixIds: matrixIds,
            }),
            style: 'default',
            wrapX: true,
        })
    })
    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        layers: [layer]
    });
}
function testTileWMSSource() {
    if (map) {
        map.setTarget(undefined);
    }

    let layer = new TileLayer({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new TileWMS({
            url: 'https://ahocevar.com/geoserver/wms',
            params: { 'LAYERS': 'topp:states', 'TILED': true },
            serverType: 'geoserver',
            // Countries have transparency, so do not fade tiles:
            transition: 0,
        })
    })
    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        layers: [layer]
    });
}
function testZoomifySource() {
    if (map) {
        map.setTarget(undefined);
    }
    const imgWidth = 4000;
    const imgHeight = 3000;

    const zoomifyUrl = 'https://ol-zoomify.surge.sh/zoomify/';

    const source = new Zoomify({
        url: zoomifyUrl,
        size: [imgWidth, imgHeight],
        crossOrigin: 'anonymous',
        zDirection: -1, // Ensure we get a tile with the screen resolution or higher
    });
    source.set('url', zoomifyUrl);
    debugger;
    const extent = source.getTileGrid()?.getExtent();

    // const retinaPixelRatio = 2;
    // const retinaSource = new Zoomify({
    //     url: zoomifyUrl,
    //     size: [imgWidth, imgHeight],
    //     crossOrigin: 'anonymous',
    //     zDirection: -1, // Ensure we get a tile with the screen resolution or higher
    //     tilePixelRatio: retinaPixelRatio, // Display retina tiles
    //     tileSize: 256 / retinaPixelRatio, // from a higher zoom level
    // });

    const layer = new TileLayer({
        source: source
    });

    map = new Map({
        layers: [layer],
        target: 'mapContainer',
        view: new View({
            // adjust zoom levels to those provided by the source
            resolutions: layer.getSource()?.getTileGrid()?.getResolutions(),
            // constrain the center: center cannot be set outside this extent
            extent: extent,
            constrainOnlyCenter: true,
        }),
    });
    map.getView().fit(extent ?? []);
}
function testGeoTIFFSource() {
    if (map) {
        map.setTarget(undefined);
    }
    const source = new GeoTIFF({
        normalize: false,
        sources: [
            {
                url: 'https://s2downloads.eox.at/demo/EOxCloudless/2020/rgbnir/s2cloudless2020-16bits_sinlge-file_z0-4.tif'
                //url: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif',
            },
        ],
        wrapX: true,
    });
    let layer = new WebGLTileLayer({
        style: {
            color: [
                'array',
                ['/', ['band', 0], 2550], // 红色波段归一化
                ['/', ['band', 1], 2550], // 绿色波段归一化
                ['/', ['band', 2], 2550], // 蓝色波段归一化
                1,                        // alpha
            ],
        },
        source: source
    })

    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2,
        }),
        controls: [],
        layers: [layer]
    });
    // setTimeout(() => {
    //     debugger
    //     map.getView().fit(layer.getExtent() as any, {
    //         //padding: [20, 20, 20, 20], // 可选，留一些边距
    //         duration: 500,             // 可选，动画时长
    //     });
    // }, 5000);
}
function testOGCMapTileSource() {
    if (map) {
        map.setTarget(undefined);
    }
    let source = new OGCMapTile({
        url: 'https://maps.gnosis.earth/ogcapi/collections/blueMarble/map/tiles/WebMercatorQuad',
    });
    source.set('url', 'https://maps.gnosis.earth/ogcapi/collections/blueMarble/map/tiles/WebMercatorQuad');
    let layer = new TileLayer({
        source: source
    })
    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        layers: [layer]
    });

}
function testImageWMSSource() {
    if (map) {
        map.setTarget(undefined);
    }
    let layer = new ImageLayer({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new ImageWMS({
            url: 'https://ahocevar.com/geoserver/wms',
            params: { 'LAYERS': 'topp:states' },
            ratio: 1,
            serverType: 'geoserver',
        }),
    })
    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        layers: [layer]
    });
}
function testVectorTileSource() {
    if (map) {
        map.setTarget(undefined);
    }
    let layer = new VectorTileLayer({
        source: new VectorTileSource({
            format: new MVT(),
            url: 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf',
        }),
    })
    map = new Map({
        target: 'mapContainer',
        view: new View({
            center: [0, 0],
            zoom: 2
        }),
        controls: [],
        layers: [layer]
    });
}
// 挂到 window 全局
(window as any).exportMap = exportMap;
(window as any).importMap = importMap;
(window as any).testVectorSource = testVectorSource;
(window as any).testXYZSource = testXYZSource;
(window as any).testStaticImageSource = testStaticImageSource;
(window as any).testTileArcGISRestSource = testTileArcGISRestSource;
(window as any).testImageArcGISRestSource = testImageArcGISRestSource;
(window as any).testTileJSONSource = testTileJSONSource;
(window as any).testWMTSSource = testWMTSSource;
(window as any).testTileWMSSource = testTileWMSSource;
(window as any).testZoomifySource = testZoomifySource;
(window as any).testGeoTIFFSource = testGeoTIFFSource;
(window as any).testOGCMapTileSource = testOGCMapTileSource;
(window as any).testImageWMSSource = testImageWMSSource;
(window as any).testVectorTileSource = testVectorTileSource;

import type { IMap } from "./dto/map";

export const mapDto:IMap ={
    "name":"Untitled",
    "controls": [],
    "interactions": [],
    "layers": [
        {
            "type": "Tile",
            "id": "fbf1618a-2b66-49ad-aecc-5e4b46252502",
            "name": "Untitled",
            "className": "ol-layer",
            "opacity": 1,
            "visible": true,
            "extent": null,
            "minResolution": 0,
            "maxResolution": null,
            "minZoom": null,
            "maxZoom": null,
            "zIndex": null,
            "background": null,
            "properties": {
                "opacity": 1,
                "visible": true,
                "maxResolution": null,
                "minResolution": 0,
                "minZoom": null,
                "maxZoom": null,
                "preload": 0,
                "useInterimTilesOnError": true
            },
            "useInterimTilesOnError": true,
            "preload": 0,
            "source": {
                "type": "XYZ",
                "attributions": null,
                "attributionsCollapsible": true,
                "cacheSize": null,
                "crossOrigin": "anonymous",
                "interpolate": true,
                "opaque": false,
                "projection": "EPSG:3857",
                "reprojectionErrorThreshold": 0.5,
                "maxZoom": 42,
                "minZoom": 0,
                "tileGrid": {
                    "extent": [
                        -20037508.342789244,
                        -20037508.342789244,
                        20037508.342789244,
                        20037508.342789244
                    ],
                    "minZoom": 0,
                    "origin": [
                        -20037508.342789244,
                        20037508.342789244
                    ],
                    "origins": null,
                    "resolutions": [
                        156543.03392804097,
                        78271.51696402048,
                        39135.75848201024,
                        19567.87924100512,
                        9783.93962050256,
                        4891.96981025128,
                        2445.98490512564,
                        1222.99245256282,
                        611.49622628141,
                        305.748113140705,
                        152.8740565703525,
                        76.43702828517625,
                        38.21851414258813,
                        19.109257071294063,
                        9.554628535647032,
                        4.777314267823516,
                        2.388657133911758,
                        1.194328566955879,
                        0.5971642834779395,
                        0.29858214173896974,
                        0.14929107086948487,
                        0.07464553543474244,
                        0.03732276771737122,
                        0.01866138385868561,
                        0.009330691929342804,
                        0.004665345964671402,
                        0.002332672982335701,
                        0.0011663364911678506,
                        0.0005831682455839253,
                        0.00029158412279196264,
                        0.00014579206139598132,
                        0.00007289603069799066,
                        0.00003644801534899533,
                        0.000018224007674497665,
                        0.000009112003837248832,
                        0.000004556001918624416,
                        0.000002278000959312208,
                        0.000001139000479656104,
                        5.69500239828052e-7,
                        2.84750119914026e-7,
                        1.42375059957013e-7,
                        7.11875299785065e-8,
                        3.559376498925325e-8
                    ],
                    "sizes": [
                        [
                            1,
                            1
                        ],
                        [
                            2,
                            2
                        ],
                        [
                            4,
                            4
                        ],
                        [
                            8,
                            8
                        ],
                        [
                            16,
                            16
                        ],
                        [
                            32,
                            32
                        ],
                        [
                            64,
                            64
                        ],
                        [
                            128,
                            128
                        ],
                        [
                            256,
                            256
                        ],
                        [
                            512,
                            512
                        ],
                        [
                            1024,
                            1024
                        ],
                        [
                            2048,
                            2048
                        ],
                        [
                            4096,
                            4096
                        ],
                        [
                            8192,
                            8192
                        ],
                        [
                            16384,
                            16384
                        ],
                        [
                            32768,
                            32768
                        ],
                        [
                            65536,
                            65536
                        ],
                        [
                            131072,
                            131072
                        ],
                        [
                            262144,
                            262144
                        ],
                        [
                            524288,
                            524288
                        ],
                        [
                            1048576,
                            1048576
                        ],
                        [
                            2097152,
                            2097152
                        ],
                        [
                            4194304,
                            4194304
                        ],
                        [
                            8388608,
                            8388608
                        ],
                        [
                            16777216,
                            16777216
                        ],
                        [
                            33554432,
                            33554432
                        ],
                        [
                            67108864,
                            67108864
                        ],
                        [
                            134217728,
                            134217728
                        ],
                        [
                            268435456,
                            268435456
                        ],
                        [
                            536870912,
                            536870912
                        ],
                        [
                            1073741824,
                            1073741824
                        ],
                        [
                            2147483648,
                            2147483648
                        ],
                        [
                            4294967296,
                            4294967296
                        ],
                        [
                            8589934592,
                            8589934592
                        ],
                        [
                            17179869184,
                            17179869184
                        ],
                        [
                            34359738368,
                            34359738368
                        ],
                        [
                            68719476736,
                            68719476736
                        ],
                        [
                            137438953472,
                            137438953472
                        ],
                        [
                            274877906944,
                            274877906944
                        ],
                        [
                            549755813888,
                            549755813888
                        ],
                        [
                            1099511627776,
                            1099511627776
                        ],
                        [
                            2199023255552,
                            2199023255552
                        ],
                        [
                            4398046511104,
                            4398046511104
                        ]
                    ],
                    "tileSize": 256,
                    "tileSizes": null
                },
                "tileLoadFunction": "function defaultTileLoadFunction(imageTile, src) {\n  imageTile.getImage().src = src;\n}",
                "tileSize": 256,
                "gutter": 0,
                "tileUrlFunction": "function(tileCoord, pixelRatio, projection) {\n        let imageUrl = \"http://ecn.t1.tiles.virtualearth.net/tiles/a{q}.jpeg?g=1\";\n        let url = new URL(\n          //imageUrl.replace('{quadkey}', quadKey(tileCoord)),\n          imageUrl.replace(\"{q}\", quadKey(tileCoord))\n        );\n        return url.toString();\n      }",
                "urls": null,
                "wrapX": true,
                "transition": 250,
                "zDirection": 0
            }
        },
        {
            "type": "Tile",
            "id": "31d406f8-003b-43a7-b888-acaf8b701aa1",
            "name": "Untitled",
            "className": "ol-layer",
            "opacity": 1,
            "visible": true,
            "extent": null,
            "minResolution": 0,
            "maxResolution": null,
            "minZoom": null,
            "maxZoom": null,
            "zIndex": null,
            "background": null,
            "properties": {
                "opacity": 1,
                "visible": true,
                "maxResolution": null,
                "minResolution": 0,
                "minZoom": null,
                "maxZoom": null,
                "preload": 0,
                "useInterimTilesOnError": true
            },
            "useInterimTilesOnError": true,
            "preload": 0,
            "source": {
                "type": "XYZ",
                "attributions": null,
                "attributionsCollapsible": true,
                "cacheSize": null,
                "crossOrigin": "anonymous",
                "interpolate": true,
                "opaque": false,
                "projection": "EPSG:3857",
                "reprojectionErrorThreshold": 0.5,
                "maxZoom": 42,
                "minZoom": 0,
                "tileGrid": {
                    "extent": [
                        -20037508.342789244,
                        -20037508.342789244,
                        20037508.342789244,
                        20037508.342789244
                    ],
                    "minZoom": 0,
                    "origin": [
                        -20037508.342789244,
                        20037508.342789244
                    ],
                    "origins": null,
                    "resolutions": [
                        156543.03392804097,
                        78271.51696402048,
                        39135.75848201024,
                        19567.87924100512,
                        9783.93962050256,
                        4891.96981025128,
                        2445.98490512564,
                        1222.99245256282,
                        611.49622628141,
                        305.748113140705,
                        152.8740565703525,
                        76.43702828517625,
                        38.21851414258813,
                        19.109257071294063,
                        9.554628535647032,
                        4.777314267823516,
                        2.388657133911758,
                        1.194328566955879,
                        0.5971642834779395,
                        0.29858214173896974,
                        0.14929107086948487,
                        0.07464553543474244,
                        0.03732276771737122,
                        0.01866138385868561,
                        0.009330691929342804,
                        0.004665345964671402,
                        0.002332672982335701,
                        0.0011663364911678506,
                        0.0005831682455839253,
                        0.00029158412279196264,
                        0.00014579206139598132,
                        0.00007289603069799066,
                        0.00003644801534899533,
                        0.000018224007674497665,
                        0.000009112003837248832,
                        0.000004556001918624416,
                        0.000002278000959312208,
                        0.000001139000479656104,
                        5.69500239828052e-7,
                        2.84750119914026e-7,
                        1.42375059957013e-7,
                        7.11875299785065e-8,
                        3.559376498925325e-8
                    ],
                    "sizes": [
                        [
                            1,
                            1
                        ],
                        [
                            2,
                            2
                        ],
                        [
                            4,
                            4
                        ],
                        [
                            8,
                            8
                        ],
                        [
                            16,
                            16
                        ],
                        [
                            32,
                            32
                        ],
                        [
                            64,
                            64
                        ],
                        [
                            128,
                            128
                        ],
                        [
                            256,
                            256
                        ],
                        [
                            512,
                            512
                        ],
                        [
                            1024,
                            1024
                        ],
                        [
                            2048,
                            2048
                        ],
                        [
                            4096,
                            4096
                        ],
                        [
                            8192,
                            8192
                        ],
                        [
                            16384,
                            16384
                        ],
                        [
                            32768,
                            32768
                        ],
                        [
                            65536,
                            65536
                        ],
                        [
                            131072,
                            131072
                        ],
                        [
                            262144,
                            262144
                        ],
                        [
                            524288,
                            524288
                        ],
                        [
                            1048576,
                            1048576
                        ],
                        [
                            2097152,
                            2097152
                        ],
                        [
                            4194304,
                            4194304
                        ],
                        [
                            8388608,
                            8388608
                        ],
                        [
                            16777216,
                            16777216
                        ],
                        [
                            33554432,
                            33554432
                        ],
                        [
                            67108864,
                            67108864
                        ],
                        [
                            134217728,
                            134217728
                        ],
                        [
                            268435456,
                            268435456
                        ],
                        [
                            536870912,
                            536870912
                        ],
                        [
                            1073741824,
                            1073741824
                        ],
                        [
                            2147483648,
                            2147483648
                        ],
                        [
                            4294967296,
                            4294967296
                        ],
                        [
                            8589934592,
                            8589934592
                        ],
                        [
                            17179869184,
                            17179869184
                        ],
                        [
                            34359738368,
                            34359738368
                        ],
                        [
                            68719476736,
                            68719476736
                        ],
                        [
                            137438953472,
                            137438953472
                        ],
                        [
                            274877906944,
                            274877906944
                        ],
                        [
                            549755813888,
                            549755813888
                        ],
                        [
                            1099511627776,
                            1099511627776
                        ],
                        [
                            2199023255552,
                            2199023255552
                        ],
                        [
                            4398046511104,
                            4398046511104
                        ]
                    ],
                    "tileSize": 256,
                    "tileSizes": null
                },
                "tileLoadFunction": "function defaultTileLoadFunction(imageTile, src) {\n  imageTile.getImage().src = src;\n}",
                "tileSize": 256,
                "gutter": 0,
                "tileUrlFunction": "function(tileCoord, pixelRatio, projection) {\n      if (!tileCoord) {\n        return void 0;\n      }\n      return template.replace(zRegEx, tileCoord[0].toString()).replace(xRegEx, tileCoord[1].toString()).replace(yRegEx, tileCoord[2].toString()).replace(dashYRegEx, function() {\n        const z = tileCoord[0];\n        const range = tileGrid.getFullTileRange(z);\n        if (!range) {\n          throw new Error(\n            \"The {-y} placeholder requires a tile grid with extent\"\n          );\n        }\n        const y = range.getHeight() - tileCoord[2] - 1;\n        return y.toString();\n      });\n    }",
                "urls": [
                    "https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
                ],
                "wrapX": true,
                "transition": 250,
                "zDirection": 0
            }
        },
        {
            "type": "Vector",
            "id": "6f34c933-f5b4-4006-9a17-f3aa17a7ec8c",
            "name": "Untitled",
            "className": "ol-layer",
            "opacity": 1,
            "visible": true,
            "extent": null,
            "minResolution": 0,
            "maxResolution": null,
            "minZoom": null,
            "maxZoom": null,
            "zIndex": null,
            "background": null,
            "properties": {
                "opacity": 1,
                "visible": true,
                "maxResolution": null,
                "minResolution": 0,
                "minZoom": null,
                "maxZoom": null
            },
            "renderBuffer": 100,
            "declutter": false,
            "updateWhileAnimating": false,
            "updateWhileInteracting": false,
            "source": {
                "type": "Vector",
                "attributions": null,
                "format": "GeoJSON",
                "overlaps": true,
                "strategy": "all",
                "url": "https://openlayers.org/data/vector/ecoregions.json",
                "useSpatialIndex": true,
                "wrapX": true
            },
            "style": {
                "fill-color": [
                    "string",
                    [
                        "get",
                        "COLOR"
                    ],
                    "#eee"
                ]
            }
        },
        {
            "type": "Image",
            "id": "fdb0bc5c-8c06-431a-840e-cae9a3a79981",
            "name": "Untitled",
            "className": "ol-layer",
            "opacity": 1,
            "visible": true,
            "extent": null,
            "minResolution": 0,
            "maxResolution": null,
            "minZoom": null,
            "maxZoom": null,
            "zIndex": null,
            "background": null,
            "properties": {
                "opacity": 1,
                "visible": true,
                "maxResolution": null,
                "minResolution": 0,
                "minZoom": null,
                "maxZoom": null
            },
            "source": {
                "type": "ImageStatic",
                "imageExtent": [
                    -8237642.318702245,
                    4865942.279503176,
                    -8126322.827908971,
                    5012341.663847518
                ],
                "interpolate": true,
                "projection": "EPSG:3857",
                "url": "https://imgs.xkcd.com/comics/online_communities.png"
            }
        }
    ],
    "maxTilesLoading": 16,
    "overlays": [],
    "target": "mapContainer",
    "view": {
        "center": [
            0,
            0
        ],
        "constrainResolution": false,
        "maxResolution": 156543.03392804097,
        "minResolution": 0.0005831682455839253,
        "maxZoom": 28,
        "minZoom": 0,
        "projection": "EPSG:3857",
        "resolution": 20959.736760239794,
        "resolutions": null,
        "rotation": 0,
        "zoom": 2.9008668079807487
    }
}
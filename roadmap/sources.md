| Source 类型   | 说明           | 是否支持 | 是否完成序列化/反序列化 | 备注               |
|--------------|----------------|----------|-------------------------|--------------------|
| XYZ          | 常用 XYZ 瓦片源 | ✅       | ✅                      | 最常见的瓦片源      |
| OSM          | OpenStreetMap 瓦片 | ✅       | ✅                      | 继承自 XYZ         |
| TileWMS      | WMS 瓦片服务    | ✅       | 部分                    | 需补全细节         |
| WMTS         | OGC WMTS 服务   | ❌       | ❌                      | 未实现             |
| WebGLTile    | WebGL 瓦片      | ❌       | ❌                      | 部分版本支持       |
| ImageStatic  | 静态单张图像    | ✅       | ✅                      |                    |
| ImageWMS     | WMS 静态图片    | ❌       | ❌                      | 未实现             |
| Vector       | 矢量数据源      | ✅       | ✅                      | 支持 GeoJSON       |
| VectorTile   | 矢量瓦片数据    | ✅       | ✅                      | 支持 MVT 格式      |
| BingMaps     | 微软地图        | ❌       | ❌                      | 需要 API Key       |
| Cluster      | 聚合矢量图层    | ❌       | ❌                      | 可选，聚合逻辑复杂 |
| TileJSON     | TileJSON 瓦片源 | ❌       | ❌                      |                    |

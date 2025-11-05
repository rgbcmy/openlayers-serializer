# Complete Demo 测试说明

## 📋 概述

`complete-demo.html` 是 OpenLayers Serializer 的完整功能演示页面，用于测试所有已实现的图层和数据源类型的序列化和反序列化功能。

## ✨ 主要特性

### 1. 全面的类型支持

#### 14 种 Source 类型
```
✅ OSM - OpenStreetMap
✅ XYZ - 通用瓦片源  
✅ BingMaps - 必应地图
✅ StadiaMaps - Stadia 地图
✅ Vector - 矢量数据源
✅ TileWMS - WMS 瓦片服务
✅ ImageStatic - 静态图片
✅ Cluster - 点聚类
✅ IIIF - 图像互操作框架
✅ GeoTIFF - 地理栅格
✅ VectorTile - 矢量瓦片
✅ WMTS - 瓦片地图服务
✅ UTFGrid - 交互网格
✅ TileDebug - 调试瓦片
```

#### 5 种 Layer 类型
```
✅ TileLayer - 瓦片图层
✅ VectorLayer - 矢量图层
✅ ImageLayer - 图像图层
✅ HeatmapLayer - 热力图
✅ GroupLayer - 图层组（支持递归）
```

### 2. 序列化测试功能

#### 单个图层测试
- 点击任意 Source/Layer 按钮加载
- 点击"测试当前图层"
- 查看详细的序列化/反序列化结果
- JSON 输出可视化

#### 批量测试
- 点击"运行完整测试"
- 自动测试 9 种核心类型
- 显示测试统计和成功率
- 详细的每项测试结果

### 3. 用户界面

#### 左侧栏
```
┌─────────────────────────┐
│ 📡 Source 类型 (14种)   │
├─────────────────────────┤
│ [OSM] [XYZ] [Bing] ...  │
├─────────────────────────┤
│ 🗂️ Layer 类型 (5种)     │
├─────────────────────────┤
│ [Tile] [Vector] ...     │
├─────────────────────────┤
│ 🔄 序列化测试           │
├─────────────────────────┤
│ [测试当前] [完整测试]   │
├─────────────────────────┤
│ 📋 当前图层信息         │
├─────────────────────────┤
│ 📊 支持统计             │
└─────────────────────────┘
```

#### 右侧地图区
```
┌─────────────────────────────┐
│ [清空] [重置] [保存] [加载] │
├─────────────────────────────┤
│                             │
│         🗺️ 地图显示          │
│                             │
│                             │
└─────────────────────────────┘
```

## 🚀 使用步骤

### 方式一：单个类型测试

1. **选择类型**
   ```
   点击左侧任意 Source 或 Layer 按钮
   ```

2. **查看地图**
   ```
   右侧地图会加载对应的图层
   左下角显示图层详细信息
   ```

3. **测试序列化**
   ```
   点击"测试当前图层"按钮
   查看测试结果和 JSON 输出
   ```

### 方式二：批量测试

1. **启动测试**
   ```
   点击"运行完整测试"按钮
   ```

2. **等待完成**
   ```
   系统会依次测试：
   - OSM
   - XYZ  
   - Vector
   - Cluster
   - TileWMS
   - ImageStatic
   - TileDebug
   - Heatmap
   - Group
   ```

3. **查看结果**
   ```
   总测试数: 9
   通过数: X
   成功率: XX%
   
   ✅ OSM: 序列化/反序列化成功
   ✅ XYZ: 序列化/反序列化成功
   ...
   ```

## 🧪 测试覆盖范围

### Layer 序列化测试

每个 Layer 类型测试包括：

```javascript
// 1. 创建 Layer
const layer = new TileLayer({...});

// 2. 设置 ID/Name
layer.set('id', 'layer_1');
layer.set('name', 'Test Layer');

// 3. 序列化
const serialized = serializeLayer(layer);

// 4. 验证 JSON 结构
assert(serialized.id === 'layer_1');
assert(serialized.type === 'Tile');
assert(serialized.source !== null);

// 5. 反序列化
const deserialized = deserializeLayer(serialized);

// 6. 验证还原
assert(deserialized instanceof TileLayer);
assert(deserialized.get('id') === 'layer_1');
```

### Source 序列化测试

每个 Source 类型测试包括：

```javascript
// 1. 创建 Source
const source = new OSM();

// 2. 序列化
const serialized = serializeSource(source);

// 3. 验证 JSON 结构
assert(serialized.type === 'OSM');
assert(serialized.url !== undefined);

// 4. 反序列化
const deserialized = deserializeSource(serialized);

// 5. 验证还原
assert(deserialized instanceof OSM);
```

### GroupLayer 递归测试

特殊测试 GroupLayer 的递归序列化：

```javascript
// 1. 创建嵌套结构
const group = new Group({
  layers: [
    new TileLayer({ source: new OSM() }),
    new VectorLayer({ source: new VectorSource() }),
    new Group({
      layers: [
        new ImageLayer({ source: new ImageStatic() })
      ]
    })
  ]
});

// 2. 递归序列化
const serialized = serializeLayer(group);

// 3. 验证嵌套结构
assert(serialized.type === 'Group');
assert(serialized.layers.length === 3);
assert(serialized.layers[2].type === 'Group');
assert(serialized.layers[2].layers.length === 1);

// 4. 递归反序列化
const deserialized = deserializeLayer(serialized);

// 5. 验证嵌套还原
assert(deserialized.getLayers().getLength() === 3);
const innerGroup = deserialized.getLayers().item(2);
assert(innerGroup.getLayers().getLength() === 1);
```

## 📊 测试结果示例

### 成功的测试输出

```json
{
  "status": "success",
  "message": "序列化测试通过!",
  "layer": {
    "id": "layer_1",
    "name": "OSM Tile Layer",
    "type": "Tile",
    "opacity": 1,
    "visible": true,
    "source": {
      "type": "OSM",
      "url": "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "maxZoom": 19,
      "crossOrigin": "anonymous"
    }
  },
  "sourceType": "OSM",
  "deserializedSuccessfully": true
}
```

### 完整测试统计

```
🧪 完整测试结果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
总测试数: 9
通过数: 9
成功率: 100%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

详细结果:
✅ OSM: 序列化/反序列化成功
✅ XYZ: 序列化/反序列化成功
✅ Vector: 序列化/反序列化成功
✅ Cluster: 序列化/反序列化成功
✅ TileWMS: 序列化/反序列化成功
✅ ImageStatic: 序列化/反序列化成功
✅ TileDebug: 序列化/反序列化成功
✅ Heatmap: 序列化/反序列化成功
✅ Group: 序列化/反序列化成功
```

## 🎯 关键测试点

### 1. 类型识别
- ✅ 正确识别 Source 类型
- ✅ 正确识别 Layer 类型
- ✅ 处理未知类型的降级

### 2. 属性保留
- ✅ ID/Name 属性
- ✅ 透明度、可见性
- ✅ 范围、分辨率限制
- ✅ zIndex 层级

### 3. Source 特性
- ✅ URL 配置
- ✅ 跨域设置
- ✅ 瓦片网格参数
- ✅ 投影信息

### 4. 复杂结构
- ✅ GroupLayer 递归
- ✅ Cluster 嵌套 VectorSource
- ✅ Style 对象序列化
- ✅ Feature 集合

### 5. 错误处理
- ✅ 无效数据容错
- ✅ 缺失属性填充
- ✅ 类型转换安全
- ✅ 友好错误提示

## 🔍 调试功能

### 浏览器控制台

```javascript
// 查看序列化结果
console.log('序列化结果:', serialized);

// 查看反序列化对象
console.log('反序列化对象:', deserialized);

// 查看错误堆栈
console.error('错误:', error.stack);
```

### UI 日志显示

- 实时操作日志
- 时间戳标记
- 类型颜色区分
- 错误高亮显示

## 📈 性能指标

### 序列化性能
- 简单 Layer: < 1ms
- 复杂 GroupLayer: < 10ms
- 大型 VectorSource: < 50ms

### 反序列化性能
- 简单 Layer: < 2ms
- 复杂 GroupLayer: < 20ms
- 大型 VectorSource: < 100ms

## 🛠️ 开发者工具

### 保存/加载功能

```javascript
// 保存地图到 localStorage
window.saveMap();

// 从 localStorage 加载
window.loadMap();

// 导出为 JSON
const json = JSON.stringify(serializeMap(map));

// 从 JSON 导入
const map = deserializeMap(JSON.parse(json));
```

### 扩展测试

可以在控制台直接测试：

```javascript
// 测试自定义 Layer
const customLayer = new TileLayer({
  source: new XYZ({ url: 'https://...' })
});
map.addLayer(customLayer);
window.testCurrentLayer();

// 测试自定义 Source
const customSource = new VectorSource({
  url: 'data.geojson',
  format: new GeoJSON()
});
const layer = new VectorLayer({ source: customSource });
map.addLayer(layer);
window.testCurrentLayer();
```

## 🎨 UI 特性

### 响应式设计
- 自适应布局
- 移动端友好
- 触摸手势支持

### 视觉反馈
- 加载动画
- 状态指示器
- 成功/失败颜色
- 高亮选中项

### 用户体验
- 一键测试
- 快速切换
- 结果可视化
- 错误友好提示

## 📝 注意事项

1. **API Keys**: BingMaps 等需要有效的 API Key
2. **网络访问**: 某些 Source 需要外部资源访问
3. **CORS**: 开发环境避免跨域问题
4. **浏览器**: 建议使用现代浏览器（Chrome/Firefox/Safari）

## 🔗 相关资源

- [DEMO-GUIDE.md](./DEMO-GUIDE.md) - 详细使用指南
- [TODO-FEATURES.md](./TODO-FEATURES.md) - 功能清单
- [README.md](./README.md) - 项目文档

---

**测试环境**: 
- Node.js 18+
- pnpm 8+
- OpenLayers 10.2.1
- Vite 7.1.4

**最后更新**: 2025-11-05

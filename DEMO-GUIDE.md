# OpenLayers Serializer - 完整Demo使用指南

## 🎯 概述

`complete-demo.html` 是一个全面的测试页面，用于验证所有已实现的 OpenLayers 图层和数据源类型的序列化和反序列化功能。

## 📦 已实现的功能

### Source 类型 (14种)

1. **OSM** - OpenStreetMap 瓦片源
2. **XYZ** - 通用 XYZ 瓦片源
3. **BingMaps** - 必应地图
4. **StadiaMaps** - Stadia Maps (原 Stamen)
5. **Vector** - 矢量数据源
6. **TileWMS** - WMS 瓦片服务
7. **ImageStatic** - 静态图片源
8. **Cluster** - 聚类数据源
9. **IIIF** - 国际图像互操作框架
10. **GeoTIFF** - GeoTIFF 栅格数据
11. **VectorTile** - 矢量瓦片 (MVT)
12. **WMTS** - Web Map Tile Service
13. **UTFGrid** - UTF Grid 交互数据
14. **TileDebug** - 瓦片调试源

### Layer 类型 (5种)

1. **TileLayer** - 瓦片图层
2. **VectorLayer** - 矢量图层
3. **ImageLayer** - 图像图层
4. **HeatmapLayer** - 热力图图层
5. **GroupLayer** - 图层组 (支持递归序列化)

## 🚀 使用方法

### 1. 启动开发服务器

```bash
pnpm run dev
```

### 2. 打开浏览器

访问 `http://localhost:5173/complete-demo.html`

### 3. 测试功能

#### 单个图层测试
1. 点击左侧 Source 或 Layer 类型按钮加载图层
2. 点击"测试当前图层"按钮
3. 查看测试结果，包括：
   - 序列化 JSON 输出
   - 反序列化成功/失败状态
   - 详细错误信息（如有）

#### 批量测试
1. 点击"运行完整测试"按钮
2. 系统将自动测试 9 种主要类型
3. 查看测试统计：
   - 总测试数
   - 通过数量
   - 成功率
   - 每个类型的详细结果

## 🎨 界面功能

### 左侧边栏

- **Source 类型区域**: 展示所有支持的数据源类型
- **Layer 类型区域**: 展示所有支持的图层类型
- **序列化测试区**: 测试按钮和状态显示
- **当前图层信息**: 显示当前选中图层的详细信息
- **支持统计**: 显示已实现的类型数量统计

### 右侧地图区域

- **控制栏**: 
  - 清空地图
  - 重置视图
  - 保存地图（localStorage）
  - 加载地图
- **地图显示**: 实时显示加载的图层
- **状态栏**: 显示当前操作状态

## 🧪 测试覆盖

### 序列化测试包括：

1. ✅ Layer 对象完整序列化
2. ✅ Source 对象序列化
3. ✅ ID/Name 属性保留
4. ✅ 递归 GroupLayer 子图层处理
5. ✅ Style 样式序列化
6. ✅ 完整反序列化还原

### 验证内容：

- 所有属性正确序列化为 JSON
- JSON 可以完整反序列化回 OpenLayers 对象
- ID 和 Name 在序列化循环中保持一致
- 嵌套结构（如 GroupLayer）正确处理
- 错误情况的友好提示

## 📝 架构特点

### 模块化设计

- 使用新的 `layer-new.ts` 和 `source-new.ts` 模块化架构
- 每个 Source/Layer 类型都有独立的序列化器
- 通过 `SerializerRegistry` 统一管理

### NPM 包导入

所有 OpenLayers 依赖都从 npm 包导入，不依赖 CDN：

```javascript
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer, ... } from 'ol/layer.js';
import { OSM, XYZ, ... } from 'ol/source.js';
```

### 类型安全

- 完整的 TypeScript 类型支持
- DTO 接口定义清晰
- 编译时类型检查

## 🔍 调试功能

- 浏览器控制台输出详细日志
- UI 显示序列化 JSON 结果
- 错误堆栈跟踪
- 实时状态更新

## 📊 测试结果示例

```
🧪 完整测试结果
总测试数: 9
通过数: 9
成功率: 100%

✅ OSM: 序列化/反序列化成功
✅ XYZ: 序列化/反序列化成功
✅ Vector: 序列化/反序列化成功
...
```

## 🛠️ 下一步开发

当前已完成的功能已经覆盖了主要的 Layer 和 Source 类型。未来可以扩展：

1. WebGLTileLayer 支持
2. 更多的 Source 类型（如 CartoDB, Mapbox 等）
3. 复杂样式的完整序列化
4. Feature 的完整序列化支持
5. 交互功能的序列化

## 📚 相关文档

- [TODO-FEATURES.md](./TODO-FEATURES.md) - 原有功能清单
- [group-layer-test.html](./group-layer-test.html) - GroupLayer 专项测试
- [refactor-complete-test.html](./refactor-complete-test.html) - 重构验证测试

## 💡 提示

- 某些 Source 类型（如 BingMaps, IIIF）需要有效的 API Key 或服务器 URL
- GeoTIFF 和 VectorTile 等高级类型可能需要网络访问外部资源
- 建议在开发环境中测试，避免跨域问题

---

**项目状态**: ✅ 核心功能完成  
**最后更新**: 2025-11-05

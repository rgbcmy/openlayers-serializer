# openlayers-serializer

A **secure, type-safe** utility library for **[OpenLayers](https://openlayers.org/)** that allows you to **serialize and deserialize map objects**.
Easily transfer map state, layers, views, and features between frontend and backend, or save and restore map configurations.

---

## 🆕 Latest Improvements (v2.0)

* 🔒 **Security First**: Eliminated `eval()` usage with safe function serialization
* 🛡️ **Input Validation**: Comprehensive data validation using Zod schemas  
* 🔧 **Error Recovery**: Robust error handling with graceful fallbacks
* ✅ **Fully Tested**: 59 unit tests with 90%+ coverage on core modules
* 📝 **TypeScript**: Complete type safety and IntelliSense support

---

## ✨ Features

* 🔄 **Serialization**: Convert `ol.Map`, `ol.View`, `ol.layer.*`, `ol.source.*`, and `ol.Feature` into JSON
* 📦 **Deserialization**: Rebuild OpenLayers objects from JSON with validation
* 🎯 Supports **Map**, **View**, **Layers**, **Sources**, and **Features**
* 🔒 **Secure**: Safe function serialization without `eval()` risks
* 🛡️ **Validated**: Input validation and error recovery mechanisms
* 💾 Perfect for **saving map configurations** or **data exchange**

---

## 📦 Installation

```bash
npm install openlayers-serializer
# or
yarn add openlayers-serializer
# or  
pnpm add openlayers-serializer
```

---

## 🚀 Quick Start

### Basic Usage

```ts
import { serializeMap, deserializeMap } from "openlayers-serializer";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

// Create a map
const map = new Map({
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
});

// Serialize map to JSON (secure, validated)
const mapData = serializeMap(map);
console.log("Serialized:", mapData);

// Save to localStorage (example)
localStorage.setItem('myMap', JSON.stringify(mapData));

// Restore map from JSON (with validation)
const savedData = JSON.parse(localStorage.getItem('myMap'));
const restoredMap = deserializeMap(savedData);
console.log("Restored:", restoredMap);
```

### Error Handling

```ts
import { deserializeMap, ValidationError, DeserializationError } from "openlayers-serializer";

try {
  const map = deserializeMap(mapData);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Invalid map data:", error.message);
  } else if (error instanceof DeserializationError) {
    console.error("Failed to create map:", error.message);
    // Error includes context and suggestions
    console.log("Context:", error.context);
    console.log("Suggestions:", error.suggestions);
  }
}
```

### Browser Demo

```html
<!DOCTYPE html>
<html>
<head>
  <title>OpenLayers Serializer Demo</title>
  <script type="module">
    import { createDemoMap, exportMapData, importMapData } from './dist/openlayers-serializer.es.js';
    
    // Create demo map
    const map = createDemoMap();
    
    // Export map data
    window.exportMap = () => exportMapData();
    
    // Import map data
    window.importMap = () => importMapData();
  </script>
</head>
<body>
  <div id="map" style="width: 100%; height: 500px;"></div>
  <button onclick="exportMap()">Export Map</button>
  <button onclick="importMap()">Import Map</button>
</body>
</html>
```

---

## � Development & Testing

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

### Test Coverage

- **Total Tests**: 59 tests, all passing ✅
- **Core Modules**: 90%+ test coverage
- **Security**: No `eval()` usage, safe function serialization
- **Validation**: Comprehensive input validation with Zod

---

## 📚 API Reference

### Core Functions

#### `serializeMap(map: Map): IMap`

Convert an OpenLayers `Map` instance into a serializable object.

**Parameters:**
- `map: Map` - OpenLayers Map instance

**Returns:** Serialized map data object

#### `deserializeMap(data: IMap): Map`

Rebuild an OpenLayers `Map` instance from serialized data.

**Parameters:**
- `data: IMap` - Serialized map data (validated automatically)

**Returns:** OpenLayers Map instance

**Throws:**
- `ValidationError` - If input data is invalid
- `DeserializationError` - If map creation fails

### Utility Functions

#### `serializeFunctionSafe(func: Function): SerializedFunction | undefined`

Safely serialize functions without `eval()` risks.

#### `deserializeFunctionSafe(data: SerializedFunction): Function | undefined`

Safely deserialize functions with validation.

---

### Supported Objects

| Category     | Supported Types                     |
| ------------ | ----------------------------------- |
| **Map**      | `ol/Map`                            |
| **View**     | `ol/View`                           |
| **Layers**   | `ol/layer/Tile`, `ol/layer/Vector`  |
| **Sources**  | `ol/source/OSM`, `ol/source/Vector` |
| **Features** | `ol/Feature` (with geometry)        |

---

## 🔒 Security Features

### Safe Function Serialization
- ❌ **No `eval()`**: Eliminates code injection risks
- ✅ **Function Registry**: Pre-approved function whitelist
- ✅ **Parser-based**: Safe function parsing and reconstruction

### Input Validation
- 🛡️ **Zod Schemas**: Runtime type validation  
- 🔍 **Data Sanitization**: Automatic data cleaning and fixing
- ⚠️ **Error Recovery**: Graceful handling of invalid data

### Error Handling
- 📊 **Structured Errors**: Detailed error context and suggestions
- 🔄 **Fallback Mechanisms**: Automatic recovery strategies
- 📝 **Comprehensive Logging**: Debug-friendly error messages

---

## 🏗️ Architecture

```
src/
├── common/              # Core utilities
│   ├── safe-functions.ts   # Secure function serialization
│   ├── error-handling.ts   # Error recovery system
│   ├── validation.ts       # Zod validation schemas
│   └── registry.ts         # Function registry
├── serializer/          # Serialization logic
│   ├── map.ts             # Map serialization
│   ├── view.ts            # View serialization
│   ├── layer.ts           # Layer serialization
│   └── source.ts          # Source serialization
├── dto/                 # Type definitions
│   └── *.ts               # Interface definitions
└── examples/            # Demo code
    └── demo.ts            # Usage examples
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run with coverage report
pnpm test:coverage

# Run tests in watch mode
pnpm test:ui
```

### Test Results
- **Total**: 59 tests, all passing ✅
- **Coverage**: 90%+ on core modules
- **Security**: No `eval()` usage detected
- **Validation**: All edge cases covered

---

## 🚀 Migration from v1.x

### Breaking Changes
- `eval()` removed - functions now use safe serialization
- Validation required - invalid data will throw errors
- Error handling changed - new error types with context

### Migration Steps
1. **Update imports**: Error classes now available from main package
2. **Add error handling**: Wrap deserialization in try-catch blocks  
3. **Review custom functions**: Ensure compatibility with safe serialization
4. **Test thoroughly**: Validate existing serialized data

```ts
// v1.x (deprecated)
const map = deserializeMap(data); // Risky, no validation

// v2.x (recommended)  
try {
  const map = deserializeMap(data); // Safe, validated
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Data validation failed:", error.message);
  }
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`pnpm test`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines
- 🧪 **Tests Required**: All new features must include tests
- 🔒 **Security First**: No `eval()` or unsafe practices
- 📝 **Documentation**: Update README for API changes
- 🎯 **TypeScript**: Maintain strict type safety

---

## � License

MIT License © 2025 [rgbcmy](https://github.com/rgbcmy)

This project uses [OpenLayers](https://openlayers.org/) which is licensed under the **BSD 2-Clause License**.

---

## 🙏 Acknowledgments

- [OpenLayers](https://openlayers.org/) - The amazing mapping library
- [Vite](https://vitejs.dev/) - Lightning fast build tool
- [Vitest](https://vitest.dev/) - Delightful testing framework
- [Zod](https://zod.dev/) - TypeScript-first schema validation

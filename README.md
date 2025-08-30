# openlayers-serializer

A utility library for **[OpenLayers](https://openlayers.org/)** that allows you to **serialize and deserialize map objects**.
Easily transfer map state, layers, views, and features between frontend and backend, or save and restore map configurations.

---

## ✨ Features

* 🔄 **Serialization**: Convert `ol.Map`, `ol.View`, `ol.layer.*`, `ol.source.*`, and `ol.Feature` into JSON
* 📦 **Deserialization**: Rebuild OpenLayers objects from JSON
* 🎯 Supports **Map**, **View**, **Layers**, **Sources**, and **Features**
* 💾 Perfect for **saving map configurations** or **data exchange**

---

## 📦 Installation

```bash
npm install openlayers-serializer
# or
yarn add openlayers-serializer
```

---

## 🚀 Usage Example

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

// Serialize map to JSON
const json = serializeMap(map);
console.log("Serialized:", json);

// Restore map from JSON
const restoredMap = deserializeMap(json);
console.log("Restored:", restoredMap);
```

---

## 📚 API Overview

### `serializeMap(map: Map): object`

Convert an OpenLayers `Map` instance into JSON.

### `deserializeMap(json: object): Map`

Rebuild an OpenLayers `Map` instance from JSON.

---

### Supported Objects

| Category     | Supported Types                     |
| ------------ | ----------------------------------- |
| **Map**      | `ol/Map`                            |
| **View**     | `ol/View`                           |
| **Layers**   | `ol/layer/Tile`, `ol/layer/Vector`  |
| **Sources**  | `ol/source/OSM`, `ol/source/Vector` |
| **Features** | `ol/Feature` (with geometry)        |

*(You can extend this table as support grows.)*

---

## 🛠️ Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/yourname/openlayers-serializer.git
cd openlayers-serializer
npm install
```

Run tests:

```bash
npm test
```

---

## 📚 License

MIT License © 2025 [Your Name](https://github.com/yourname)

This project uses [OpenLayers](https://openlayers.org/) which is licensed under the **BSD 2-Clause License**.

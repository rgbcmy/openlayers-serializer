/**
 * OpenLayers Serializer Library
 * A simple demo showcasing serialization and deserialization of OpenLayers maps
 */

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import 'ol/ol.css';

import { serializeMap, deserializeMap } from './serializer';

// Create a simple map
function createDemoMap(): Map {
  const map = new Map({
    target: 'mapContainer',
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

  map.set('name', 'Demo Map');
  map.set('id', 'demo-map-001');

  return map;
}

// Serialize map to JSON
function exportMapData(map: Map): string {
  try {
    const mapDto = serializeMap(map);
    return JSON.stringify(mapDto, null, 2);
  } catch (error) {
    console.error('Failed to serialize map:', error);
    throw error;
  }
}

// Deserialize map from JSON
function importMapData(jsonData: string): Map {
  try {
    const mapDto = JSON.parse(jsonData);
    return deserializeMap(mapDto);
  } catch (error) {
    console.error('Failed to deserialize map:', error);
    throw error;
  }
}

// Demo functions
let currentMap: Map | null = null;

function initDemo(): void {
  currentMap = createDemoMap();
  console.log('Demo map created successfully');
}

function exportDemo(): string | void {
  if (!currentMap) {
    console.warn('No map to export. Please initialize the demo first.');
    return;
  }
  
  try {
    const jsonData = exportMapData(currentMap);
    console.log('Map exported successfully:');
    console.log(jsonData);
    
    // Save to localStorage for demo purposes
    localStorage.setItem('openlayers-map-backup', jsonData);
    
    return jsonData;
  } catch (error) {
    console.error('Export failed:', error);
  }
}

function importDemo(): void {
  try {
    const jsonData = localStorage.getItem('openlayers-map-backup');
    if (!jsonData) {
      console.warn('No map data found in localStorage');
      return;
    }
    
    // Cleanup existing map
    if (currentMap) {
      currentMap.setTarget(undefined);
    }
    
    // Import new map
    currentMap = importMapData(jsonData);
    console.log('Map imported successfully');
    
  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Export functions for browser console usage
if (typeof window !== 'undefined') {
  (window as any).olSerializer = {
    initDemo,
    exportDemo,
    importDemo,
    createDemoMap,
    exportMapData,
    importMapData,
  };
  
  console.log('OpenLayers Serializer Demo loaded. Use olSerializer.initDemo() to start.');
}

// Auto-initialize for demo
if (typeof window !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDemo);
} else if (typeof window !== 'undefined') {
  initDemo();
}

export {
  createDemoMap,
  exportMapData,
  importMapData,
  initDemo,
  exportDemo,
  importDemo,
};

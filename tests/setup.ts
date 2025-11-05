/**
 * Vitest setup file
 * 测试环境初始化配置
 */

import { vi } from 'vitest';

// Mock ResizeObserver first (critical for OpenLayers)
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation((callback) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock DOM elements that OpenLayers might need
Object.defineProperty(window, 'HTMLCanvasElement', {
  value: class HTMLCanvasElement {
    getContext() {
      return {
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        arc: vi.fn(),
        closePath: vi.fn(),
        drawImage: vi.fn(),
        getImageData: vi.fn(() => ({ data: new Array(4) })),
        putImageData: vi.fn(),
        createImageData: vi.fn(() => ({ data: new Array(4) })),
        setTransform: vi.fn(),
        resetTransform: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        scale: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
      };
    }
    toDataURL() {
      return 'data:image/png;base64,test';
    }
    width = 100;
    height = 100;
  },
});

// Mock other DOM APIs that might be needed
(globalThis as any).URL = class URL {
  constructor(url: string) {
    this.href = url;
  }
  href: string;
  toString() {
    return this.href;
  }
  static createObjectURL = vi.fn(() => 'blob:test');
  static revokeObjectURL = vi.fn();
};

// Mock fetch for tests that might need it
(globalThis as any).fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console methods to avoid noise in test output (optional)
// global.console = {
//   ...console,
//   warn: vi.fn(),
//   error: vi.fn(),
// };

// Setup crypto.randomUUID for Node.js environment
if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
  };
}
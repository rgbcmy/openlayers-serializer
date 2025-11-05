/**
 * 使用 Zod 进行输入验证的模式定义
 * 为序列化数据提供类型安全和运行时验证
 */

import { z } from 'zod';

// 基础类型验证
export const SerializedFunctionSchema = z.object({
  type: z.enum(['registered', 'custom']),
  key: z.string().optional(),
  code: z.string().optional(),
  params: z.array(z.string()).optional(),
  body: z.string().optional(),
});

// View 验证模式
export const ViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('View'),
  center: z.tuple([z.number(), z.number()]),
  zoom: z.number().min(0).max(30),
  projection: z.string().default('EPSG:3857'),
  rotation: z.number().default(0),
  resolution: z.number().positive().optional(),
  resolutions: z.array(z.number().positive()).optional(),
  minResolution: z.number().min(0).optional(),
  maxResolution: z.number().positive().optional(),
  minZoom: z.number().min(0).optional(),
  maxZoom: z.number().max(30).optional(),
  extent: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
  constrainOnlyCenter: z.boolean().default(false),
  smoothExtentConstraint: z.boolean().default(true),
  smoothResolutionConstraint: z.boolean().default(true),
  showFullExtent: z.boolean().default(false),
  multiWorld: z.boolean().default(false),
  enableRotation: z.boolean().default(true),
  constrainRotation: z.union([z.boolean(), z.number()]).default(true),
});

// TileGrid 验证模式
export const TileGridSchema = z.object({
  extent: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
  minZoom: z.number().min(0).default(0),
  origin: z.tuple([z.number(), z.number()]).optional(),
  origins: z.array(z.tuple([z.number(), z.number()])).optional(),
  resolutions: z.array(z.number().positive()),
  sizes: z.array(z.tuple([z.number(), z.number()])).optional(),
  tileSize: z.union([z.number(), z.tuple([z.number(), z.number()])]).optional(),
  tileSizes: z.array(z.union([z.number(), z.tuple([z.number(), z.number()])])).optional(),
});

// Source 基础验证模式
export const BaseSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  attributions: z.union([z.array(z.string()), z.string()]).optional(),
  attributionsCollapsible: z.boolean().optional(),
  projection: z.string().optional(),
  wrapX: z.boolean().optional(),
  state: z.string().optional(),
  interpolate: z.boolean().optional(),
});

// XYZ Source 验证模式
export const XYZSourceSchema = BaseSourceSchema.extend({
  type: z.literal('XYZ'),
  cacheSize: z.number().positive().optional(),
  crossOrigin: z.string().optional(),
  opaque: z.boolean().optional(),
  reprojectionErrorThreshold: z.number().min(0).optional(),
  maxZoom: z.number().min(0).max(50).optional(),
  minZoom: z.number().min(0).optional(),
  maxResolution: z.number().positive().optional(),
  tileGrid: TileGridSchema.optional(),
  tileLoadFunction: SerializedFunctionSchema.optional(),
  tilePixelRatio: z.number().positive().optional(),
  tileSize: z.tuple([z.number(), z.number()]).optional(),
  gutter: z.number().min(0).optional(),
  tileUrlFunction: SerializedFunctionSchema.optional(),
  url: z.string().url().optional(),
  urls: z.array(z.string().url()).optional(),
  transition: z.number().min(0).optional(),
  zDirection: z.number().optional(),
});

// OSM Source 验证模式
export const OSMSourceSchema = BaseSourceSchema.extend({
  type: z.literal('OSM'),
  cacheSize: z.number().positive().optional(),
  crossOrigin: z.string().optional(),
  reprojectionErrorThreshold: z.number().min(0).optional(),
  maxZoom: z.number().min(0).max(50).optional(),
  url: z.string().url().optional(),
  wrapX: z.boolean().optional(),
  transition: z.number().min(0).optional(),
});

// Vector Source 验证模式
export const VectorSourceSchema = BaseSourceSchema.extend({
  type: z.literal('Vector'),
  features: z.array(z.any()).optional(), // TODO: 添加 Feature 验证模式
  format: z.string().optional(),
  loader: SerializedFunctionSchema.optional(),
  overlaps: z.boolean().optional(),
  strategy: SerializedFunctionSchema.optional(),
  url: z.string().url().optional(),
  urls: z.array(z.string().url()).optional(),
  useSpatialIndex: z.boolean().optional(),
  wrapX: z.boolean().optional(),
});

// Image Static Source 验证模式
export const ImageStaticSourceSchema = BaseSourceSchema.extend({
  type: z.literal('ImageStatic'),
  url: z.string().url(),
  imageExtent: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  crossOrigin: z.string().optional(),
  imageLoadFunction: SerializedFunctionSchema.optional(),
  imageSmoothing: z.boolean().optional(),
});

// 统一的 Source 验证模式
export const SourceSchema = z.discriminatedUnion('type', [
  XYZSourceSchema,
  OSMSourceSchema,
  VectorSourceSchema,
  ImageStaticSourceSchema,
  // 可以继续添加其他 Source 类型
]);

// Layer 基础验证模式
export const BaseLayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  className: z.string().optional(),
  opacity: z.number().min(0).max(1).default(1),
  visible: z.boolean().default(true),
  extent: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
  minResolution: z.number().min(0).default(0),
  maxResolution: z.number().positive().optional(),
  minZoom: z.number().min(0).optional(),
  maxZoom: z.number().max(50).optional(),
  zIndex: z.number().optional(),
  background: z.string().optional(),
  properties: z.record(z.string(), z.any()).optional(),
});

// Tile Layer 验证模式
export const TileLayerSchema = BaseLayerSchema.extend({
  type: z.literal('Tile'),
  source: SourceSchema,
  useInterimTilesOnError: z.boolean().optional(),
  preload: z.number().min(0).optional(),
});

// Vector Layer 验证模式
export const VectorLayerSchema = BaseLayerSchema.extend({
  type: z.literal('Vector'),
  source: VectorSourceSchema,
  declutter: z.boolean().optional(),
  renderBuffer: z.number().min(0).optional(),
  renderOrder: SerializedFunctionSchema.optional(),
  style: z.any().optional(), // TODO: 添加 Style 验证模式
  updateWhileAnimating: z.boolean().optional(),
  updateWhileInteracting: z.boolean().optional(),
});

// 统一的 Layer 验证模式
export const LayerSchema = z.discriminatedUnion('type', [
  TileLayerSchema,
  VectorLayerSchema,
  // 可以继续添加其他 Layer 类型
]);

// Map 验证模式
export const MapSchema = z.object({
  id: z.string(),
  name: z.string(),
  controls: z.array(z.any()).default([]),
  interactions: z.array(z.any()).default([]),
  layers: z.array(LayerSchema),
  maxTilesLoading: z.number().positive().optional(),
  moveTolerance: z.number().min(0).optional(),
  overlays: z.array(z.any()).default([]),
  target: z.string(),
  view: ViewSchema,
});

// 验证函数
export function validateMapData(data: unknown): z.infer<typeof MapSchema> {
  try {
    return MapSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Map validation failed:', error.issues);
      throw new Error(`Invalid map data: ${error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
}

export function validateViewData(data: unknown): z.infer<typeof ViewSchema> {
  try {
    return ViewSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('View validation failed:', error.issues);
      throw new Error(`Invalid view data: ${error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
}

export function validateLayerData(data: unknown): z.infer<typeof LayerSchema> {
  try {
    return LayerSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Layer validation failed:', error.issues);
      throw new Error(`Invalid layer data: ${error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
}

export function validateSourceData(data: unknown): z.infer<typeof SourceSchema> {
  try {
    return SourceSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Source validation failed:', error.issues);
      throw new Error(`Invalid source data: ${error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
}

// 安全验证函数（不抛出异常）
export function safeValidateMapData(data: unknown): { success: true; data: z.infer<typeof MapSchema> } | { success: false; error: string } {
  try {
    const validData = MapSchema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: String(error) };
  }
}

// 导出类型
export type ValidatedMap = z.infer<typeof MapSchema>;
export type ValidatedView = z.infer<typeof ViewSchema>;
export type ValidatedLayer = z.infer<typeof LayerSchema>;
export type ValidatedSource = z.infer<typeof SourceSchema>;
import Style, { type StyleFunction, type StyleLike } from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import type { ISerializedCircle, ISerializedStyle, ISerializedFill, ISerializedIcon, ISerializedStroke, ISerializedText } from '../dto/style';
import type { FlatStyle, FlatStyleLike, Rule } from 'ol/style/flat';
// Add missing FlatStyle import
import type { FeatureLike } from 'ol/Feature';



function isValid<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
//兼容StyleLike 和 FlatStyleLike 目前只实现了StyleLike
// 序列化 
export function serializeStyle(style: Style): ISerializedStyle {
  const fill: Fill | null = style.getFill();
  const stroke: Stroke | null = style.getStroke();
  const image = style.getImage();
  const text: Text | null = style.getText();

  let imageCircle: ISerializedCircle | null = null;
  let imageIcon: ISerializedIcon | null = null;

  if (image instanceof CircleStyle) {
    imageCircle = {
      radius: image.getRadius(),
      fill: image.getFill() ? { color: image.getFill()?.getColor() as string ?? null } : null,
      stroke: image.getStroke()
        ? serializeStroke(image.getStroke())
        : null,
    };
  } else if (image instanceof Icon) {
    imageIcon = {
      src: image.getSrc() ?? null,
      scale: ((image.getScale() ?? null) as any),
      rotation: image.getRotation() ?? null,
      opacity: image.getOpacity() ?? null,
      anchor: image.getAnchor() ?? null,
      //   anchorXUnits: image.getAnchorXUnits() ?? null,
      //   anchorYUnits: image.getAnchorYUnits() ?? null,
    };
  }

  return {
    fill: fill ? { color: fill.getColor() as string ?? null } : null,
    stroke: stroke
      ? serializeStroke(stroke)
      : null,
    imageCircle,
    imageIcon,
    text: text
      ? serializeText(text)
      : null,
  };
}

// 反序列化
export function deserializeStyle(data: ISerializedStyle | null): Style | null {
  if (!data) return null;
  const fill = isValid(data.fill?.color) ? new Fill({ color: data.fill.color! }) : undefined;

  const stroke = isValid(data.stroke?.color)
    ? new Stroke({
      color: data.stroke.color!,
      width: data.stroke.width ?? undefined,
      lineDash: data.stroke.lineDash ?? undefined,
    })
    : undefined;

  let image = undefined;
  if (data.imageCircle) {
    image = new CircleStyle({
      radius: data.imageCircle.radius,
      fill: isValid(data.imageCircle.fill?.color) ? new Fill({ color: data.imageCircle.fill.color! }) : undefined,
      stroke: isValid(data.imageCircle.stroke?.color)
        ? new Stroke({
          color: data.imageCircle.stroke.color!,
          width: data.imageCircle.stroke.width ?? undefined,
          lineDash: data.imageCircle.stroke.lineDash ?? undefined,
        })
        : undefined,
    });
  } else if (data.imageIcon) {
    image = new Icon({
      src: data.imageIcon.src ?? undefined,
      scale: data.imageIcon.scale ?? undefined,
      rotation: data.imageIcon.rotation ?? undefined,
      opacity: data.imageIcon.opacity ?? undefined,
      anchor: data.imageIcon.anchor ?? undefined,
      //anchorXUnits: data.imageIcon.anchorXUnits ?? undefined,
      //anchorYUnits: data.imageIcon.anchorYUnits ?? undefined,
    });
  }

  const text = data.text
    ? new Text({
      font: data.text.font ?? undefined,
      text: data.text.text ?? undefined,
      offsetX: data.text.offsetX ?? undefined,
      offsetY: data.text.offsetY ?? undefined,
      fill: isValid(data.text.fill?.color) ? new Fill({ color: data.text.fill.color! }) : undefined,
      stroke: isValid(data.text.stroke?.color)
        ? new Stroke({
          color: data.text.stroke.color!,
          width: data.text.stroke.width ?? undefined,
          lineDash: data.text.stroke.lineDash ?? undefined,
        })
        : undefined,
      scale: data.text.scale ?? undefined,
      rotation: data.text.rotation ?? undefined,
    })
    : undefined;

  return new Style({ fill, stroke, image, text });
}


function serializeStroke(stroke: Stroke | null): ISerializedStroke | null {
  if (!stroke) return null;

  return {
    color: stroke.getColor() as string ?? null,
    lineCap: stroke.getLineCap() ?? null,
    lineJoin: stroke.getLineJoin() ?? null,
    lineDash: stroke.getLineDash?.() ?? null,
    lineDashOffset: stroke.getLineDashOffset() ?? null,
    miterLimit: stroke.getMiterLimit() ?? null,
    width: stroke.getWidth() ?? null,
  };
}

function deserializeStroke(data: ISerializedStroke | null): Stroke | undefined {
  if (!data || !isValid(data.color)) return undefined;

  return new Stroke({
    color: data.color!,
    width: data.width ?? undefined,
    lineCap: data.lineCap ?? undefined,
    lineJoin: data.lineJoin ?? undefined,
    lineDash: data.lineDash ?? undefined,
    lineDashOffset: data.lineDashOffset ?? undefined,
    miterLimit: data.miterLimit ?? undefined,
  });
}

function serializeText(text: Text | null): ISerializedText | null {
  if (!text) return null;

  return {
    font: text.getFont() ?? null,
    text: text.getText() ?? null,
    offsetX: text.getOffsetX() ?? null,
    offsetY: text.getOffsetY() ?? null,
    fill: text.getFill() ? { color: text.getFill()?.getColor() as string ?? null } : null,
    stroke: serializeStroke(text.getStroke()),
    scale: (text.getScale() ?? null) as any,
    rotation: text.getRotation() ?? null,
  };
}

function deserializeText(data: ISerializedText | null): Text | undefined {
  if (!data) return undefined;

  return new Text({
    font: data.font ?? undefined,
    text: data.text ?? undefined,
    offsetX: data.offsetX ?? undefined,
    offsetY: data.offsetY ?? undefined,
    fill: isValid(data.fill?.color) ? new Fill({ color: data.fill.color! }) : undefined,
    stroke: deserializeStroke(data.stroke),
    scale: data.scale ?? undefined,
    rotation: data.rotation ?? undefined,
  });
}


export function serializeLayerStyle(style: StyleLike | FlatStyleLike) {

  if (isStyle(style)) {
    return serializeStyle(style);
  } else if (isStyleArray(style)) {
    return style.map(serializeStyle);
  } else if (isStyleFunction(style)) {
    //return 'StyleFunction';
    //ToDo: 需要处理 StyleFunction 的序列化
    return eval(`(${(style)})`)
  } else if (isFlatStyle(style)) {
    return style;
  }
  if (isFlatStyleArray(style)) {
    //return 'FlatStyle[]'; 
    return style;
  } else if (isRuleArray(style)) {
    return style;
  } else {
    throw new Error(`Unsupported style type!`);
  }
}


export function deserializeLayerStyle(style: any): StyleLike | FlatStyleLike | null {
  if (!style) return null;

  // 单个序列化 Style
  if (isSerializedStyle(style)) {
    return deserializeStyle(style);
  }

  // Style 数组
  if (Array.isArray(style) && style.every(isSerializedStyle)) {
    return style.map(deserializeStyle).filter(isValid);
  }

  // StyleFunction 字符串
  if (typeof style === 'string' && style.startsWith('function')) {
    try {
      // eslint-disable-next-line no-eval
      const fn: StyleFunction = eval(`(${style})`);
      if (typeof fn === 'function') return fn;
    } catch (err) {
      console.error('Failed to eval StyleFunction:', err);
      return null;
    }
  }

  // FlatStyle / FlatStyle[]
  if (isFlatStyle(style) || isFlatStyleArray(style) || isRuleArray(style)) {
    return style;
  }

  console.warn('Unknown style format:', style);
  return null;
}

// 类型保护，判断对象是否是序列化后的 Style
function isSerializedStyle(value: any): value is ISerializedStyle {
  return value && typeof value === 'object' && ('fill' in value || 'stroke' in value || 'imageCircle' in value || 'imageIcon' in value || 'text' in value);
}


// 判断是否是单个 Style 实例
export function isStyle(value: any): value is Style {
  return value instanceof Style;
}

// 判断是否是 Style[]
export function isStyleArray(value: any): value is Style[] {
  return Array.isArray(value) && value.every(v => v instanceof Style);
}

// 判断是否是 StyleFunction
export function isStyleFunction(value: any): value is StyleFunction {
  return typeof value === 'function';
}

// 判断是否是单个 FlatStyle
export function isFlatStyle(value: any): value is FlatStyle {
  return value != null
    && typeof value === 'object'
    && !(value instanceof Style)
    && !Array.isArray(value)
    && !('style' in value); // 不是规则对象
}

// 判断是否是 FlatStyle[]
export function isFlatStyleArray(value: any): value is FlatStyle[] {
  return Array.isArray(value) && value.every(v => isFlatStyle(v));
}

// 判断是否是 Rule[]
export function isRuleArray(value: any): value is Rule[] {
  return Array.isArray(value) && value.every(v => v && typeof v === 'object' && 'style' in v);
}


// 综合判断
export function detectStyleType(value: any): string {
  if (isStyle(value)) return 'Style';
  if (isStyleArray(value)) return 'Style[]';
  if (isStyleFunction(value)) return 'StyleFunction';
  if (isFlatStyle(value)) return 'FlatStyle';
  if (isFlatStyleArray(value)) return 'FlatStyle[]';
  if (isRuleArray(value)) return 'Rule[]';
  return 'Unknown';
}
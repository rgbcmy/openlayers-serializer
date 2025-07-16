import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';

export interface SerializedFill {
  color: string | null;
}

export interface SerializedStroke {
  color: string | null;
  width: number | null;
  lineDash: number[] | null;
}

export interface SerializedCircle {
  radius: number;
  fill: SerializedFill | null;
  stroke: SerializedStroke | null;
}

export interface SerializedIcon {
  src: string | null;
  scale: number|[number,number] | null;
  rotation: number | null;
  opacity: number | null;
  anchor: number[] | null;
  //这两个参数暂时没有get函数
//   anchorXUnits: string | null;
//   anchorYUnits: string | null;
  // 更多 Icon 相关参数可按需添加
}

export interface SerializedText {
  font: string | null;
  text: string | null;
  offsetX: number | null;
  offsetY: number | null;
  fill: SerializedFill | null;
  stroke: SerializedStroke | null;
  scale: number | null;
  rotation: number | null;
  // 更多 Text 相关参数也可继续拓展
}

export interface SerializedStyle {
  fill: SerializedFill | null;
  stroke: SerializedStroke | null;
  imageCircle: SerializedCircle | null;
  imageIcon: SerializedIcon | null;
  text: SerializedText | null;
}

function isValid<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// 序列化
export function serializeStyle(style: Style): SerializedStyle {
  const fill = style.getFill();
  const stroke = style.getStroke();
  const image = style.getImage();
  const text = style.getText();

  let imageCircle: SerializedCircle | null = null;
  let imageIcon: SerializedIcon | null = null;

  if (image instanceof CircleStyle) {
    imageCircle = {
      radius: image.getRadius(),
      fill: image.getFill() ? { color: image.getFill()?.getColor() as string ?? null } : null,
      stroke: image.getStroke()
        ? {
            color: image.getStroke()?.getColor() as string ?? null,
            width: image.getStroke()?.getWidth() ?? null,
            lineDash: image.getStroke()?.getLineDash?.() ?? null,
          }
        : null,
    };
  } else if (image instanceof Icon) {
    imageIcon = {
      src: image.getSrc() ?? null,
      scale: ((image.getScale() ?? null ) as any),
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
      ? {
          color: stroke.getColor() as string ?? null,
          width: stroke.getWidth() ?? null,
          lineDash: stroke.getLineDash?.() ?? null,
        }
      : null,
    imageCircle,
    imageIcon,
    text: text
      ? {
          font: text.getFont() ?? null,
          text: text.getText() ?? null,
          offsetX: text.getOffsetX() ?? null,
          offsetY: text.getOffsetY() ?? null,
          fill: text.getFill() ? { color: text.getFill()?.getColor() as string ?? null } : null,
          stroke: text.getStroke()
            ? {
                color: text.getStroke()?.getColor() as string ?? null,
                width: text.getStroke()?.getWidth() ?? null,
                lineDash: text.getStroke()?.getLineDash?.() ?? null,
              }
            : null,
          scale: text.getScale() ?? null,
          rotation: text.getRotation() ?? null,
        }
      : null,
  };
}

// 反序列化
export function deserializeStyle(data: SerializedStyle): Style {
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

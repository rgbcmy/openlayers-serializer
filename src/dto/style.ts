export interface ISerializedFill {
  color: string | null;
}

export interface ISerializedStroke {
  color: string | null;
  lineCap: CanvasLineCap | null;
  lineJoin: CanvasLineJoin | null;
  lineDash: number[] | null;
  lineDashOffset: number | null;
  miterLimit: number | null;
  width: number | null;
}

export interface ISerializedCircle {
  radius: number;
  fill: ISerializedFill | null;
  stroke: ISerializedStroke | null;
}

export interface ISerializedIcon {
  src: string | null;
  scale: number | [number, number] | null;
  rotation: number | null;
  opacity: number | null;
  anchor: number[] | null;
  //这两个参数暂时没有get函数
  //   anchorXUnits: string | null;
  //   anchorYUnits: string | null;
  // 更多 Icon 相关参数可按需添加
}

export interface ISerializedText {
  font: string | null;
  text: string | string[] | null;
  offsetX: number | null;
  offsetY: number | null;
  fill: ISerializedFill | null;
  stroke: ISerializedStroke | null;
  scale: number | [number, number] | null;
  rotation: number | null;
  // 更多 Text 相关参数也可继续拓展
}

export interface ISerializedStyle {
  fill: ISerializedFill | null;
  stroke: ISerializedStroke | null;
  imageCircle: ISerializedCircle | null;
  imageIcon: ISerializedIcon | null;
  text: ISerializedText | null;
}
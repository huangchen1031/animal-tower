import type { Animals } from "./const";

// 动物形状
export interface AnimalShape {
  name: string;
  shape: string[];
  size: string;
  image?: string;
}

// 关卡
export interface Level<T> {
  star: number;
  animals: Array<T>;
  shape: string[];
  size: string;
  color: string;
}

// 位置信息
export interface Pos {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

// 位置样式
export interface PosStyle {
  top: string;
  left: string;
}

// 动物放置信息
export interface AnimalPos {
  position: PosStyle;
  animal: Animals;
}
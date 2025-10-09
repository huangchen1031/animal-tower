import type { Pos, PosStyle } from '@/data/types';

export const computeShape = (origin: string[]): number[][] => {
  const result: number[][] = [];

  origin.forEach((coordinate) => {
    const [x, y] = coordinate.split(',');
    const row = result[Number(x)] || [];
    row.push(Number(y));
    result[Number(x)] = row;
  });

  return result;
};

// 单元格基础大小
export const BASE = 50;

// 获取cell坐标
export const getCellPosition = (cell: string) => {
  const [x, y] = cell.split(',');
  return {
    x: Number(x),
    y: Number(y),
  };
};

// 获取cell位置
export const getCellLeftTop = (cell: string, top: number = 0, left: number = 0): PosStyle => {
  const { x, y } = getCellPosition(cell);
  return {
    left: `${y * BASE + left}px`,
    top: `${x * BASE + top}px`,
  };
};

// 获取shape宽高
export const getShapeWidthHeight = (cell: string) => {
  const { x, y } = getCellPosition(cell);
  return {
    width: `${Number(x) * BASE}px`,
    height: `${Number(y) * BASE}px`,
  };
};

// 获取cell完整位置
export const getCellFullPosition = (top: number = 0, left: number = 0, cell: string): Pos => {
  const { x, y } = getCellPosition(cell);
  return {
    top: x * BASE + top,
    left: y * BASE + left,
    right: y * BASE + left + BASE,
    bottom: x * BASE + top + BASE,
  };
};

// 计算所有单元坐标
export const getShapeCellsPosition = (
  top: number = 0,
  left: number = 0,
  shape: string[] = [],
): Pos[] => {
  return shape?.map((cell) => getCellFullPosition(top, left, cell));
};

// 计算单元格交集
export const getCellOverlap = (origin: Pos[], target: Pos[]): number[] => {
  const res: number[] = [];

  target.forEach((pos, index) => {
    origin.forEach((cell) => {
      if (
        cell.top > pos.top - 25 &&
        cell.top < pos.top + 25 &&
        cell.left > pos.left - 25 &&
        cell.left < pos.left + 25 &&
        !res.includes(index)
      ) {
        res.push(index);
      }
    });
  });

  return res;
};

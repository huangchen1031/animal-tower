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

// 获取cell左上角坐标
export const getCellZeroPos = (cell: string, origin: string): string => {
  const { x, y } = getCellPosition(cell);
  const { x: ox, y: oy } = getCellPosition(origin);
  return `${x - ox},${y - oy}`;
}

// 获取cell位置
export const getCellLeftTop = (cell: string, top: number = 0, left: number = 0): PosStyle => {
  const { x, y } = getCellPosition(cell);
  return {
    left: `${y * BASE + left}px`,
    top: `${x * BASE + top}px`,
  };
};

// 获取shape宽高
export const getShapeWidthHeight = (cell: string, rotate: number = 0) => {
  const { x, y } = getCellPosition(cell);
  const ox = rotate % 2 === 0 ? x : y; // 旋转后宽度对应原高度
  const oy = rotate % 2 === 0 ? y : x; // 旋转后高度对应原宽度
  return {
    width: `${Number(ox) * BASE}px`,
    height: `${Number(oy) * BASE}px`,
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

// 计算单元格旋转后坐标
export const getRotatedShape = (shape: string[], rotate: number, flip: boolean): string[] => {
  let rotatedShape = shape.map((cell) => {
    let { x: newX, y: newY } = getCellPosition(cell);

    // 旋转
    for (let i = 0; i < rotate; i++) {
      const temp = newX;
      newX = newY;
      newY = -temp;
    }

    return { x: newX, y: newY };
  });

  // 翻转
  if (flip) {
    rotatedShape = rotatedShape.map(({ x, y }) => ({ x, y: -y }));
  }

  // 调整坐标使其在第一象限
  const minX = Math.min(...rotatedShape.map(({ x }) => x));
  const minY = Math.min(...rotatedShape.map(({ y }) => y));

  const adjustedShape = rotatedShape.map(({ x, y }) => ({
    x: x - minX,
    y: y - minY,
  }));

  // 先按x排序，再按y排序，最后转换回字符串形式
  return adjustedShape.sort(
    (a, b) => a.x - b.x || a.y - b.y
  ).map(({ x, y }) => `${x},${y}`);
}
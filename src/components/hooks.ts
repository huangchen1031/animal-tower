import { getShapeCellsPosition } from '@/utils';
import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue';

// 键盘事件
export const useKeyDown = (selected: Ref<boolean, boolean>) => {
  // 变形参数
  const rotate = ref(0);
  const rotateX = ref(0);

  // 键盘事件处理函数
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!selected.value) return;

    // 使用 event.key 是最新标准[1,4](@ref)
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        rotateX.value -= 180;
        break;
      case 'ArrowDown':
        event.preventDefault();
        rotateX.value += 180;
        break;
      case 'ArrowLeft':
        event.preventDefault();
        rotate.value -= 90;
        break;
      case 'ArrowRight':
        event.preventDefault();
        rotate.value += 90;
        break;
      default:
        return; // 非方向键不处理
    }
  };

  // 组件挂载时添加事件监听
  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  return {
    rotate,
    rotateX,
  };
};

let offsetX = 0;
let offsetY = 0;

// 拖拽事件
export const useDraggable = (dragArea: Ref<HTMLDivElement, HTMLDivElement>, shape: string[], name: string) => {
  // 是否拖拽中
  const isDragging = ref(false);

  // 拖拽坐标
  const top = ref(0);
  const left = ref(0);

  // 坐标组
  const cellsPosition = computed(() => {
    return getShapeCellsPosition(top.value, left.value, shape);
  });

  const onDragStart = (event: DragEvent) => {
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('animal', name);
    isDragging.value = true;

    const { clientX, clientY } = event;
    const { top, left } = dragArea.value.getBoundingClientRect();
    
    offsetX = clientX - left;
    offsetY = clientY - top;
  };

  const onDragEnd = () => {
    isDragging.value = false;
  };

  const onDrag = (event: DragEvent) => {
    if (!isDragging.value) return;

    const { clientX, clientY } = event;
    if (clientX === 0 && clientY === 0) return;

    left.value = clientX - offsetX;
    top.value = clientY - offsetY;
  };

  return {
    isDragging,
    onDragStart,
    onDragEnd,
    onDrag,
    cellsPosition,
    top,
    left,
  };
};

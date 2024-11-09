export const calculatePositionOfMatch = (
  rowIndex,
  columnIndex,
  { canvasPadding, rowHeight, columnWidth, offsetX = 0, offsetY = 0 }
) => {
  return {
    x: columnIndex * columnWidth + canvasPadding + offsetX,
    y: rowIndex * rowHeight + canvasPadding + offsetY,
  };
};

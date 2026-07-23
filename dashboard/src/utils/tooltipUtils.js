export function getPinnedTooltipPosition(
  containerRect,
  clientX,
  clientY,
  tooltipWidth,
  tooltipHeight,
  gap = 15,
  verticalOffset = 40
) {
  const xPos = clientX - containerRect.left;
  const yPos = clientY - containerRect.top;

  const overflowsRight = xPos + gap + tooltipWidth > containerRect.width;
  const left = overflowsRight
    ? Math.max(0, xPos - gap - tooltipWidth)
    : xPos + gap;

  const top = Math.min(
    Math.max(0, yPos - verticalOffset),
    Math.max(0, containerRect.height - tooltipHeight)
  );

  return { left, top };
}

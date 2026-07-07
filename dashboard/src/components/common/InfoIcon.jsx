// components/common/InfoIcon.jsx

import { useState, useRef, useEffect } from 'react';
import { PALETTE } from '../../utils/theme';

const TOOLTIP_HEIGHT_ESTIMATE = 70; // rough height incl. padding, for the space check
const DEFAULT_TOOLTIP_WIDTH = 220;
const MIN_TOOLTIP_WIDTH = 120;
const GAP = 8;

const STICKY_HEADER_HEIGHT = 56;

export default function InfoIcon({ text, size = 18 }) {
  const [hovered, setHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [openBelow, setOpenBelow] = useState(false);
  const [tooltipLeft, setTooltipLeft] = useState(null);       // px, relative to icon's left edge
  const [tooltipWidth, setTooltipWidth] = useState(DEFAULT_TOOLTIP_WIDTH);
  const iconRef = useRef(null);

  // Handle clicking outside to unpin the tooltip
  useEffect(() => {
    if (!isPinned) return;

    const handleOutsideClick = (event) => {
      if (iconRef.current && !iconRef.current.contains(event.target)) {
        setIsPinned(false);
        setHovered(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isPinned]);

  if (!text) return null;

  const calculatePosition = () => {
    if (!iconRef.current) return;

    const rect = iconRef.current.getBoundingClientRect();

    const boundaryEl = iconRef.current.closest('[data-tooltip-boundary]');
    const boundaryRect = boundaryEl
      ? boundaryEl.getBoundingClientRect()
      : { left: 0, right: document.documentElement.clientWidth, top: 0, bottom: window.innerHeight };

    const availableWidth = boundaryRect.right - boundaryRect.left - GAP * 2;
    const width = Math.min(DEFAULT_TOOLTIP_WIDTH, Math.max(MIN_TOOLTIP_WIDTH, availableWidth));
    setTooltipWidth(width);

    // Horizontal: center on the icon, then clamp within the card's own edges.
    const iconCenter = rect.left + rect.width / 2;
    let desiredLeft = iconCenter - width / 2;
    const minLeft = boundaryRect.left + GAP;
    const maxLeft = Math.max(minLeft, boundaryRect.right - GAP - width);
    desiredLeft = Math.min(Math.max(desiredLeft, minLeft), maxLeft);
    setTooltipLeft(desiredLeft - rect.left);

    const spaceBelowInCard = boundaryRect.bottom - rect.bottom;
    const spaceAboveInCard = rect.top - boundaryRect.top;
    const spaceAboveHeader = rect.top - STICKY_HEADER_HEIGHT;

    const fitsBelow = spaceBelowInCard >= TOOLTIP_HEIGHT_ESTIMATE + GAP;
    const fitsAbove = Math.min(spaceAboveInCard, spaceAboveHeader) >= TOOLTIP_HEIGHT_ESTIMATE + GAP;

    setOpenBelow(fitsBelow || !fitsAbove);
  };

  const handleMouseEnter = () => {
    calculatePosition();
    setHovered(true);
  };

  const handleMouseLeave = () => {
    // Only remove the hover state if the tooltip isn't pinned by a click
    if (!isPinned) {
      setHovered(false);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation(); // Avoid immediately triggering the outside click trigger
    calculatePosition();
    setIsPinned((prev) => !prev);
    setHovered(true);
  };

  // The tooltip displays if either hovered or pinned
  const showTooltip = hovered || isPinned;

  return (
    <span
      ref={iconRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 6,
        height: size + 6,
        borderRadius: '50%',
        cursor: 'pointer',
        flexShrink: 0,
        color: showTooltip ? PALETTE.accent : PALETTE.muted,
        background: showTooltip ? PALETTE.accentSoft : 'transparent',
        fontSize: size,
        lineHeight: 1,
        transition: 'color 0.15s ease, background 0.15s ease',
      }}
    >
      ℹ️

      {showTooltip && (
        <div style={{
          position: 'absolute',
          ...(openBelow
            ? { top: `calc(100% + ${GAP}px)` }
            : { bottom: `calc(100% + ${GAP}px)` }),
          left: tooltipLeft ?? '50%',
          transform: tooltipLeft === null ? 'translateX(-50%)' : 'none',
          width: tooltipWidth,
          background: PALETTE.surface,
          border: `1px solid ${PALETTE.border}`,
          borderRadius: 8,
          padding: '8px 10px',
          zIndex: 300,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 17,
            fontWeight: 400,
            color: PALETTE.text,
            lineHeight: 1.4,
            whiteSpace: 'normal',
          }}>
            {text}
          </span>
        </div>
      )}
    </span>
  );
}
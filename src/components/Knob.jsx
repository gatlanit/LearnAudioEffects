import React, { useRef, useState, useEffect } from 'react';
import './Knob.css';

/** Map a value in [min,max] to a rotation in [‑132°, 132°] */
const valToDeg = (v, min, max) => ((v - min) / (max - min)) * 264 - 132;
/** Map a rotation in [‑132°,132°] back to the value range */
const degToVal = (deg, min, max) => ((deg + 132) / 264) * (max - min) + min;
const clamp     = (x, lo, hi) => Math.min(Math.max(x, lo), hi);

export default function Knob({
  min = 0,
  max = 1,
  value = 0.5,
  size = 100,
  color = '#23F376',
  label = '',
  onChange,
}) {
  const [val, setVal] = useState(value);
  const rotRef   = useRef(valToDeg(value, min, max));   // current rotation
  const startY   = useRef(0);                           // pointer start‑Y

  /* Keep rotation in sync if parent changes `value` prop */
  useEffect(() => { rotRef.current = valToDeg(value, min, max); }, [value]);

  /* ───────── pointer handlers ───────── */
  const handlePointerDown = (e) => {
    startY.current = e.clientY;
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup',   handleUp);
  };

  const handleMove = (e) => {
    const dy = e.clientY - startY.current;
    if (dy === 0) return;

    const nextDeg  = clamp(rotRef.current - dy, -132, 132);
    const nextVal  = clamp(degToVal(nextDeg, min, max), min, max);

    rotRef.current = nextDeg;
    startY.current = e.clientY;
    setVal(nextVal);
    onChange?.(nextVal);
  };

  const handleUp = () => {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup',   handleUp);
  };

  /* SVG dash offset for arc fill */
  const dashOffset = 184 - 184 * ((rotRef.current + 132) / 264);

  return (
    <div
      className="knob style2"
      style={{ '--knob-color': color, width: size + 40 }}
    >
      <div
        className="knob-dial"
        style={{ width: size, height: size }}
        onPointerDown={handlePointerDown}
      >
        <div
          className="dial-grip"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            transform: `translate(-50%,-50%) rotate(${rotRef.current}deg)`,
          }}
        />
        <svg className="dial-svg" viewBox="0 0 100 100">
          <path
            className="track"
            d="M20,76 A40 40 0 1 1 80 76"
          />
          <path
            className="value"
            d="M20,76 A40 40 0 1 1 80 76"
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
      </div>
      {label && <div className="knob-label">{label}</div>}
    </div>
  );
}
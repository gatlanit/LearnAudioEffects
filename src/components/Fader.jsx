import React from 'react';
import './Fader.css';

export default function Fader({
  min = 0,
  max = 100,
  value = 50,
  label = 'Volume',
  onChange,
}) {
  return (
    <div className="fader">
      <input
        type="range"
        orient="vertical"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
      <label>{label}</label>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import Knob from './Knob';
import Fader from './Fader';

export default function ParametersRow({ config = [], gap = '1rem', onChange }) {
  const initialValues = Object.fromEntries(
    config.map(({ id, default: def = 0 }) => [id, def])
  );
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    onChange?.(values);
  }, [values, onChange]);

  const updateValue = (id, v) => {
    setValues(prev => ({ ...prev, [id]: v }));
  };

  return (
    <div style={{ display: 'flex', gap, alignItems: 'flex-end' }}>
      {config.map(({ id, type, label, min = 0, max = 1, color, height }) => {
        const commonProps = {
          label,
          min,
          max,
          value: values[id],
          onChange: v => updateValue(id, v),
        };

        if (type === 'knob') {
          return <Knob key={id} color={color ?? '#333'} {...commonProps} />;
        }

        if (type === 'fader') {
          return <Fader key={id} height={height || 120} {...commonProps} />;
        }

        return null;
      })}
    </div>
  );
}
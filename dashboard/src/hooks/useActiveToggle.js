import { useCallback, useMemo, useState } from 'react';

export default function useActiveToggle(initialState = {}) {
  const [active, setActive] = useState(initialState);

  const hasSelection = useMemo(
    () => Object.values(active).some(Boolean),
    [active]
  );

  const toggle = useCallback((key) => {
    setActive((prev) => {
      const activeKeys = Object.keys(prev).filter((k) => prev[k]);
      if (activeKeys.length === 0) {
        return { [key]: true };
      }
      if (prev[key]) {
        const next = { ...prev, [key]: false };
        return Object.values(next).some(Boolean) ? next : {};
      }
      return { ...prev, [key]: true };
    });
  }, []);

  return { active, hasSelection, toggle };
}

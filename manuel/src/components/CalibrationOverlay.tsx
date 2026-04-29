import { useState } from 'react';
import styles from './CalibrationOverlay.module.css';

// 9 points: 3×3 grid at 10/50/90% of viewport
const POINTS = [
  { x: 10, y: 10 }, { x: 50, y: 10 }, { x: 90, y: 10 },
  { x: 10, y: 50 }, { x: 50, y: 50 }, { x: 90, y: 50 },
  { x: 10, y: 90 }, { x: 50, y: 90 }, { x: 90, y: 90 },
];

interface Props {
  onDone: () => void;
}

export default function CalibrationOverlay({ onDone }: Props) {
  const [clicked, setClicked] = useState<Set<number>>(new Set());
  const [active, setActive] = useState(0);

  const handleClick = (index: number) => {
    if (index !== active) return;
    const next = new Set(clicked);
    next.add(index);
    setClicked(next);
    if (next.size === POINTS.length) {
      setTimeout(onDone, 300);
    } else {
      setActive(index + 1);
    }
  };

  return (
    <div className={styles.overlay}>
      <p className={styles.instruction}>
        Look at each dot and click it — {POINTS.length - clicked.size} remaining
      </p>

      {POINTS.map((pt, i) => (
        <button
          key={i}
          className={`${styles.dot} ${i === active ? styles.dotActive : ''} ${clicked.has(i) ? styles.dotDone : ''}`}
          style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
          onClick={() => handleClick(i)}
          aria-label={`Calibration point ${i + 1}`}
        />
      ))}
    </div>
  );
}

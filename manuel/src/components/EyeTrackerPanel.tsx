import { useState } from 'react';
import { useEyeTracker } from '../hooks/useEyeTracker';
import CalibrationOverlay from './CalibrationOverlay';
import type { Mission } from './MissionCard';
import styles from './EyeTrackerPanel.module.css';

const ZONE_LABELS: Record<string, string> = {
  'mission-title': 'Title',
  'reward-text': 'Description',
  'reward-image': 'Image',
};
const REQUIRED_ZONES = ['mission-title', 'reward-text', 'reward-image'];

interface Props {
  currentMission: Mission;
  onMissionRead: () => void;
}

export default function EyeTrackerPanel({ currentMission, onMissionRead }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    isTracking,
    isCalibrating,
    isLoading,
    error,
    gazeX,
    gazeY,
    recordCount,
    zonesRead,
    allZonesRead,
    startTracking,
    beginTracking,
    stopTracking,
    exportCSV,
    clearData,
  } = useEyeTracker(currentMission, onMissionRead);

  return (
    <>
      {/* Calibration overlay */}
      {isCalibrating && <CalibrationOverlay onDone={beginTracking} />}

      {/* Gaze dot — no transition so it follows raw prediction instantly */}
      {isTracking && gazeX !== null && gazeY !== null && (
        <div
          className={styles.gazeDot}
          style={{ left: gazeX, top: gazeY }}
          aria-hidden
        />
      )}

      {/* "All zones read" banner */}
      {allZonesRead && (
        <div className={styles.advanceBanner} aria-live="polite">
          ✓ Mission read — advancing…
        </div>
      )}

      {/* Control panel */}
      <div className={styles.panel}>
        <button
          className={styles.header}
          onClick={() => setCollapsed(c => !c)}
          aria-expanded={!collapsed}
        >
          <span className={`${styles.statusDot} ${isTracking ? styles.statusActive : ''} ${isCalibrating ? styles.statusCalib : ''}`} />
          <span className={styles.headerLabel}>Eye Tracking</span>
          <span className={styles.chevron}>{collapsed ? '▲' : '▼'}</span>
        </button>

        {!collapsed && (
          <div className={styles.body}>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.row}>
              <span className={styles.stat}>
                <strong>{recordCount.toLocaleString()}</strong> pts
              </span>
              {isCalibrating && <span className={styles.calibLabel}>Calibrating…</span>}
              {isTracking && !isCalibrating && <span className={styles.live}>● LIVE</span>}
            </div>

            {/* Zone reading progress */}
            {(isTracking || zonesRead.length > 0) && (
              <div className={styles.zones}>
                {REQUIRED_ZONES.map(zone => (
                  <span
                    key={zone}
                    className={`${styles.zoneChip} ${zonesRead.includes(zone) ? styles.zoneChipDone : ''}`}
                  >
                    {zonesRead.includes(zone) ? '✓ ' : ''}{ZONE_LABELS[zone]}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              {!isTracking && !isCalibrating ? (
                <button
                  className={`${styles.btn} ${styles.btnStart}`}
                  onClick={startTracking}
                  disabled={isLoading}
                >
                  {isLoading ? 'Starting…' : '▶ Start'}
                </button>
              ) : (
                <button
                  className={`${styles.btn} ${styles.btnStop}`}
                  onClick={stopTracking}
                >
                  ■ Stop
                </button>
              )}
              <button
                className={`${styles.btn} ${styles.btnExport}`}
                onClick={exportCSV}
                disabled={recordCount === 0}
                title="Download CSV"
              >
                ↓ CSV
              </button>
              <button
                className={`${styles.btn} ${styles.btnClear}`}
                onClick={clearData}
                disabled={recordCount === 0 || isTracking}
                title="Clear data"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

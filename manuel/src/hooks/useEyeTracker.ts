import { useRef, useState, useCallback, useEffect } from 'react';
import type { Mission } from '../components/MissionCard';

// Zones the user must dwell on for a mission to count as "read"
const REQUIRED_ZONES = ['mission-title', 'reward-text', 'reward-image'];
const ZONE_DWELL_MS = 600;       // sustained gaze needed per zone
const AUTO_ADVANCE_DELAY_MS = 1500; // pause after all zones read before advancing

export interface GazeRecord {
  timestamp: number;
  elapsed_ms: number;
  x: number;
  y: number;
  mission_id: number;
  mission_title: string;
  element_zone: string;
  event_type: 'gaze' | 'click' | 'mission_change';
}

interface TrackerState {
  isTracking: boolean;
  isCalibrating: boolean;
  isLoading: boolean;
  error: string | null;
  gazeX: number | null;
  gazeY: number | null;
  recordCount: number;
  zonesRead: string[];
  allZonesRead: boolean;
}

function getElementZone(x: number, y: number): string {
  const el = document.elementFromPoint(x, y);
  if (!el) return 'none';
  let current: Element | null = el;
  while (current) {
    const zone = current.getAttribute('data-track');
    if (zone) return zone;
    current = current.parentElement;
  }
  return el.tagName.toLowerCase();
}

export function useEyeTracker(currentMission: Mission, onMissionRead?: () => void) {
  const [state, setState] = useState<TrackerState>({
    isTracking: false,
    isCalibrating: false,
    isLoading: false,
    error: null,
    gazeX: null,
    gazeY: null,
    recordCount: 0,
    zonesRead: [],
    allZonesRead: false,
  });

  const records = useRef<GazeRecord[]>([]);
  const sessionStart = useRef<number>(0);
  const currentMissionRef = useRef(currentMission);
  const isTrackingRef = useRef(false);
  const onMissionReadRef = useRef(onMissionRead);
  useEffect(() => { onMissionReadRef.current = onMissionRead; }, [onMissionRead]);

  // Per-zone dwell tracking
  const gazeZoneRef = useRef<string | null>(null);
  const gazeZoneStartRef = useRef<number>(0);
  const readZonesRef = useRef<Set<string>>(new Set());
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetZones = () => {
    readZonesRef.current = new Set();
    gazeZoneRef.current = null;
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setState(prev => ({ ...prev, zonesRead: [], allZonesRead: false }));
  };

  // Track mission changes
  useEffect(() => {
    const prev = currentMissionRef.current;
    currentMissionRef.current = currentMission;
    if (isTrackingRef.current && prev.id !== currentMission.id) {
      records.current.push({
        timestamp: Date.now(),
        elapsed_ms: Date.now() - sessionStart.current,
        x: -1,
        y: -1,
        mission_id: currentMission.id,
        mission_title: currentMission.title,
        element_zone: 'carousel',
        event_type: 'mission_change',
      });
      resetZones();
    }
  }, [currentMission]);

  const startTracking = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const wg = window.webgazer;
      if (!wg) throw new Error('WebGazer not loaded');

      wg.showVideo(false)
        .showFaceOverlay(false)
        .showFaceFeedbackBox(false)
        .showPredictionPoints(false);

      await wg.begin();

      // Show calibration overlay; actual tracking state set after calibration
      setState(prev => ({ ...prev, isLoading: false, isCalibrating: true }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to start',
      }));
    }
  }, []);

  const beginTracking = useCallback(() => {
    const wg = window.webgazer;
    if (!wg) return;

    sessionStart.current = Date.now();
    records.current = [];
    isTrackingRef.current = true;
    readZonesRef.current = new Set();
    gazeZoneRef.current = null;

    wg.setGazeListener((data) => {
      if (!data || !isTrackingRef.current) return;
      const { x, y } = data;
      const now = Date.now();
      const zone = getElementZone(x, y);
      const mission = currentMissionRef.current;

      records.current.push({
        timestamp: now,
        elapsed_ms: now - sessionStart.current,
        x: Math.round(x),
        y: Math.round(y),
        mission_id: mission.id,
        mission_title: mission.title,
        element_zone: zone,
        event_type: 'gaze',
      });

      // Zone dwell logic
      if (zone !== gazeZoneRef.current) {
        gazeZoneRef.current = zone;
        gazeZoneStartRef.current = now;
      } else if (
        REQUIRED_ZONES.includes(zone) &&
        !readZonesRef.current.has(zone) &&
        now - gazeZoneStartRef.current >= ZONE_DWELL_MS
      ) {
        readZonesRef.current.add(zone);
        const zonesRead = [...readZonesRef.current];
        const allZonesRead = REQUIRED_ZONES.every(z => readZonesRef.current.has(z));

        setState(prev => ({
          ...prev,
          gazeX: Math.round(x),
          gazeY: Math.round(y),
          recordCount: records.current.length,
          zonesRead,
          allZonesRead,
        }));

        if (allZonesRead && !advanceTimerRef.current) {
          advanceTimerRef.current = setTimeout(() => {
            advanceTimerRef.current = null;
            onMissionReadRef.current?.();
          }, AUTO_ADVANCE_DELAY_MS);
        }
        return;
      }

      setState(prev => ({
        ...prev,
        gazeX: Math.round(x),
        gazeY: Math.round(y),
        recordCount: records.current.length,
      }));
    });

    setState(prev => ({ ...prev, isCalibrating: false, isTracking: true }));
  }, []);

  const stopTracking = useCallback(() => {
    isTrackingRef.current = false;
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    try {
      window.webgazer?.clearGazeListener();
      window.webgazer?.end();
    } catch { /* already stopped */ }
    setState(prev => ({
      ...prev,
      isTracking: false,
      isCalibrating: false,
      gazeX: null,
      gazeY: null,
      zonesRead: [],
      allZonesRead: false,
    }));
  }, []);

  const exportCSV = useCallback(() => {
    const data = records.current;
    if (data.length === 0) return;
    const header = 'timestamp,elapsed_ms,x,y,mission_id,mission_title,element_zone,event_type\n';
    const rows = data.map(r =>
      `${r.timestamp},${r.elapsed_ms},${r.x},${r.y},${r.mission_id},"${r.mission_title}","${r.element_zone}",${r.event_type}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gaze_session_${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const clearData = useCallback(() => {
    records.current = [];
    setState(prev => ({ ...prev, recordCount: 0 }));
  }, []);

  // Record clicks while tracking
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!isTrackingRef.current) return;
      const zone = getElementZone(e.clientX, e.clientY);
      const mission = currentMissionRef.current;
      records.current.push({
        timestamp: Date.now(),
        elapsed_ms: Date.now() - sessionStart.current,
        x: e.clientX,
        y: e.clientY,
        mission_id: mission.id,
        mission_title: mission.title,
        element_zone: zone,
        event_type: 'click',
      });
      setState(prev => ({ ...prev, recordCount: records.current.length }));
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return { ...state, startTracking, beginTracking, stopTracking, exportCSV, clearData };
}

import {
  PersonWalkingFilled,
  LocationFilled,
  CheckmarkCircleFilled,
  ArrowTrendingFilled,
  WeatherSunnyFilled,
  WeatherPartlyCloudyDayFilled,
  WeatherCloudyFilled,
  ClockFilled,
} from '@fluentui/react-icons';
import styles from './Actividad.module.css';

/* ── Weekly bar chart data ─────────────────────────────────── */
const weekData = [
  { day: 'Lun', outings: 2, label: '2 salidas', duration: '45 min', fill: 1.0 },
  { day: 'Mar', outings: 1, label: '1 salida',  duration: '30 min', fill: 0.54 },
  { day: 'Mié', outings: 2, label: '2 salidas', duration: '50 min', fill: 1.0 },
  { day: 'Jue', outings: 1, label: '1 salida',  duration: '25 min', fill: 0.54 },
  { day: 'Vie', outings: 2, label: '2 salidas', duration: '55 min', fill: 1.0 },
  { day: 'Sáb', outings: 1, label: '1 salida',  duration: '40 min', fill: 0.54 },
  { day: 'Dom', outings: 1, label: '1 salida',  duration: '35 min', fill: 0.54 },
];

/* ── Recent history data ────────────────────────────────────── */
type WeatherType = 'sunny' | 'partly' | 'cloudy';

const historyData: { date: string; duration: string; weather: WeatherType }[] = [
  { date: '22 Abr • 10:15 AM', duration: '35 min', weather: 'sunny' },
  { date: '21 Abr • 9:30 AM',  duration: '42 min', weather: 'sunny' },
  { date: '21 Abr • 4:15 PM',  duration: '28 min', weather: 'cloudy' },
  { date: '20 Abr • 10:00 AM', duration: '38 min', weather: 'partly' },
  { date: '20 Abr • 5:30 PM',  duration: '25 min', weather: 'sunny' },
];

function WeatherIcon({ type }: { type: WeatherType }) {
  if (type === 'sunny')  return <WeatherSunnyFilled className={styles.weatherIcon} />;
  if (type === 'partly') return <WeatherPartlyCloudyDayFilled className={styles.weatherIcon} />;
  return <WeatherCloudyFilled className={styles.weatherIcon} />;
}

export default function Actividad() {
  return (
    <div className={styles.screen}>

      {/* ── Title ─────────────────────────────────────────────── */}
      <h1 className={styles.title}>Actividad</h1>

      {/* ── Blue highlight card ───────────────────────────────── */}
      <div className={styles.highlightCard}>
        <div className={styles.highlightIconWrap}>
          <PersonWalkingFilled className={styles.highlightIcon} />
        </div>
        <p className={styles.highlightText}>
          {"Promedio de caminata: "}
          <br />
          <strong>40 minutos</strong>
        </p>
      </div>

      {/* ── En casa card ──────────────────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.locationRow}>
          <LocationFilled className={styles.locationIcon} />
          <span className={styles.locationTitle}>En casa</span>
        </div>
        <p className={styles.locationSub}>Última salida: hace 2 horas (35 min fuera)</p>
      </div>

      {/* ── Salidas de hoy card ───────────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Salidas de hoy</span>
          <span className={styles.completedBadge}>
            Completado
            <CheckmarkCircleFilled className={styles.completedIcon} />
          </span>
        </div>
        <div className={styles.todayGrid}>
          <div className={styles.todayCol}>
            <span className={styles.detailLabel}>Salió</span>
            <span className={styles.detailValue}>10:00 AM</span>
          </div>
          <div className={styles.todayCol}>
            <span className={styles.detailLabel}>Regresó</span>
            <span className={styles.detailValue}>10:45 AM</span>
          </div>
        </div>
        <div className={styles.durationRow}>
          <span className={styles.detailLabel}>Duración</span>
          <span className={styles.detailValue}>45 min</span>
        </div>
      </div>

      {/* ── Esta semana card ─────────────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Esta semana</span>
          <span className={styles.avgRow}>
            <ArrowTrendingFilled className={styles.trendIcon} />
            <span className={styles.avgText}>Promedio: 40 min/día</span>
          </span>
        </div>
        <div className={styles.weekChart}>
          {weekData.map((row) => (
            <div key={row.day} className={styles.weekRow}>
              <span className={styles.weekDay}>{row.day}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${row.fill * 100}%` }}
                />
                <div className={styles.barLabels}>
                  <span className={styles.barLabelLeft}>{row.label}</span>
                  <span
                    className={styles.barLabelRight}
                    style={{ color: row.fill < 1 ? '#364153' : '#fff' }}
                  >
                    {row.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Historial reciente card ───────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Historial reciente</span>
        </div>
        <div className={styles.historyList}>
          {historyData.map((item, i) => (
            <div key={i} className={styles.historyItem}>
              <div className={styles.historyLeft}>
                <WeatherIcon type={item.weather} />
                <div className={styles.historyInfo}>
                  <span className={styles.historyDate}>{item.date}</span>
                  <span className={styles.historyDuration}>{item.duration}</span>
                </div>
              </div>
              <ClockFilled className={styles.clockIcon} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

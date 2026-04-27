import {
  CheckmarkCircleFilled,
  DismissCircleFilled,
  ClockFilled,
  ChevronLeftFilled,
  ChevronRightFilled,
} from '@fluentui/react-icons';
import { useState } from 'react';
import styles from './Medicina.module.css';

const weekData = [
  { day: 'Lun', taken: true, time: '8:30 AM' },
  { day: 'Mar', taken: true, time: '8:35 AM' },
  { day: 'Mié', taken: false, time: '-' },
  { day: 'Jue', taken: true, time: '8:28 AM' },
  { day: 'Vie', taken: true, time: '8:32 AM' },
  { day: 'Sáb', taken: true, time: '9:15 AM' },
  { day: 'Dom', taken: true, time: '8:45 AM' },
];

const medications = [
  { name: 'Metformina (Diabétes)', dose: '50mg', schedule: 'Mañana con café' },
  { name: 'Losartán (Hipertensión)', dose: '20mg', schedule: 'Mañana con café' },
];

const missedDays = new Set([3, 8, 9, 12, 24, 26, 29, 30]);

const dayNames = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const takenCount = weekData.filter((d) => d.taken).length;
const compliancePercent = Math.round((takenCount / weekData.length) * 100);

export default function Medicina() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isFutureDay = (day: number) => {
    if (currentYear > today.getFullYear()) return true;
    if (currentYear < today.getFullYear()) return false;
    if (currentMonth > today.getMonth()) return true;
    if (currentMonth < today.getMonth()) return false;
    return day > today.getDate();
  };

  const isFutureMonth = () => {
    if (currentYear > today.getFullYear()) return true;
    if (currentYear === today.getFullYear() && currentMonth > today.getMonth()) return true;
    return false;
  };

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ day: null, key: `empty-${i}` });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push({ day, key: `day-${day}` });
  }

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>Medicina</h1>

      {/* Success header card */}
      <div className={styles.successCard}>
        <div className={styles.successIconWrap}>
          <CheckmarkCircleFilled className={styles.successIcon} />
        </div>
        <div className={styles.successHeader}>
          <span className={styles.successTitle}>Medicación tomada</span>
          <p className={styles.successTime}>Hoy a las 8:30 AM</p>
        </div>
      </div>

      {/* Weekly compliance card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Esta semana</span>
          <span className={styles.complianceBadge}>
            <span className={styles.complianceNumber}>{compliancePercent}%</span>
            <span className={styles.complianceLabel}> cumplimiento</span>
          </span>
        </div>

        <div className={styles.weekRow}>
          {weekData.map((item) => (
            <div key={item.day} className={styles.weekDay}>
              <span className={styles.dayLabel}>{item.day}</span>
              {item.taken ? (
                <CheckmarkCircleFilled className={styles.dayIconTaken} />
              ) : (
                <DismissCircleFilled className={styles.dayIconMissed} />
              )}
              <span className={styles.dayTime}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current medications card */}
      <div className={styles.card}>
        <span className={styles.cardTitle}>Medicamentos actuales</span>
        <div className={styles.medList}>
          {medications.map((med) => (
            <div key={med.name} className={styles.medItem}>
              <div className={styles.medInfo}>
                <span className={styles.medName}>{med.name}</span>
                <span className={styles.medDose}>{med.dose}</span>
                <div className={styles.medSchedule}>
                  <ClockFilled className={styles.scheduleIcon} />
                  <span>{med.schedule}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly history card */}
      <div className={styles.calendarCard}>
        <div className={styles.calendarHeader}>
          <button
            type="button"
            className={styles.calendarNavBtn}
            onClick={handlePrevMonth}
          >
            <ChevronLeftFilled className={styles.calendarNavIcon} />
          </button>
          <span className={styles.calendarMonth}>
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            type="button"
            className={styles.calendarNavBtn}
            onClick={handleNextMonth}
          >
            <ChevronRightFilled className={styles.calendarNavIcon} />
          </button>
        </div>

        <div className={styles.calendarDayNames}>
          {dayNames.map((name) => (
            <span key={name} className={styles.calendarDayName}>{name}</span>
          ))}
        </div>

        <div className={styles.calendar}>
          {calendarCells.map((cell) => {
            let cellClass = styles.calendarCell;
            
            if (cell.day === null) {
              cellClass += ` ${styles.cellEmpty}`;
            } else if (isFutureMonth() || isFutureDay(cell.day)) {
              cellClass += ` ${styles.cellFuture}`;
            } else if (isToday(cell.day)) {
              cellClass += ` ${styles.cellToday}`;
            } else if (missedDays.has(cell.day)) {
              cellClass += ` ${styles.cellMissed}`;
            } else {
              cellClass += ` ${styles.cellTaken}`;
            }
            
            return (
              <div key={cell.key} className={cellClass}>
                {cell.day}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

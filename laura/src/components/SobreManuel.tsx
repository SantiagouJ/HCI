import {
  AddCircleFilled,
  PillFilled,
  PersonWalkingFilled,
  TrophyFilled,
  CheckboxCheckedFilled,
} from '@fluentui/react-icons';
import { useState } from 'react';
import styles from './SobreManuel.module.css';
import NewMissionPopup from './NewMissionPopup';

const rewards = [
  { id: 1, emoji: '🍎', title: 'Ensalada de frutas' },
  { id: 2, emoji: '🍰', title: 'Miloja' },
  { id: 3, emoji: '🎬', title: 'Película favorita' },
];

export default function SobreManuel() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className={styles.screen}>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Sobre Manuel</h1>
        <button 
          className={styles.newMissionBtn} 
          type="button"
          onClick={() => setIsPopupOpen(true)}
        >
          <AddCircleFilled className={styles.btnIcon} />
          Nueva mision
        </button>
      </div>

      {/* New Mission Popup */}
      <NewMissionPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        existingRewards={rewards}
      />

      {/* Date */}
      <div className={styles.dateSection}>
        <span className={styles.dateLabel}>Hoy</span>
        <p className={styles.dateText}>miércoles, 22 de abril de 2026</p>
      </div>

      {/* Wellness summary card */}
      <div className={styles.card}>
        <div className={styles.statusRow}>
          <span className={styles.statusDot} />
          <span className={styles.statusTitle}>Muy bien</span>
        </div>
        <div className={styles.taskList}>
          <div className={styles.checkboxCol}>
            <CheckboxCheckedFilled className={styles.checkIcon} />
            <CheckboxCheckedFilled className={styles.checkIcon} />
            <CheckboxCheckedFilled className={styles.checkIcon} />
          </div>
          <div className={styles.taskItems}>
            <p className={styles.taskDone}>Medicación tomada</p>
            <p className={styles.taskDone}>Salida a caminar</p>
            <p className={styles.taskDone}>2 misiones completadas</p>
          </div>
        </div>
      </div>

      {/* Medication card */}
      <div className={styles.card}>
        <div className={styles.cardRow}>
          <div className={styles.iconWrapper}>
            <PillFilled className={styles.cardIcon} style={{ color: '#469fff' }} />
          </div>
          <div className={styles.cardInfo}>
            <span className={styles.cardCategory}>Medicación</span>
            <span className={styles.cardMainValue}>Tomada</span>
            <span className={styles.cardDetail}>8:30 AM</span>
          </div>
        </div>
      </div>

      {/* Activity card */}
      <div className={styles.card}>
        <div className={styles.cardRow}>
          <div className={styles.iconWrapper}>
            <PersonWalkingFilled className={styles.cardIcon} style={{ color: '#469fff' }} />
          </div>
          <div className={styles.cardInfo}>
            <span className={styles.cardCategory}>Actividad</span>
            <span className={styles.cardMainValue}>1 salida</span>
            <span className={styles.cardDetail}>Duración: 45 minutos</span>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.detailRows}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Salió</span>
            <span className={styles.detailValue}>10:00 AM</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Regresó</span>
            <span className={styles.detailValue}>10:45 AM</span>
          </div>
        </div>
      </div>

      {/* Missions card — trophy ribbon positioned absolutely */}
      <div className={styles.missionCard}>
        {/* Green bookmark ribbon — absolute, top-left of card */}
        <div className={styles.trophyBanner} aria-hidden="true">
          <TrophyFilled className={styles.trophyIcon} />
        </div>

        {/* Header content — offset past the ribbon */}
        <div className={styles.missionHeader}>
          <span className={styles.cardCategory}>Misiones</span>
          <span className={styles.cardMainValue}>2 completadas</span>
          <span className={styles.cardDetail}>1 reward reclamado, 1 pendiente</span>
        </div>

        {/* Divider and rows start at the card's normal padding edge, NOT offset */}
        <div className={styles.divider} />
        <div className={styles.detailRows}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Completó</span>
            <span className={styles.detailValue}>Ir al supermercado</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Completó</span>
            <span className={styles.detailValue}>Regar las plantas</span>
          </div>
        </div>
      </div>

    </div>
  );
}

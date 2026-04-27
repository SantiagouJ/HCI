import {
  AddCircleFilled,
  PersonWalkingFilled,
  TargetFilled,
  CheckmarkCircleFilled,
  ClockFilled,
  StarFilled,
} from '@fluentui/react-icons';
import { useState } from 'react';
import styles from './Misiones.module.css';
import NewMissionPopup from './NewMissionPopup';

type TabFilter = 'all' | 'pending' | 'completed';

const activeMissions = [
  {
    id: 1,
    title: 'Caminata diaria',
    description: 'Caminar 30 minutos',
    progress: 70,
    daysLeft: 3,
    reward: 'Ensalada de frutas',
  },
  {
    id: 2,
    title: 'Tomar medicación',
    description: 'Completar la semana',
    progress: 85,
    daysLeft: 2,
    reward: 'Postre favorito',
  },
];

const pendingMissions = [
  {
    id: 3,
    title: 'Probar brocoli en receta',
    reward: 'Miloja',
    status: 'pending' as const,
  },
  {
    id: 4,
    title: 'Caminar 40 minutos',
    reward: 'Ensalada de frutas',
    status: 'pending' as const,
  },
];

const completedMissions = [
  {
    id: 5,
    title: 'Comprar mercado',
    reward: 'Tarta de manzana',
    status: 'completed' as const,
  },
];

const rewards = [
  {
    id: 1,
    emoji: '🍎',
    title: 'Ensalada de frutas',
    goal: 'Caminar 40 min diarios',
  },
  {
    id: 2,
    emoji: '🍰',
    title: 'Miloja',
    goal: 'Probar brocoli en receta',
  },
];

export default function Misiones() {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const filteredMissions = activeTab === 'all'
    ? [...pendingMissions, ...completedMissions]
    : activeTab === 'pending'
    ? pendingMissions
    : completedMissions;

  return (
    <div className={styles.screen}>
      {/* Title */}
      <div className={styles.header}>
        <h1 className={styles.title}>Misiones</h1>
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
      

      {/* Highlight card - Active missions count */}
      <div className={styles.highlightCard}>
        <div className={styles.highlightIconWrap}>
          <TargetFilled className={styles.highlightIcon} />
        </div>
        <p className={styles.highlightText}>
          Misiones activas: <br />
          <strong>{activeMissions.length} en progreso</strong>
        </p>
      </div>

      <div className={styles.card}>

        {/* Filter tabs */}
        <div className={styles.filterTabs}>
          <button
            type="button"
            className={`${styles.filterTab} ${activeTab === 'all' ? styles.filterTabActive : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Todas
          </button>
          <button
            type="button"
            className={`${styles.filterTab} ${activeTab === 'pending' ? styles.filterTabActive : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <span className={styles.filterDotPending} />
            Pendientes
          </button>
          <button
            type="button"
            className={`${styles.filterTab} ${activeTab === 'completed' ? styles.filterTabActive : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <span className={styles.filterDotCompleted} />
            Completadas
          </button>
        </div>

        {/* Missions list */}
        <div className={styles.missionList}>
          {filteredMissions.map((mission) => (
            <div key={mission.id} className={styles.missionRow}>
              <div className={styles.missionRowLeft}>
                {mission.status === 'completed' ? (
                  <CheckmarkCircleFilled className={styles.checkIcon} />
                ) : (
                  <ClockFilled className={styles.pendingIcon} />
                )}
                <div className={styles.missionRowInfo}>
                  <span className={styles.missionRowTitle}>{mission.title}</span>
                  <span className={styles.missionRowReward}>
                    <StarFilled className={styles.giftIcon} />
                    {mission.reward}
                  </span>
                </div>
              </div>
              <span
                className={`${styles.statusBadge} ${
                  mission.status === 'completed' ? styles.badgeCompleted : styles.badgePending
                }`}
              >
                {mission.status === 'completed' ? 'Completada' : 'Pendiente'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards center card */}
      <div className={styles.card}>
        <div className={styles.sectionHeader}>
          <StarFilled className={styles.sectionIconGold} />
          <span className={styles.sectionTitle}>Centro de Recompensas</span>
        </div>
        {rewards.map((reward) => (
          <div key={reward.id} className={styles.rewardCard}>
            <div className={styles.rewardImageWrap}>
              <span className={styles.rewardEmoji}>{reward.emoji}</span>
            </div>
            <div className={styles.rewardInfo}>
              <span className={styles.rewardTitle}>{reward.title}</span>
              <span className={styles.rewardGoal}>
                <PersonWalkingFilled className={styles.goalIcon} />
                Meta: {reward.goal}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

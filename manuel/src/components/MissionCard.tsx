import styles from './MissionCard.module.css';

export interface Mission {
  id: number;
  title: string;
  rewardDescription: string;
  rewardImage: string;
  rotation?: number;
}

interface MissionCardProps {
  mission: Mission;
  isCompleted: boolean;
  onToggle: () => void;
}

export default function MissionCard({ mission, isCompleted, onToggle }: MissionCardProps) {

  return (
    <article 
      className={`${styles.card} ${isCompleted ? styles.cardCompleted : ''}`}
      onClick={onToggle}
    >
      {/* Red decorative pin */}
      <img 
        src="https://www.pngall.com/wp-content/uploads/4/Red-Pin-PNG-Free-Image.png" 
        alt="" 
        className={styles.pin}
      />
      
      {/* Purple header with title */}
      <header className={styles.header} data-track="mission-header">
        <span className={styles.checkboxCustom} data-track="checkbox">
          {isCompleted && (
            <svg viewBox="0 0 24 24" className={styles.checkIcon}>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
            </svg>
          )}
        </span>
        <h2 className={`${styles.title} ${isCompleted ? styles.titleCompleted : ''}`} data-track="mission-title">{mission.title}</h2>
        <span className={styles.checkboxSpacer} />
      </header>
      
      {/* Cream card body */}
      <div className={styles.body}>
        {/* Dashed separator */}
        <div className={styles.separator}>
          <div className={styles.dashedLine} />
        </div>
        
        {/* Reward description */}
        <p className={styles.rewardText} data-track="reward-text">
          {mission.rewardDescription}
        </p>

        {/* Reward image */}
        <div className={styles.imageWrapper} data-track="reward-image">
          <img 
            src={mission.rewardImage} 
            alt="Recompensa"
            className={styles.rewardImage}
          />
        </div>
      </div>
    </article>
  );
}

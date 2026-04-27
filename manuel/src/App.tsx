import { useState, useEffect } from 'react';
import MissionCard, { type Mission } from './components/MissionCard';
import styles from './App.module.css';

const missions: Mission[] = [
  {
    id: 1,
    title: 'Caminata al parque',
    rewardDescription: 'Al terminar esta misión, ¡ganarás un trozo de tarta de manzana!',
    rewardImage: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400&h=300&fit=crop',
    rotation: -2,
  },
  {
    id: 2,
    title: 'Comprar pollo',
    rewardDescription: 'Al completar este favor, ¡recibirás una deliciosa ensalada de frutas!',
    rewardImage: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop',
    rotation: 1.5,
  },
  {
    id: 3,
    title: 'Salir 40 minutos',
    rewardDescription: 'Al cumplir este reto, ¡disfrutarás de tu postre favorito!',
    rewardImage: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
    rotation: -1,
  },
  {
    id: 4,
    title: 'Visitar al vecino',
    rewardDescription: 'Por conectar con alguien especial, ¡ganarás un rico helado!',
    rewardImage: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=300&fit=crop',
    rotation: 2.5,
  },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % missions.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentMission = missions[currentIndex];
  const isCurrentCompleted = completedMissions.has(currentMission.id);

  const handleToggleComplete = (missionId: number) => {
    setCompletedMissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(missionId)) {
        newSet.delete(missionId);
      } else {
        newSet.add(missionId);
      }
      return newSet;
    });
  };

  return (
    <div className={styles.screen}>
      {/* Title */}
      <h1 className={styles.title}>Toca la nota para 
        <br />completar la misión</h1>

      {/* Carousel */}
      <div 
        className={styles.carousel}
        style={{ transform: `rotate(${currentMission.rotation}deg)` }}
      >
        <MissionCard 
          mission={currentMission} 
          isCompleted={isCurrentCompleted}
          onToggle={() => handleToggleComplete(currentMission.id)}
        />
      </div>

      {/* Dots indicator */}
      <div className={styles.dots}>
        {missions.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
          />
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p className={styles.footerText}>Con cariño de Laura ❤️</p>
      </div>
    </div>
  );
}

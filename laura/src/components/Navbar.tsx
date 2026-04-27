import {
  HomeFilled,
  PersonWalkingFilled,
  PillFilled,
  TrophyFilled,
  PersonFilled,
} from '@fluentui/react-icons';
import styles from './Navbar.module.css';

export type NavItem = 'inicio' | 'actividad' | 'medicina' | 'misiones' | 'perfil';

interface NavbarProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const navItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    { id: 'inicio', label: 'Inicio', icon: <HomeFilled className={styles.icon} /> },
    { id: 'actividad', label: 'Actividad', icon: <PersonWalkingFilled className={styles.icon} /> },
    { id: 'medicina', label: 'Medicina', icon: <PillFilled className={styles.icon} /> },
    { id: 'misiones', label: 'Misiones', icon: <TrophyFilled className={styles.icon} /> },
    { id: 'perfil', label: 'Perfil', icon: <PersonFilled className={styles.icon} /> },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className={styles.iconWrapper}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

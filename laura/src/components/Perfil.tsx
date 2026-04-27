import {
  PersonFilled,
  AlertFilled,
  PhoneFilled,
  PeopleFilled,
  ShieldCheckmarkFilled,
  ColorFilled,
  DocumentTextFilled,
  InfoFilled,
  SignOutFilled,
  ChevronRightFilled,
  WalletCreditCardFilled,
  AddCircleFilled,
} from '@fluentui/react-icons';
import { useState } from 'react';
import styles from './Perfil.module.css';

interface SettingToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
}

function SettingToggle({ label, description, enabled, onToggle }: SettingToggleProps) {
  return (
    <button type="button" className={styles.settingRow} onClick={onToggle}>
      <div className={styles.settingInfo}>
        <span className={styles.settingLabel}>{label}</span>
        {description && <span className={styles.settingDesc}>{description}</span>}
      </div>
      <div className={`${styles.toggle} ${enabled ? styles.toggleOn : styles.toggleOff}`}>
        <div className={styles.toggleKnob} />
      </div>
    </button>
  );
}

interface SettingLinkProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  danger?: boolean;
  onClick?: () => void;
}

function SettingLink({ icon, label, value, danger, onClick }: SettingLinkProps) {
  return (
    <button
      type="button"
      className={`${styles.linkRow} ${danger ? styles.danger : ''}`}
      onClick={onClick}
    >
      <div className={styles.linkLeft}>
        <span className={styles.linkIcon}>{icon}</span>
        <span className={styles.linkLabel}>{label}</span>
      </div>
      <div className={styles.linkRight}>
        {value && <span className={styles.linkValue}>{value}</span>}
        <ChevronRightFilled className={styles.chevron} />
      </div>
    </button>
  );
}

export default function Perfil() {
  const [notifications, setNotifications] = useState(true);
  const [medicationAlerts, setMedicationAlerts] = useState(true);
  const [activityReminders, setActivityReminders] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>Perfil</h1>

      {/* User profile card */}
      <div className={styles.profileCard}>
        <div className={styles.avatarWrapper}>
          <PersonFilled className={styles.avatarIcon} />
        </div>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>Laura</span>
          <span className={styles.profileEmail}>laura@gmail.com</span>
        </div>
        <button type="button" className={styles.editBtn}>Editar</button>
      </div>

      {/* Notifications section */}
      <div className={styles.card}>
        <div className={styles.sectionHeader}>
          <AlertFilled className={styles.sectionIcon} />
          <span className={styles.sectionTitle}>Notificaciones</span>
        </div>
        <div className={styles.settingsList}>
          <SettingToggle
            label="Notificaciones push"
            description="Recibir alertas en el dispositivo"
            enabled={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
          <SettingToggle
            label="Alertas de medicación"
            description="Avisos cuando Manuel tome su medicación"
            enabled={medicationAlerts}
            onToggle={() => setMedicationAlerts(!medicationAlerts)}
          />
          <SettingToggle
            label="Recordatorios de actividad"
            description="Avisos sobre salidas y paseos"
            enabled={activityReminders}
            onToggle={() => setActivityReminders(!activityReminders)}
          />
          <SettingToggle
            label="Sonidos"
            description="Reproducir sonido con las alertas"
            enabled={soundEnabled}
            onToggle={() => setSoundEnabled(!soundEnabled)}
          />
        </div>
      </div>

      {/* Contacts section */}
      <div className={styles.card}>
        <div className={styles.sectionHeader}>
          <PhoneFilled className={styles.sectionIcon} />
          <span className={styles.sectionTitle}>Contactos de emergencia</span>
        </div>
        <div className={styles.linksList}>
          <SettingLink
            icon={<PeopleFilled />}
            label="Familiares"
            value="3 contactos"
          />
          <SettingLink
            icon={<PhoneFilled />}
            label="Médico de cabecera"
            value="Dr. García"
          />
        </div>
      </div>

      {/* Payment methods section */}
      <div className={styles.card}>
        <div className={styles.sectionHeader}>
          <WalletCreditCardFilled className={styles.sectionIcon} />
          <span className={styles.sectionTitle}>Métodos de pago</span>
        </div>
        <div className={styles.paymentList}>
          <div className={styles.paymentCard}>
            <div className={styles.cardIconWrap}>
              <span className={styles.cardBrand}>VISA</span>
            </div>
            <div className={styles.cardInfo}>
              <span className={styles.cardNumber}>**** **** **** 4582</span>
              <span className={styles.cardExpiry}>Vence 08/27</span>
            </div>
            <span className={styles.defaultBadge}>Principal</span>
          </div>
          <div className={styles.paymentCard}>
            <div className={styles.cardIconWrap}>
              <span className={styles.cardBrandMc}>MC</span>
            </div>
            <div className={styles.cardInfo}>
              <span className={styles.cardNumber}>**** **** **** 1234</span>
              <span className={styles.cardExpiry}>Vence 03/26</span>
            </div>
            <ChevronRightFilled className={styles.chevron} />
          </div>
        </div>
        <button type="button" className={styles.addPaymentBtn}>
          <AddCircleFilled className={styles.addPaymentIcon} />
          Agregar método de pago
        </button>
      </div>

      {/* App settings section */}
      <div className={styles.card}>
        <div className={styles.sectionHeader}>
          <ColorFilled className={styles.sectionIcon} />
          <span className={styles.sectionTitle}>Aplicación</span>
        </div>
        <div className={styles.linksList}>
          <SettingLink
            icon={<ColorFilled />}
            label="Apariencia"
            value="Claro"
          />
          <SettingLink
            icon={<ShieldCheckmarkFilled />}
            label="Privacidad y seguridad"
          />
          <SettingLink
            icon={<DocumentTextFilled />}
            label="Términos y condiciones"
          />
          <SettingLink
            icon={<InfoFilled />}
            label="Acerca de"
            value="v1.0.0"
          />
        </div>
      </div>

      {/* Sign out */}
      <div className={styles.card}>
        <div className={styles.linksList}>
          <SettingLink
            icon={<SignOutFilled />}
            label="Cerrar sesión"
            danger
          />
        </div>
      </div>

      {/* Footer */}
      <p className={styles.footer}>CareConnect v1.0.0</p>
    </div>
  );
}

import {
  AddCircleFilled,
  DismissFilled,
  ChevronLeftFilled,
  ChevronRightFilled,
  CheckmarkFilled,
  GiftFilled,
  WalletCreditCardFilled,
  VehicleBicycleFilled,
} from '@fluentui/react-icons';
import { useState } from 'react';
import styles from './NewMissionPopup.module.css';

type PopupStep = 1 | 2 | 3 | 4;

export interface Reward {
  id: number;
  emoji: string;
  title: string;
  goal?: string;
}

interface PaymentMethod {
  id: number;
  type: 'visa' | 'mastercard';
  lastFour: string;
  expiry: string;
  isDefault?: boolean;
}

interface DeliveryApp {
  id: string;
  name: string;
  logo: string;
  color: string;
}

interface NewMissionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  existingRewards: Reward[];
  onCreate?: (mission: {
    title: string;
    description: string;
    reward: Reward | { emoji: string; title: string };
    deliveryApp?: string;
    paymentMethodId: number;
  }) => void;
}

const paymentMethods: PaymentMethod[] = [
  { id: 1, type: 'visa', lastFour: '4582', expiry: '08/27', isDefault: true },
  { id: 2, type: 'mastercard', lastFour: '1234', expiry: '03/26' },
];

const deliveryApps: DeliveryApp[] = [
  { id: 'rappi', name: 'Rappi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Rappi_logo.svg/1280px-Rappi_logo.svg.png', color: '#ff5a00' },
  { id: 'didi', name: 'DiDi Food', logo: 'https://i.pinimg.com/originals/86/67/f7/8667f7a6fdf3feef0a97d1c86d0842bb.png', color: '#ff7d41' },
  { id: 'uber', name: 'Uber Eats', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Uber_Eats_2018_logo.svg/3840px-Uber_Eats_2018_logo.svg.png', color: '#06c167' },
  { id: 'ifood', name: 'iFood', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/IFood_logo.svg/960px-IFood_logo.svg.png', color: '#ea1d2c' },
];

export default function NewMissionPopup({ isOpen, onClose, existingRewards, onCreate }: NewMissionPopupProps) {
  const [step, setStep] = useState<PopupStep>(1);
  const [missionTitle, setMissionTitle] = useState('');
  const [missionDescription, setMissionDescription] = useState('');
  const [rewardOption, setRewardOption] = useState<'existing' | 'new'>('existing');
  const [selectedReward, setSelectedReward] = useState<number | null>(null);
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardEmoji, setNewRewardEmoji] = useState('🎁');
  const [selectedDeliveryApp, setSelectedDeliveryApp] = useState<string>('rappi');
  const [selectedPayment, setSelectedPayment] = useState<number>(1);

  const emojiOptions = ['🎁', '🍎', '🍰', '🍦', '🎬', '🎮', '📚', '🌟', '🎉', '❤️'];

  const totalSteps = rewardOption === 'new' ? 4 : 3;
  const isDeliveryStep = rewardOption === 'new' && step === 3;
  const isPaymentStep = (rewardOption === 'existing' && step === 3) || (rewardOption === 'new' && step === 4);
  const isFinalStep = step === totalSteps;

  const handleClose = () => {
    setStep(1);
    setMissionTitle('');
    setMissionDescription('');
    setRewardOption('existing');
    setSelectedReward(null);
    setNewRewardTitle('');
    setNewRewardEmoji('🎁');
    setSelectedDeliveryApp('rappi');
    setSelectedPayment(1);
    onClose();
  };

  const handleNext = () => {
    if (step < totalSteps) setStep((s) => (s + 1) as PopupStep);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as PopupStep);
  };

  const handleCreate = () => {
    const reward = rewardOption === 'existing'
      ? existingRewards.find((r) => r.id === selectedReward)!
      : { emoji: newRewardEmoji, title: newRewardTitle };
    
    onCreate?.({
      title: missionTitle,
      description: missionDescription,
      reward,
      deliveryApp: rewardOption === 'new' ? selectedDeliveryApp : undefined,
      paymentMethodId: selectedPayment,
    });
    handleClose();
  };

  const canProceed = () => {
    if (step === 1) return missionTitle.trim() !== '';
    if (step === 2) {
      if (rewardOption === 'existing') return selectedReward !== null;
      return newRewardTitle.trim() !== '';
    }
    if (isDeliveryStep) return selectedDeliveryApp !== '';
    if (isPaymentStep) return selectedPayment !== null;
    return true;
  };

  const getStepTitle = () => {
    if (step === 1) return 'Nueva Misión';
    if (step === 2) return 'Recompensa';
    if (isDeliveryStep) return 'App de Delivery';
    if (isPaymentStep) return 'Método de Pago';
    return '';
  };

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay} onClick={handleClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.popupHeader}>
          <h2 className={styles.popupTitle}>{getStepTitle()}</h2>
          <button type="button" className={styles.closeBtn} onClick={handleClose}>
            <DismissFilled className={styles.closeIcon} />
          </button>
        </div>

        {/* Progress steps */}
        <div className={styles.stepIndicator}>
          <div className={`${styles.stepDot} ${step >= 1 ? styles.stepActive : ''}`}>1</div>
          <div className={`${styles.stepLine} ${step >= 2 ? styles.stepLineActive : ''}`} />
          <div className={`${styles.stepDot} ${step >= 2 ? styles.stepActive : ''}`}>2</div>
          <div className={`${styles.stepLine} ${step >= 3 ? styles.stepLineActive : ''}`} />
          <div className={`${styles.stepDot} ${step >= 3 ? styles.stepActive : ''}`}>3</div>
          {totalSteps === 4 && (
            <>
              <div className={`${styles.stepLine} ${step >= 4 ? styles.stepLineActive : ''}`} />
              <div className={`${styles.stepDot} ${step >= 4 ? styles.stepActive : ''}`}>4</div>
            </>
          )}
        </div>

        {/* Step content */}
        <div className={styles.popupContent}>
          {step === 1 && (
            <>
              <p className={styles.stepDescription}>
                Crea una misión para Manuel. Define qué actividad debe completar.
              </p>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Título de la misión</label>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="Ej: Caminar 30 minutos"
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Descripción (opcional)</label>
                <textarea
                  className={styles.textArea}
                  placeholder="Describe los detalles de la misión..."
                  value={missionDescription}
                  onChange={(e) => setMissionDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className={styles.stepDescription}>
                Selecciona una recompensa existente o crea una nueva para motivar a Manuel.
              </p>
              <div className={styles.rewardOptionTabs}>
                <button
                  type="button"
                  className={`${styles.rewardOptionTab} ${rewardOption === 'existing' ? styles.rewardOptionActive : ''}`}
                  onClick={() => setRewardOption('existing')}
                >
                  <GiftFilled className={styles.tabIcon} />
                  Existente
                </button>
                <button
                  type="button"
                  className={`${styles.rewardOptionTab} ${rewardOption === 'new' ? styles.rewardOptionActive : ''}`}
                  onClick={() => setRewardOption('new')}
                >
                  <AddCircleFilled className={styles.tabIcon} />
                  Nueva
                </button>
              </div>

              {rewardOption === 'existing' ? (
                <div className={styles.rewardSelectList}>
                  {existingRewards.map((reward) => (
                    <button
                      key={reward.id}
                      type="button"
                      className={`${styles.rewardSelectItem} ${selectedReward === reward.id ? styles.rewardSelected : ''}`}
                      onClick={() => setSelectedReward(reward.id)}
                    >
                      <span className={styles.rewardSelectEmoji}>{reward.emoji}</span>
                      <span className={styles.rewardSelectTitle}>{reward.title}</span>
                      {selectedReward === reward.id && (
                        <CheckmarkFilled className={styles.rewardCheckmark} />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Nombre de la recompensa</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="Ej: Postre favorito"
                      value={newRewardTitle}
                      onChange={(e) => setNewRewardTitle(e.target.value)}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Elige un emoji</label>
                    <div className={styles.emojiGrid}>
                      {emojiOptions.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          className={`${styles.emojiBtn} ${newRewardEmoji === emoji ? styles.emojiBtnActive : ''}`}
                          onClick={() => setNewRewardEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {isDeliveryStep && (
            <>
              <p className={styles.stepDescription}>
                Selecciona la app de delivery para enviar la recompensa a Manuel.
              </p>
              
              <div className={styles.deliveryHeader}>
                <VehicleBicycleFilled className={styles.deliveryHeaderIcon} />
                <span className={styles.deliveryHeaderText}>Apps disponibles</span>
              </div>

              <div className={styles.deliveryList}>
                {deliveryApps.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    className={`${styles.deliveryCard} ${selectedDeliveryApp === app.id ? styles.deliverySelected : ''}`}
                    onClick={() => setSelectedDeliveryApp(app.id)}
                  >
                    <div 
                      className={styles.deliveryLogoWrap}
                      style={{ backgroundColor: `${app.color}20` }}
                    >
                      <img src={app.logo} alt={app.name} className={styles.deliveryLogo} />
                    </div>
                    <span className={styles.deliveryName}>{app.name}</span>
                    {selectedDeliveryApp === app.id && (
                      <CheckmarkFilled className={styles.deliveryCheckmark} />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {isPaymentStep && (
            <>
              <p className={styles.stepDescription}>
                Selecciona el método de pago para la recompensa de Manuel.
              </p>
              
              <div className={styles.paymentHeader}>
                <WalletCreditCardFilled className={styles.paymentHeaderIcon} />
                <span className={styles.paymentHeaderText}>Métodos guardados</span>
              </div>

              <div className={styles.paymentList}>
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={`${styles.paymentCard} ${selectedPayment === method.id ? styles.paymentSelected : ''}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className={`${styles.cardIconWrap} ${method.type === 'mastercard' ? styles.cardMc : ''}`}>
                      <span className={styles.cardBrand}>
                        {method.type === 'visa' ? 'VISA' : 'MC'}
                      </span>
                    </div>
                    <div className={styles.cardInfo}>
                      <span className={styles.cardNumber}>**** **** **** {method.lastFour}</span>
                      <span className={styles.cardExpiry}>Vence {method.expiry}</span>
                    </div>
                    <div className={styles.paymentRight}>
                      {method.isDefault && (
                        <span className={styles.defaultBadge}>Principal</span>
                      )}
                      {selectedPayment === method.id && (
                        <CheckmarkFilled className={styles.paymentCheckmark} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button type="button" className={styles.addPaymentBtn}>
                <AddCircleFilled className={styles.addPaymentIcon} />
                Agregar método de pago
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.popupFooter}>
          {step > 1 && (
            <button type="button" className={styles.backBtn} onClick={handleBack}>
              <ChevronLeftFilled className={styles.btnIconSmall} />
              Atrás
            </button>
          )}
          <div className={styles.footerSpacer} />
          {!isFinalStep ? (
            <button
              type="button"
              className={styles.nextBtn}
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Siguiente
              <ChevronRightFilled className={styles.btnIconSmall} />
            </button>
          ) : (
            <button 
              type="button" 
              className={styles.createBtn} 
              onClick={handleCreate}
              disabled={!canProceed()}
            >
              <CheckmarkFilled className={styles.btnIconSmall} />
              Crear Misión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

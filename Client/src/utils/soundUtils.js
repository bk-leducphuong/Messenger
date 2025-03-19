import notificationSoundFile from '../assets/sounds/new-message.mp3';
// Audio instance for notification sound
let notificationSound = null;

export const initNotificationSound = () => {
  return new Promise((resolve, reject) => {
    try {
      notificationSound = new Audio(notificationSoundFile);
      
      // Preload the sound file
      notificationSound.load();
      
      notificationSound.oncanplaythrough = () => {
        resolve();
      };
      
      notificationSound.onerror = (error) => {
        console.error('Error loading notification sound:', error);
        reject(error);
      };
    } catch (error) {
      console.error('Error initializing notification sound:', error);
      reject(error);
    }
  });
};

/**
 * Play notification sound
 * @returns {Promise} Promise that resolves when sound starts playing
 */
export const playNotificationSound = () => {
  return new Promise((resolve, reject) => {
    try {
      if (!notificationSound) {
        console.warn('Notification sound not initialized');
        return reject(new Error('Sound not initialized'));
      }
      
      // Reset sound to beginning in case it was already playing
      notificationSound.currentTime = 0;
      
      // Play the notification sound
      const playPromise = notificationSound.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error('Error playing notification sound:', error);
            reject(error);
          });
      } else {
        resolve();
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
      reject(error);
    }
  });
};

/**
 * Set notification sound volume
 * @param {number} volume - Volume level (0 to 1)
 */
export const setNotificationVolume = (volume) => {
  if (notificationSound) {
    notificationSound.volume = Math.max(0, Math.min(1, volume));
  }
};

/**
 * Mute notification sound
 * @param {boolean} mute - Whether to mute the sound
 */
export const muteNotificationSound = (mute = true) => {
  if (notificationSound) {
    notificationSound.muted = mute;
  }
}; 
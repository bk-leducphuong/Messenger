import notificationSoundFile from '../assets/sounds/new-message.mp3';
import incomingCallSoundFile from '../assets/sounds/incoming-call.mp3';
import outgoingCallSoundFile from '../assets/sounds/calling.mp3';
// Audio instance for notification sound
let notificationSound = null;
let incomingCallSound = null;
let outgoingCallSound = null;

/**
 * Initialize notification sound
 * @returns {Promise} Promise that resolves when sound is loaded
 */
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
 * Initialize incoming call sound
 * @param {boolean} loop - Whether to loop the sound
 * @returns {Promise} Promise that resolves when sound is loaded
 */
export const initIncomingCallSound = (loop = true) => {
  return new Promise((resolve, reject) => {
    try {
      incomingCallSound = new Audio(incomingCallSoundFile);
      incomingCallSound.loop = loop;
      
      // Preload the sound file
      incomingCallSound.load();
      
      incomingCallSound.oncanplaythrough = () => {
        resolve(incomingCallSound);
      };
      
      incomingCallSound.onerror = (error) => {
        console.error('Error loading incoming call sound:', error);
        reject(error);
      };
    } catch (error) {
      console.error('Error initializing incoming call sound:', error);
      reject(error);
    }
  });
};

/**
 * Play incoming call sound
 * @returns {Promise} Promise that resolves when sound starts playing
 */
export const playIncomingCallSound = () => {
  return new Promise((resolve, reject) => {
    try {
      if (!incomingCallSound) {
        console.warn('Incoming call sound not initialized');
        return initIncomingCallSound()
          .then(sound => {
            const playPromise = sound.play();
            if (playPromise !== undefined) {
              return playPromise;
            }
            return Promise.resolve();
          })
          .then(resolve)
          .catch(reject);
      }
      
      // Play the call sound
      const playPromise = incomingCallSound.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error('Error playing incoming call sound:', error);
            reject(error);
          });
      } else {
        resolve();
      }
    } catch (error) {
      console.error('Error playing incoming call sound:', error);
      reject(error);
    }
  });
};

/**
 * Stop incoming call sound
 */
export const stopIncomingCallSound = () => {
  if (incomingCallSound) {
    incomingCallSound.pause();
    incomingCallSound.currentTime = 0;
  }
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
 * Set incoming call sound volume
 * @param {number} volume - Volume level (0 to 1)
 */
export const setIncomingCallVolume = (volume) => {
  if (incomingCallSound) {
    incomingCallSound.volume = Math.max(0, Math.min(1, volume));
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

/**
 * Initialize outgoing call sound
 * @param {boolean} loop - Whether to loop the sound
 * @returns {Promise} Promise that resolves when sound is loaded
 */
export const initOutgoingCallSound = (loop = true) => {
  return new Promise((resolve, reject) => {
    try {
      outgoingCallSound = new Audio(outgoingCallSoundFile);
      outgoingCallSound.loop = loop;
      
      // Preload the sound file
      outgoingCallSound.load();
      
      outgoingCallSound.oncanplaythrough = () => {
        resolve(outgoingCallSound);
      };
      
      outgoingCallSound.onerror = (error) => {
        console.error('Error loading outgoing call sound:', error);
        reject(error);
      };
    } catch (error) {
      console.error('Error initializing outgoing call sound:', error);
      reject(error);
    }
  });
};

/**
 * Play outgoing call sound
 * @returns {Promise} Promise that resolves when sound starts playing
 */
export const playOutgoingCallSound = () => {
  return new Promise((resolve, reject) => {
    try {
      if (!outgoingCallSound) {
        console.warn('Outgoing call sound not initialized');
        return initOutgoingCallSound()
          .then(sound => {
            const playPromise = sound.play();
            if (playPromise !== undefined) {
              return playPromise;
            }
            return Promise.resolve();
          })
          .then(resolve)
          .catch(reject);
      }
      
      // Play the call sound
      const playPromise = outgoingCallSound.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error('Error playing outgoing call sound:', error);
            reject(error);
          });
      } else {
        resolve();
      }
    } catch (error) {
      console.error('Error playing outgoing call sound:', error);
      reject(error);
    }
  });
};

/**
 * Stop outgoing call sound
 */
export const stopOutgoingCallSound = () => {
  if (outgoingCallSound) {
    outgoingCallSound.pause();
    outgoingCallSound.currentTime = 0;
  }
};

/**
 * Set outgoing call sound volume
 * @param {number} volume - Volume level (0 to 1)
 */
export const setOutgoingCallVolume = (volume) => {
  if (outgoingCallSound) {
    outgoingCallSound.volume = Math.max(0, Math.min(1, volume));
  }
}; 
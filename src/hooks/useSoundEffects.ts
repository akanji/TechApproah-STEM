import { useCallback } from 'react';

const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  transition: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
};

export function useSoundEffects() {
  const playSound = useCallback((type: keyof typeof SOUNDS) => {
    // Check if user prefers no sound (optional but good)
    const audio = new Audio(SOUNDS[type]);
    audio.volume = 0.2;
    audio.play().catch(e => console.log('Sound blocked by browser', e));
  }, []);

  return { playSound };
}

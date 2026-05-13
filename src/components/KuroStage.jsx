import { useEffect, useRef, useState } from 'react';
import kuroImage from '../svg/Kuro.svg';
import bootSound from '../sounds/boot.mp3';

const FADE_DELAY_MS = 9000;

function KuroStage({ onFadeComplete }) {
  const [kuroFading, setKuroFading] = useState(false);
  const [needsStart, setNeedsStart] = useState(false);
  const bootAudioRef = useRef(null);
  const fadeTimerRef = useRef(null);

  const startFadeTimer = () => {
    window.clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = window.setTimeout(() => {
      setKuroFading(true);
    }, FADE_DELAY_MS);
  };

  const playBoot = async () => {
    const audio = bootAudioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;

    try {
      await audio.play();
      setNeedsStart(false);
    } catch {
      setNeedsStart(true);
    }
  };

  useEffect(() => {
    startFadeTimer();
    playBoot();

    return () => {
      window.clearTimeout(fadeTimerRef.current);
    };
  }, []);

  const handleTransitionEnd = (event) => {
    if (event.propertyName === 'opacity' && kuroFading) {
      onFadeComplete();
    }
  };

  return (
    <section className="kuro-stage" aria-label="Kuro intro">
      <audio ref={bootAudioRef} src={bootSound} preload="auto" />

      <button
        className="kuro-icon-button"
        type="button"
        onClick={playBoot}
        aria-label="Start boot sound"
      >
        <img
          className={`kuro-image ${kuroFading ? 'is-fading' : ''}`}
          src={kuroImage}
          alt="Kuro"
          onTransitionEnd={handleTransitionEnd}
        />
      </button>

      <p className={`kuro-prompt ${needsStart ? 'is-needed' : ''}`}>
        Press icon to start
      </p>
    </section>
  );
}

export default KuroStage;

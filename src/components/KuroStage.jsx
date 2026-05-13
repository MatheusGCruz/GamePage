import { useEffect, useRef, useState } from 'react';
import antaresLogo from '../images/antaresLogo.png';
import tryLogo from '../images/tryLogo.png';
import bootSound from '../sounds/boot.mp3';

const DARKEN_DELAY_MS = 3000;
const TRY_LOGO_DELAY_MS = 6000;

function KuroStage({ onFadeComplete }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [antaresFading, setAntaresFading] = useState(false);
  const [tryLogoVisible, setTryLogoVisible] = useState(false);
  const [needsStart, setNeedsStart] = useState(false);
  const bootAudioRef = useRef(null);
  const darkenTimerRef = useRef(null);
  const tryLogoTimerRef = useRef(null);

  const startIntroTimers = () => {
    window.clearTimeout(darkenTimerRef.current);
    window.clearTimeout(tryLogoTimerRef.current);

    darkenTimerRef.current = window.setTimeout(() => {
      setAntaresFading(true);
    }, DARKEN_DELAY_MS);

    tryLogoTimerRef.current = window.setTimeout(() => {
      setTryLogoVisible(true);
    }, TRY_LOGO_DELAY_MS);
  };

  const handleStart = async () => {
    if (hasStarted) {
      return;
    }

    const audio = bootAudioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;

    try {
      await audio.play();
      setHasStarted(true);
      setNeedsStart(false);
      startIntroTimers();
    } catch {
      setNeedsStart(true);
    }
  };

  useEffect(
    () => () => {
      window.clearTimeout(darkenTimerRef.current);
      window.clearTimeout(tryLogoTimerRef.current);
    },
    [],
  );

  const handleBootEnded = () => {
    if (hasStarted) {
      onFadeComplete();
    }
  };

  return (
    <section className="kuro-stage" aria-label="Kuro intro">
      <audio ref={bootAudioRef} src={bootSound} preload="auto" onEnded={handleBootEnded} />

      <button
        className="kuro-icon-button"
        type="button"
        onClick={handleStart}
        aria-label="Start boot sound"
      >
        <img
          className={`kuro-image kuro-image-antares ${antaresFading ? 'is-fading' : ''}`}
          src={antaresLogo}
          alt="Antares"
        />
        <img
          className={`kuro-image kuro-image-try ${tryLogoVisible ? 'is-visible' : ''}`}
          src={tryLogo}
          alt="Try"
        />
      </button>

      <p className={`kuro-prompt ${needsStart ? 'is-needed' : ''} ${hasStarted ? 'is-hidden' : ''}`}>
        Press icon to start
      </p>
    </section>
  );
}

export default KuroStage;

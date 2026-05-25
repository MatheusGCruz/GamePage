import { useEffect, useRef, useState } from 'react';
import logoImage from '../images/logo.png';
import cdSound from '../sounds/cd.mp3';

const items = [
  {
    id: 'select-game',
    label: 'Select game',
    url: null,
  },
  {
    id: 'antares-snake',
    label: 'Antares Snake',
    url: 'https://snake.antares.ninja',
  },
  {
    id: 'mm-checkers',
    label: 'MM Checkers',
    url: 'https://checkers.antares.ninja',
  },
  {
    id: 'galaxy-tetris',
    label: 'Galaxy Tetris',
    url: 'https://galaxytetris.antares.ninja',
  },
];

function SelectionStage({ enabled }) {
  const [selectedItem, setSelectedItem] = useState(items[0].id);
  const [activeItem, setActiveItem] = useState(null);
  const [isLogoAnimating, setIsLogoAnimating] = useState(false);
  const [isFrameRevealing, setIsFrameRevealing] = useState(false);
  const [animationRun, setAnimationRun] = useState(0);
  const cdAudioRef = useRef(null);
  const hasMountedRef = useRef(false);
  const iframeTimerRef = useRef(null);

  const selectedGame = items.find((item) => item.id === selectedItem);
  const activeGame = items.find((item) => item.id === activeItem);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const audio = cdAudioRef.current;

    window.clearTimeout(iframeTimerRef.current);
    setActiveItem(null);
    setIsLogoAnimating(false);
    setIsFrameRevealing(false);
    setAnimationRun((currentRun) => currentRun + 1);

    if (!selectedGame?.url) {
      return undefined;
    }

    setActiveItem(selectedItem);

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }

    requestAnimationFrame(() => {
      setIsLogoAnimating(true);
      setIsFrameRevealing(true);
    });

    iframeTimerRef.current = window.setTimeout(() => {
      setIsLogoAnimating(false);
      setIsFrameRevealing(false);
    }, 6000);

    return () => {
      window.clearTimeout(iframeTimerRef.current);
    };
  }, [selectedGame, selectedItem]);

  useEffect(() => {
    return () => {
      window.clearTimeout(iframeTimerRef.current);
    };
  }, []);

  return (
    <section
      className={`controls-stage ${enabled ? 'is-enabled' : ''}`}
      aria-label="Logo controls"
      aria-hidden={!enabled}
    >
      <audio ref={cdAudioRef} src={cdSound} preload="auto" />

      <label className="item-picker">
        <span>Selection</span>
        <select
          value={selectedItem}
          onChange={(event) => setSelectedItem(event.target.value)}
          disabled={!enabled}
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <div className="game-display">
        {activeGame && (
          <iframe
            className={`game-frame ${isFrameRevealing ? 'is-revealing' : ''}`}
            src={activeGame.url}
            title={activeGame.label}
          />
        )}

        <div className={`logo-wrap ${activeGame && !isLogoAnimating ? 'is-hidden' : ''}`}>
          <img
            key={animationRun}
            className={`logo-image ${isLogoAnimating ? 'is-animating' : ''}`}
            src={logoImage}
            alt="Logo"
          />
        </div>
      </div>
    </section>
  );
}

export default SelectionStage;

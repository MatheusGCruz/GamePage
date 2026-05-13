import { useState } from 'react';
import KuroStage from './components/KuroStage.jsx';
import SelectionStage from './components/SelectionStage.jsx';

function App() {
  const [selectionEnabled, setSelectionEnabled] = useState(false);

  return (
    <main className="page-shell">
      <SelectionStage enabled={selectionEnabled} />
      {!selectionEnabled && <KuroStage onFadeComplete={() => setSelectionEnabled(true)} />}
    </main>
  );
}

export default App;

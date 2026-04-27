import { useState } from 'react';
import SobreManuel from './components/SobreManuel';
import Actividad from './components/Actividad';
import Medicina from './components/Medicina';
import Misiones from './components/Misiones';
import Perfil from './components/Perfil';
import Navbar, { type NavItem } from './components/Navbar';

function App() {
  const [activeTab, setActiveTab] = useState<NavItem>('inicio');

  return (
    <>
      {activeTab === 'inicio' && <SobreManuel />}
      {activeTab === 'actividad' && <Actividad />}
      {activeTab === 'medicina' && <Medicina />}
      {activeTab === 'misiones' && <Misiones />}
      {activeTab === 'perfil' && <Perfil />}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}

export default App;

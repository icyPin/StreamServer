// src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ShowDetails from './pages/ShowDetails';
import SmartVideoPlayer from './pages/SmartVideoPlayer';
import FolderModal from './components/FolderModal'; // Make sure you still have this file!
import './styles/App.css';

function App() {
  const [currentFolder, setCurrentFolder] = useState("Animes");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar 
          currentFolder={currentFolder} 
          onFolderClick={() => setIsModalOpen(true)} 
        />
        
        <main className="main-content">
          <Routes>
            {/* We now pass the targetFolder down to Home */}
            <Route path="/" element={<Home targetFolder={currentFolder} />} />
            <Route path="/show/:showName" element={<ShowDetails />} />
            <Route path="/play" element={<SmartVideoPlayer />} />
          </Routes>
        </main>

        {isModalOpen && (
          <FolderModal 
            initialFolder={currentFolder}
            onClose={() => setIsModalOpen(false)}
            onSubmit={(newFolder) => {
              setCurrentFolder(newFolder);
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ShowDetails from './pages/ShowDetails';
import FolderModal from './components/FolderModal';
import './styles/App.css';

function App() {
  // Library & Navigation States
  const [library, setLibrary] = useState([]);
  const [currentFolder, setCurrentFolder] = useState("/home/icy/Downloads/Animes");
  const [selectedShow, setSelectedShow] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FUTURE GESTURE ENGINE STATES (Month 2 Prep)
  const [gestureStatus, setGestureStatus] = useState("Disconnected");
  const [lastActiveGesture, setLastActiveGesture] = useState("None");
  const videoRef = useRef(null);
  const socketRef = useRef(null); // Reserved for Python WebSocket connection

  // Fetch media library data from Spring Boot backend
  const fetchLibrary = async (folderPath) => {
    try {
      const response = await fetch(
        `http://localhost:8086/api/v1/library/scan?rootPath=${encodeURIComponent(folderPath)}`
      );
      if (!response.ok) throw new Error("Server error scanning directory");
      const data = await response.json();
      setLibrary(data);
    } catch (err) {
      console.error("Failed to sync local media library:", err);
    }
  };

  // Automatically refresh library when folder changes
  useEffect(() => {
    if (currentFolder) {
      fetchLibrary(currentFolder);
    }
  }, [currentFolder]);

  // Handle returning to main view
  const handleResetNavigation = () => {
    setSelectedShow(null);
    setCurrentVideoUrl("");
  };

  return (
    <div className="app-layout">
      <Navbar 
        onLogoClick={handleResetNavigation}
        onFolderIconClick={() => setIsModalOpen(true)}
        currentFolder={currentFolder}
        gestureStatus={gestureStatus}
      />

      <main className="content-frame">
        {/* Render views dynamically based on user navigation */}
        {currentVideoUrl ? (
          <div className="cinema-wrapper">
            <button className="nav-back-button" onClick={() => setCurrentVideoUrl("")}>
              ← Back to Episodes
            </button>
            <video ref={videoRef} src={currentVideoUrl} controls className="native-player" autoPlay />
          </div>
        ) : selectedShow ? (
          <ShowDetails 
            show={selectedShow} 
            onBackClick={() => setSelectedShow(null)}
            onEpisodeSelect={setCurrentVideoUrl}
          />
        ) : (
          <Home 
            library={library} 
            onShowSelect={setSelectedShow} 
            currentFolder={currentFolder}
          />
        )}
      </main>

      {/* Dynamic Directory Configuration Overlay */}
      {isModalOpen && (
        <FolderModal 
          onClose={() => setIsModalOpen(false)}
          onSubmit={setCurrentFolder}
          initialFolder={currentFolder}
        />
      )}
    </div>
  );
}

export default App;
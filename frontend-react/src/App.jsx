import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ShowDetails from './pages/ShowDetails';
import FolderModal from './components/FolderModal';
import SmartVideoPlayer from './components/SmartVideoPlayer'; // Import the new player
import './styles/App.css';

function App() {
  const [library, setLibrary] = useState([]);
  
  // Set default to just "Animes" to match the Docker setup from your Postman screenshot
  const [currentFolder, setCurrentFolder] = useState("Animes"); 
  const [selectedShow, setSelectedShow] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FUTURE GESTURE ENGINE STATES 
  const [gestureStatus, setGestureStatus] = useState("Disconnected");

  const laptopIp = window.location.hostname;

  const fetchLibrary = async (folder) => {
    try {
      const response = await fetch(
        `http://${laptopIp}:8086/api/v1/library/scan?rootPath=${encodeURIComponent(folder)}`
      );
      if (!response.ok) throw new Error("Server error scanning directory");
      const data = await response.json();
      setLibrary(data);
    } catch (err) {
      alert("Failed to sync media library. Check console for details: " + err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentFolder) {
      fetchLibrary(currentFolder);
    }
  }, [currentFolder]);

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
        {currentVideoUrl ? (
          
          /* THE NEW PLAYER COMPONENT REPLACES THE OLD RAW VIDEO TAG */
          <SmartVideoPlayer 
            filePath={currentVideoUrl} 
            onBack={() => setCurrentVideoUrl("")} 
          />

        ) : selectedShow ? (
          <ShowDetails 
            show={selectedShow} 
            onBackClick={() => setSelectedShow(null)}
            onEpisodeSelect={setCurrentVideoUrl} // Passes the raw path to the player!
          />
        ) : (
          <Home 
            library={library} 
            onShowSelect={setSelectedShow} 
            currentFolder={currentFolder}
          />
        )}
      </main>

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
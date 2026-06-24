import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Film } from 'lucide-react';

export default function Home({ targetFolder }) {
  const [library, setLibrary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const laptopIp = window.location.hostname;

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://${laptopIp}:8086/api/v1/library/scan?rootPath=${encodeURIComponent(targetFolder)}`
        );
        if (!response.ok) throw new Error("Server error scanning directory");
        const data = await response.json();
        setLibrary(data);
      } catch (err) {
        console.error("Failed to fetch library:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, [laptopIp, targetFolder]);

  const handleShowClick = (show) => {
    navigate(`/show/${encodeURIComponent(show.showName)}`, { 
      state: { showData: show } 
    });
  };

  const filteredLibrary = library.filter(show => 
    show.showName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div style={{ color: "var(--text-muted)" }}>Scanning {targetFolder}...</div>;
  }

  return (
    <div className="home-container">
      <h2 className="section-title">
        {searchQuery ? `Search Results for "${searchQuery}"` : `Recently Added`}
      </h2>
      
      {filteredLibrary.length === 0 ? (
        <div style={{ color: "var(--text-muted)", marginTop: "2rem" }}>
          No shows found matching your search.
        </div>
      ) : (
        <div className="grid-container">
          {filteredLibrary.map((show, index) => (
            <div 
              key={index} 
              className="show-card"
              onClick={() => handleShowClick(show)}
            >
              <div className="card-image-wrapper">
                {show.thumbnailUrl ? (
                  <img src={`http://${laptopIp}:8086${show.thumbnailUrl}`} alt={show.showName} className="card-image" />
                ) : (
                  <Film size={48} color="var(--text-muted)" />
                )}
              </div>
              <div className="card-title">
                {show.showName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Film } from 'lucide-react';

export default function ShowDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const ip = window.location.hostname;
  const show = location.state?.showData;

  if (!show) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2>Show not found</h2>
        <button className="back-btn" onClick={() => navigate('/')}>Return to Library</button>
      </div>
    );
  }

  const handleEpisodeClick = (episode) => {
    navigate('/play', { 
      state: { 
        filePath: episode.filePath,
        title: episode.title,
        showName: show.showName
      } 
    });
  };

  return (
    <div className="show-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back to Library
      </button>

      <div className="show-header">
        {show.thumbnailUrl ? (
          <img src={`http://${ip}:8086${show.thumbnailUrl}`} alt={show.showName} className="show-hero-image" />
        ) : (
          <div className="show-hero-image" style={{ backgroundColor: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <Film size={64} color="var(--text-muted)" />
          </div>
        )}
        <div>
          <h1 className="show-title-large">{show.showName}</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>
            {show.episodes.length} Episodes
          </p>
        </div>
      </div>

      <h3 className="section-title">Episodes</h3>
      <div className="episode-list">
        {show.episodes.map((episode, index) => (
          <div 
            key={index} 
            className="episode-row"
            onClick={() => handleEpisodeClick(episode)}
          >
            <div className="episode-number">{index + 1}</div>
            <Play size={18} color="var(--accent)" />
            <div>{episode.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
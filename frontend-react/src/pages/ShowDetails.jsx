import React from 'react';
import '../styles/ShowDetails.css';

function ShowDetails({ show, onBackClick, onEpisodeSelect }) {
  const episodesList = show.episodes || [];

  return (
    <div className="show-details-view">
      {/* Navigation Header */}
      <div className="details-header-nav">
        <button className="back-navigation-anchor" onClick={onBackClick}>
          <span className="arrow-vector">←</span> Back to Collections
        </button>
      </div>

      {/* Show Spotlight Banner */}
      <div className="show-spotlight-hero">
        <div className="hero-banner-art">
          <span>{show.showName ? show.showName.charAt(0).toUpperCase() : '?'}</span>
        </div>
        <div className="hero-spotlight-meta">
          <h2 className="spotlight-title">{show.showName}</h2>
          <p className="spotlight-stats-badge">{episodesList.length} Available Volumes</p>
        </div>
      </div>

      {/* Dynamic Episode Grid/List */}

      <section className="episode-manifest-container">
        <div className="manifest-header-row">
          <h3>Episodes</h3>
        </div>

        {episodesList.length === 0 ? (
          <div className="empty-episodes-fallback">
            <p>No playable media containers identified within this folder index.</p>
          </div>
        ) : (
          <div className="manifest-table-rows">
            {episodesList.map((episode, index) => {
             
              const cleanTitle = episode.title ? episode.title.replace(".mp4", "") : `Volume ${index + 1}`;
              
              return (
                <div 
                  key={episode.title || index} 
                  className="episode-interactive-row"
                  onClick={() => onEpisodeSelect(episode.filePath)}
                >
                  <div className="row-left-index">
                    <span className="track-number">{index + 1}</span>
                    <span className="inline-play-glyph">▶</span>
                  </div>
                  <div className="row-right-details">
                    <span className="episode-media-title">{cleanTitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default ShowDetails;
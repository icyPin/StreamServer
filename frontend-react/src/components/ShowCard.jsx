import React from 'react';

function ShowCard({ show, onClick }) {
  const totalEpisodes = show.episodes ? show.episodes.length : 0;
  // Fallback icon token derived from first char
  const fallbackToken = show.showName ? show.showName.charAt(0).toUpperCase() : '?';

  return (
    <div className="show-card" onClick={onClick}>
      <div className="card-poster-placeholder">
        <span>{fallbackToken}</span>
      </div>
      <div className="card-meta">
        <h3>{show.showName || "Unknown Title"}</h3>
        <p>{totalEpisodes} {totalEpisodes === 1 ? 'Episode' : 'Episodes'}</p>
      </div>
    </div>
  );
}

export default ShowCard;
import React from 'react';
import '../styles/Navbar.css';

function Navbar({ onLogoClick, onFolderIconClick, currentFolder, gestureStatus }) {
  
  const folderDisplay = currentFolder.substring(currentFolder.lastIndexOf('/') + 1) || "Root";

  return (
    <nav className="global-navbar">
      <div className="nav-left-branding" onClick={onLogoClick}>
        <span className="brand-logo-main">NETFLIX</span>
        <span className="brand-logo-sub">_GESTURE</span>
      </div>

      <div className="nav-right-controls">
        <div className="gesture-telemetry-badge">
          <span className={`status-node ${gestureStatus.toLowerCase()}`}></span>
          <span className="telemetry-label">Gesture System: {gestureStatus}</span>
        </div>

        <button className="directory-anchor-button" onClick={onFolderIconClick} title={currentFolder}>
          <span className="folder-icon-graphic">📁</span>
          <span className="directory-path-text">/{folderDisplay}</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
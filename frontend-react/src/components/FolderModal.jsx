import React, { useState } from 'react';
import '../styles/FolderModal.css';

function FolderModal({ onClose, onSubmit, initialFolder }) {
  const [inputPath, setInputPath] = useState(initialFolder);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputPath.trim()) {
      onSubmit(inputPath.trim());
      onClose();
    }
  };

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div className="modal-surface-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-block">
          <h3>Configure Media Source</h3>
          <button className="modal-close-x" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleFormSubmit} className="modal-form-layout">
          <p className="modal-instruction-text">
            Provide the absolute filesystem path to the directory containing your structured media folders.
          </p>
          
          <div className="input-group-wrapper">
            <label htmlFor="directory-path-input">Absolute Directory Path</label>
            <input 
              id="directory-path-input"
              type="text" 
              value={inputPath}
              onChange={(e) => setInputPath(e.target.value)}
              placeholder="/home/username/media"
              autoFocus
              required
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Scan & Mount
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FolderModal;
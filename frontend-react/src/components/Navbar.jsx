// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderOpen, Search, Settings, X } from 'lucide-react';

export default function Navbar({ currentFolder, onFolderClick }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // This dynamically updates the URL as you type without reloading the page!
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        STREAM<span style={{ color: "var(--text-main)" }}>SERVER</span>
      </Link>
      
      <div className="nav-actions">
        {/* Dynamic Search Bar Toggle */}
        {isSearchOpen ? (
          <div style={{ 
            display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface)', 
            borderRadius: 'var(--radius-md)', padding: '6px 12px' 
          }}>
            <Search size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
            <input
              type="text"
              autoFocus
              placeholder="Search library..."
              value={searchQuery}
              onChange={handleSearch}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '150px' }}
            />
            <button className="icon-btn" onClick={() => setIsSearchOpen(false)} style={{ padding: '2px', marginLeft: '4px' }}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <button className="icon-btn" title="Search" onClick={() => setIsSearchOpen(true)}>
            <Search size={20} />
          </button>
        )}

        {/* Dynamic Folder Button */}
        <button 
          className="icon-btn" 
          title="Change Folder" 
          onClick={onFolderClick}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}
        >
          <FolderOpen size={18} color="var(--accent)" />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
            {currentFolder}
          </span>
        </button>

        <button className="icon-btn" title="Settings">
          <Settings size={20} />
        </button>
      </div>
    </nav>
  );
}
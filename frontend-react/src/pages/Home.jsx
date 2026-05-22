import React from 'react';
import ShowCard from '../components/ShowCard';
import '../styles/Home.css';

function Home({ library, onShowSelect, currentFolder }) {
  const isLibraryEmpty = !library || library.length === 0;

  return (
    <div className="home-dashboard-view">
      <div className="dashboard-hero-title">
        <h2>Local Catalog</h2>
      </div>

      {isLibraryEmpty ? (
        <div className="empty-catalog-fallback">
          <div className="fallback-art">📭</div>
          <h3>Your Library is Empty</h3>
          <p>
            No valid collections discovered. Ensure your targeted directory houses sub-folders containing standard <code>.mp4</code> containers.
          </p>
        </div>
      ) : (
        <section className="catalog-grid-row">
          {library.map((show, index) => (
            <ShowCard 
              key={show.showName || index} 
              show={show} 
              onClick={() => onShowSelect(show)} 
            />
          ))}
        </section>
      )}
    </div>
  );
}

export default Home;
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function SmartVideoPlayer({ filePath, onBack }) {
  const videoRef = useRef(null);
  const laptopIp = window.location.hostname;
  
  // 1. Detect if the user is on a mobile device
  const isMobile = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  //const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const encodedPath = encodeURIComponent(filePath);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isMobile) {
      // --- MOBILE: HLS STREAMING ---
      console.log("Mobile device detected, attempting HLS streaming");
      const hlsUrl = `http://${laptopIp}:8086/api/v1/video/hls?filePath=${encodedPath}`;

      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferLength: 30, // Keep buffer small for live transcoding
          maxMaxBufferLength: 60,
        });

        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS Manifest loaded, ready to play!");
          video.play().catch(e => console.log("Autoplay blocked"));
        });

        return () => {
          hls.destroy(); // Cleanup when user closes video
        };
      } 
      // Fallback for Safari (which supports HLS natively without hls.js)
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
        video.addEventListener('loadedmetadata', () => video.play());
      }
    } else {
      // --- DESKTOP: DIRECT MP4 PLAY ---
      video.src = `http://${laptopIp}:8086/api/v1/video/stream?filePath=${encodedPath}`;
      video.play().catch(e => console.log("Autoplay blocked"));
    }
  }, [filePath, isMobile, laptopIp, encodedPath]);

  return (
    <div className="cinema-wrapper" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        className="nav-back-button" 
        onClick={onBack}
        style={{ marginBottom: '10px', padding: '8px 16px', cursor: 'pointer' }}
      >
        ← Back to Episodes
      </button>
      
      <video 
        ref={videoRef} 
        controls 
        playsInline 
        className="native-player"
        style={{ width: "100%", height: "auto", backgroundColor: 'black', borderRadius: '8px' }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
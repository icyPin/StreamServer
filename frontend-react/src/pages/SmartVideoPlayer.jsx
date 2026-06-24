import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Hls from 'hls.js';

export default function SmartVideoPlayer() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Retrieve the strict data passed from the Episode row
  const filePath = location.state?.filePath;
  const title = location.state?.title || "Unknown Episode";
  const showName = location.state?.showName || "";

  const isHostMachine = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const laptopIp = window.location.hostname;
  
  useEffect(() => {
    if (!filePath) return;
    
    const video = videoRef.current;
    if (!video) return;

    const encodedPath = encodeURIComponent(filePath);

    if (isHostMachine) {
      // PC: Direct Stream
      video.src = `http://${laptopIp}:8086/api/v1/video/stream?filePath=${encodedPath}`;
      video.play().catch(e => console.log("Playback delayed:", e));
    } else {
      // Mobile: HLS Stream
      const hlsUrl = `http://${laptopIp}:8086/api/v1/video/hls?filePath=${encodedPath}`;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(e => console.log(e));
        });

        return () => hls.destroy();
      } 
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
        video.addEventListener('loadedmetadata', () => {
            video.play().catch(e => console.log(e));
        });
      }
    }
  }, [filePath, isHostMachine, laptopIp]);

  if (!filePath) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2>Invalid Video Source</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="cinema-container">
      <div className="cinema-header">
        <button className="back-btn" style={{ marginBottom: 0 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back to {showName}
        </button>
        <h3 style={{ color: "var(--text-main)", fontWeight: 500 }}>{title}</h3>
      </div>
      
      <div className="video-wrapper">
        <video 
          ref={videoRef} 
          controls 
          autoPlay
          playsInline 
          className="native-player"
        />
      </div>
    </div>
  );
}
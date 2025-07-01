'use client';
import { useState } from 'react';
import CorePage from '@/layout/CorePage';
import { MusicReccPlaylistId } from './config';

export default function Client() {
  const [loading, setLoading] = useState(true);

  return (
    <CorePage header="Music">
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        <iframe
          title="Spotify Embed: Recommendation Playlist"
          src={`https://open.spotify.com/embed/playlist/${MusicReccPlaylistId}?utm_source=generator&theme=0`}
          width="100%"
          height="600"
          style={{ border: 'none', borderRadius: '12px' }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          onLoad={() => setLoading(false)}
        />
      </div>
    </CorePage>
  );
}

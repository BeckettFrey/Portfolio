import CorePage from '@/layout/CorePage';
import { MusicReccPlaylistId } from './config';

export const metadata = {
  title: 'Music | Beckett Frey',
  description: 'Explore Beckett Frey\'s music.',
};

export default function MusicPage() {
  return (
    <CorePage
    header="Music">
      <iframe
        title="Spotify Embed: Recommendation Playlist"
        src={`https://open.spotify.com/embed/playlist/${MusicReccPlaylistId}?utm_source=generator&theme=0`}
        width="100%"
        height="600"
        style={{ border: 'none', borderRadius: '12px' }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </CorePage>
  );
}

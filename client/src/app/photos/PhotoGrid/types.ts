
export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
}

export interface PhotoGridProps {
  selectedPhoto: PhotoItem | null;
  setSelectedPhoto: (photo: PhotoItem | null) => void;
  config: PhotoItem[];
}
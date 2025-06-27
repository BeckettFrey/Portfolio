import { ColorClassId } from '@/globals/types';

export interface LinkItem {
  label: string;
  url: string;
  icon: string; 
  color: ColorClassId;
  external?: boolean;
  download?: string;
}

export interface ButtonGridProps {
  links: LinkItem[];
  shuffleSelect?: boolean;
}

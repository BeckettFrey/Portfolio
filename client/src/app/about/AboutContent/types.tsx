import { COLOR_CLASSES } from "@/globals/constants";

export interface InterestItem {
  icon: string;
  text: string;
  color: keyof typeof COLOR_CLASSES;
}

export interface AboutConfig {
  greeting: string;
  name: string;
  introduction: string;
  education: {
    title: string;
    subtitle: string;
  };
  role: {
    title: string;
    subtitle: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
  };
  technicalInterests: readonly InterestItem[];
  personalInterests: readonly InterestItem[];
  callToAction: {
    title: string;
    description: string;
  };
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  iconColor: keyof typeof COLOR_CLASSES;
}
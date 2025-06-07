import coreConfig from './config.json';
import type { PortfolioConfig } from './config';

const typedConfig = coreConfig as PortfolioConfig;

export const projectsConfig = typedConfig.projects;
export const aboutConfig = typedConfig.about;
export const photosConfig = typedConfig.photos;

export const FORMSPREE_CODE: string = import.meta.env.VITE_FORMSPREE_CODE;
export const LINKEDIN_URL: string = import.meta.env.VITE_LINKEDIN_URL;
export const GITHUB_USERNAME: string = import.meta.env.VITE_GITHUB_USERNAME;
export const PORTFOLIO_CONFIG_REPO: string = import.meta.env.VITE_PORTFOLIO_CONFIG_REPO;

if (!FORMSPREE_CODE) {
  throw new Error('VITE_FORMSPREE_CODE is not defined. Please set it in your environment variables.');
}
if (!LINKEDIN_URL) {
  throw new Error('VITE_LINKEDIN_URL is not defined. Please set it in your environment variables.');
}
if (!GITHUB_USERNAME) {
  throw new Error('VITE_GITHUB_USERNAME is not defined. Please set it in your environment variables.');
}
if (!PORTFOLIO_CONFIG_REPO) {
  throw new Error('VITE_PORTFOLIO_CONFIG_REPO is not defined. Please set it in your environment variables.');
}

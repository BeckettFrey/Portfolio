// This file is used to loading user specific configuration from the environment variables.
export const FORMSPREE_CODE = import.meta.env.VITE_FORMSPREE_CODE;
export const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL;
export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME;
export const PORTFOLIO_CONFIG_REPO = import.meta.env.VITE_PORTFOLIO_CONFIG_REPO;

if (!FORMSPREE_CODE) {
    throw new Error("VITE_FORMSPREE_CODE is not defined. Please set it in your environment variables.");
    }
if (!LINKEDIN_URL) {
    throw new Error("VITE_LINKEDIN_URL is not defined. Please set it in your environment variables.");
    }
if (!GITHUB_USERNAME) {
    throw new Error("VITE_GITHUB_USERNAME is not defined. Please set it in your environment variables.");
    }
if (!PORTFOLIO_CONFIG_REPO) {
    throw new Error("VITE_PORTFOLIO_CONFIG_REPO is not defined. Please set it in your environment variables.");
    }
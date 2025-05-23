# MyWebsite Frontend

This is the frontend for **MyWebsite**, a dynamic portfolio and project showcase built with React.  
It loads configuration and content dynamically from a remote JSON file, allowing you to update your site without redeploying.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Required Assets](#required-assets)
- [Dynamic Configuration](#dynamic-configuration)
- [Example `config.json`](#example-configjson)
- [Customization](#customization)

---

## Features

- **Dynamic Portfolio:** Projects, about info, and more are loaded from a remote JSON config.
- **Contact Form:** Integrated with Formspree.
- **Games & Interactive Pages:** Easily add custom pages or games.
- **Responsive Design:** Built with Tailwind CSS for modern, mobile-friendly layouts.

---

## Getting Started

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```

2. **Add assets:**
   - Place your favicon at: `public/favicon.ico`
   - Place your profile image at: `src/assets/profile.png`
   - Place your background image at: `public/desktop_background.png` (optional)

3. **Configure environment variables:**  
   Create a `.env` file in the root of `frontend/` with the following content (see [Environment Variables](#environment-variables)).

4. **Start the development server:**
   ```sh
   npm run dev
   ```

---

## Environment Variables

Create a `.env` file in your `frontend/` directory:

```env
# Contact Form Configuration
VITE_FORMSPREE_CODE=your-formspree-code

# LinkedIn URL
VITE_LINKEDIN_URL=https://www.linkedin.com/in/your-linkedin

# GitHub Profile (for consistency across pages)
VITE_GITHUB_USERNAME=your-github-username

# Portfolio Configuration repo
VITE_PORTFOLIO_CONFIG_REPO=your-config-repo
```

- **Note:**  
  The app fetches its configuration from  
  `https://raw.githubusercontent.com/[VITE_GITHUB_USERNAME]/[VITE_PORTFOLIO_CONFIG_REPO]/main/config.json`

---

## Required Assets

- `public/favicon.ico` — Your site favicon.
- `src/assets/profile.png` — Your profile picture (displayed on the About page).

---

## Dynamic Configuration

**This app does NOT store portfolio content in the build.**  
Instead, it fetches all content from a remote `config.json` file in a GitHub repository you control.

### How it works

- Set `VITE_GITHUB_USERNAME` and `VITE_PORTFOLIO_CONFIG_REPO` in your `.env`.
- Create a public repository (e.g., `portfolio-config`) on your GitHub.
- Add a `config.json` file at the root of that repo.
- The frontend will fetch and use this file for all portfolio content.

---

## Example `config.json`

Below is a minimal example.  

```json
{
  "projects": {
    "header": {
      "title": "My Projects",
      "description": "A curated collection of projects I've built and contributed to."
    },
    "error": {
      "title": "Setup Required",
      "emoji": "⚙️",
      "instructions": [
        "Create a repository named \"portfolio-config\"",
        "Add a \"projects.json\" file",
        "List your featured projects"
      ],
      "tryAgainButton": "Try Again"
    },
    "stats": {
      "projects": { "title": "Featured Projects" },
      "languages": { "title": "Languages Used" },
      "highlighted": { "title": "Highlighted" }
    },
    "projects": {
      "highlightBadge": "⭐ FEATURED PROJECT",
      "techStackLabel": "Tech Stack:",
      "noDescription": "No description available",
      "viewCodeButton": "View Code",
      "liveDemoButton": "Live Demo"
    },
    "empty": {
      "emoji": "🚀",
      "title": "No projects configured yet",
      "description": "Set up your portfolio configuration to showcase your best work!",
      "githubButton": "Visit My GitHub",
      "githubUrl": "https://github.com/your-username"
    },
    "setup": {
      "title": "💡 How to Update Your Projects",
      "instructions": [
        { "text": "Go to your", "code": "portfolio-config", "afterText": "repository" },
        { "text": "Edit the", "code": "projects.json", "afterText": "file" },
        { "text": "Add, remove, or reorder your featured projects" },
        { "text": "Changes will appear automatically on your website!" }
      ]
    },
    "footer": {
      "text": "Projects dynamically loaded from GitHub",
      "githubLinkText": "profile",
      "githubUrl": "https://github.com/your-username"
    },
    "featured_projects": [
      {
        "repo_name": "ProjectOne",
        "custom_description": "A modern web app.",
        "highlight": true,
        "demo_url": "https://your-demo.com",
        "tech_stack": ["React", "Node.js"],
        "order": 1
      }
    ]
  },
  "about": {
    "header": { "title": "About Me" },
    "profile": {
      "greeting": "Hey there! 👋",
      "name": "Your Name",
      "introduction": "I'm {name}, a passionate developer.",
      "quickStats": {
        "education": { "title": "BS Graduate", "subtitle": "Your University" },
        "role": { "title": "Developer", "subtitle": "Full Stack" }
      }
    },
    "technicalInterests": {
      "title": "Technical Interests",
      "items": [
        { "icon": "FaCode", "text": "Web & App Development", "color": "blue" }
      ]
    },
    "personalInterests": {
      "title": "Beyond Code",
      "items": [
        { "icon": "FaBook", "text": "Reading", "color": "yellow" }
      ]
    },
    "callToAction": {
      "title": "Let's Work Together!",
      "description": "I'm open to freelance opportunities.",
      "socialLinks": [
        { "platform": "GitHub", "url": "https://github.com/your-username", "icon": "FaGithub", "iconColor": "black" }
      ]
    },
    "footer": {
      "credits": "Icons by React Icons",
      "creditsUrl": "https://react-icons.github.io/react-icons/"
    }
  }
}
```

---

## Customization

- **Update your `config.json`** at any time — changes will appear automatically.
- **Add or remove featured projects** by editing the `featured_projects` array.
- **Edit About, Interests, and Social Links** in the `about` section.

---

## Notes

- Make sure your config repo is public and the file is accessible at  
  `https://raw.githubusercontent.com/[username]/[repo]/main/config.json`
- If you change your GitHub username or repo, update your `.env` accordingly.

---

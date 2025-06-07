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
  `https://raw.githubusercontent.com/[VITE_GITHUB_USERNAME]/[VITE_PORTFOLIO_CONFIG_REPO]/src/config.json`

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
      "description": "A collection of projects I've built and contributed to. Each represents a unique challenge and learning experience. For a broader scope and additional projects view my resume."
    },
    "featured_projects": [
      {
        "repo_name": "ProjectOne",
        "custom_description": "A personal website showcasing a portfolio and skills; modular and easy to maintain.",
        "highlight": true,
        "demo_url": "https://yourusername/ProjectOne",
        "languages": ["JavaScript", "HTML", "CSS"],
        "tech_stack": ["React", "Node.js", "Socket.io"],
        "order": 1
      },
      {
        "repo_name": "ProjectTwo",
        "custom_description": "A capstone app that helps users keep track of tasks and schedules.",
        "highlight": true,
        "demo_url": "https://yourusername/ProjectTwo",
        "languages": ["JavaScript", "Python", "HTML", "CSS"],
        "tech_stack": ["React", "Tailwind CSS", "Django", "MySQL"],
        "order": 2
      },
      {
        "repo_name": "ProjectThree",
        "custom_description": "A modern game built with a sleek UI.",
        "highlight": false,
        "demo_url": "https://yourusername/ProjectThree",
        "languages": ["JavaScript", "HTML", "CSS"],
        "tech_stack": ["React", "Node.js", "Socket.io"],
        "order": 3
      },
      {
        "repo_name": "ProjectFour",
        "custom_description": "Efficient scheduling system for teams.",
        "highlight": false,
        "demo_url": "https://yourusername/ProjectFour",
        "tech_stack": ["Django", "MySQL"],
        "languages": ["Python", "JavaScript"],
        "order": 4
      }
    ]
  },
  "about": {
    "header": {
      "title": "About Me"
    },
    "profile": {
      "greeting": "Hello! 👋",
      "name": "Your Name",
      "introduction": "I'm an aspiring developer with a passion for building things end to end, from the initial concept to the final deployment. My journey in tech has been fueled by a love for problem-solving and a fascination with the ever-evolving world of computer technology.",
      "education": {
        "title": "Degree Title",
        "subtitle": "Your University"
      },
      "role": {
        "title": "Aspiring Developer",
        "subtitle": "Full Stack"
      }
    },
    "technicalInterests": {
      "title": "Technical Interests",
      "items": [
        {
          "icon": "FaCode",
          "text": "Web & App Development",
          "color": "blue"
        },
        {
          "icon": "FaBrain",
          "text": "AI & Neural Networks",
          "color": "purple"
        },
        {
          "icon": "FaAtom",
          "text": "Quantum Computing",
          "color": "green"
        }
      ]
    },
    "personalInterests": {
      "title": "Beyond Code",
      "items": [
        {
          "icon": "FaUtensils",
          "text": "Cooking & Culinary Arts",
          "color": "orange"
        },
        {
          "icon": "FaDumbbell",
          "text": "Fitness & Active Lifestyle",
          "color": "red"
        },
        {
          "icon": "FaBook",
          "text": "Philosophy & Deep Thinking",
          "color": "yellow"
        }
      ]
    },
    "callToAction": {
      "title": "Let's Collaborate and Create!",
      "description": "I'm actively seeking freelance opportunities and always eager to expand my skills. Have a project in mind or just want to connect?"
    }
  },
  "photos": [
    { "id": 1, "url": "/photo1.jpg", "caption": "Photo 1" },
    { "id": 2, "url": "/photo2.jpg", "caption": "Photo 2" },
    { "id": 3, "url": "/photo3.jpg", "caption": "Photo 3" }
  ]
}
```
  "projects": {
    "header": {
      "title": "My Projects",
      "description": "A collection of projects I've built and contributed to. Each represents a unique challenge and learning experience. For a broader scope and additional projects view my resume."
    },
    "featured_projects": [
      {
        "repo_name": "MyWebsite",
        "custom_description": "My personal website showcasing my portfolio and skills; modular and easy to maintain, (You're currently viewing it!)",
        "highlight": true,
        "demo_url": "https://beckettfrey/MyWebsite",
        "languages": ["JavaScript", "HTML", "CSS"],
        "tech_stack": ["React", "Node.js", "Socket.io"],
        "order": 1
      },
      {
        "repo_name": "UPlant",
        "custom_description": "(capstone) A plant care app that helps you keep track of your plants' needs and schedules",
        "highlight": true,
        "demo_url": "https://beckettfrey/UPlant",
        "languages": ["JavaScript", "Python", "HTML", "CSS"],
        "tech_stack": ["React", "Tailwind CSS", "Django", "MySQL"],
        "order": 2
      },
      {
        "repo_name": "ChessClassic",
        "custom_description": "A modern chess game built with sleek UI",
        "highlight": false,
        "demo_url": "https://beckettfrey/ChessClassic",
        "languages": ["JavaScript", "HTML", "CSS"],
        "tech_stack": ["React", "Node.js", "Socket.io"],
        "order": 3
      },
      {
        "repo_name": "TA-Scheduling-App",
        "custom_description": "Efficient scheduling system for teaching assistants",
        "highlight": false,
        "demo_url": "https://beckettfrey/TA-Scheduling-App",
        "tech_stack": ["Django", "MySQL"],
        "languages": ["Python", "JavaScript"],
        "order": 4
      }
    ]
  },
  "about": {
    "header": {
      "title": "About Me"
    },
    "profile": {
      "greeting": "Hey there! 👋",
      "name": "Beckett",
      "introduction": "I'm Beckett, an aspiring developer from Madison, Wisconsin, with a BS in Computer Science from UW-Milwaukee. This is my portfolio, I wanted to create something that was slightly more informative than the typical static portfolio, so I've been working on this to showcase my projects and let whoever's watching get to know me a little better especially perspective employers and clients. I love building things end to end, from the initial concept to the final deployment. So far my journey in tech has been fueled by a love for problem-solving and a fascination with the ever-evolving world of computer technology. Portfolio / Gitfolio / Build Lab, call it what you will, I hope you enjoy your stay!",
      "education": {
        "title": "BS Graduate",
        "subtitle": "UW-Milwaukee"
      },
      "role": {
        "title": "Aspiring Developer",
        "subtitle": "Full Stack"
      }
    },
    "technicalInterests": {
      "title": "Technical Interests",
      "items": [
        {
---

## Customization

- **Update your `config.json`** at any time — changes will appear automatically.
- **Add or remove featured projects** by editing the `featured_projects` array.
- **Edit About, Interests, and Social Links** in the `about` section.

---

## Notes

- Make sure your config repo is public and the file is accessible at  
  `https://raw.githubusercontent.com/[username]/[repo]/src/config.json`
- If you change your GitHub username or repo, update your `.env` accordingly.

---

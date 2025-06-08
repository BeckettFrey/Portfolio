# Portfolio

A personal developer portfolio built with **React**, **Vite**, and **Tailwind CSS**, showcasing projects, photos, and a playful desktop-inspired interface. It also includes embedded games like Flappy Bird to reflect personality and creativity.

![Profile Shot](./client/src/assets/profile.png)

---

## 🌟 Features

- 🖥️ **Desktop-style UI** with draggable windows and simulated environment
- 📷 **Photo gallery** featuring personal photos and captions
- 👨‍💻 **Projects page** with featured work, live demos, and source links
- 🧠 **About section** with education, role, interests, and location
- 🎮 **Games** like Flappy Bird integrated into the portfolio
- 📨 **Contact form** powered by Formspree
- 🔗 Easy linking to GitHub, LinkedIn, and other platforms

---

## ⚙️ Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

### 4. Or build for production

```bash
npm run build
```

---

## 🔧 Configuration

All content is configured using a centralized JSON file:

`/client/src/pages/core/config/config.json`

Defines:
- 🧾 **About Info**: name, intro, education, role, location, interests
- 📂 **Projects**: titles, descriptions, demo URLs, tech stack
- 📸 **Photos**: gallery images with captions

---

## 🧾 TypeScript Interface

Configuration is strongly typed using:

`/client/src/pages/core/config/config.ts`

---

## 🖼️ Assets

### Profile Photo
Place your face shot here:
```
/client/src/assets/profile.png
```

### Additional Photos
Add additional gallery images to the public directory:
```
/client/public/
```
Then reference them in `config.json` using public URLs (e.g., `"/hiking.png"`, `"/conference.jpg"`).

### Favicon
Add your favicon here:
```
/client/public/favicon.ico
```

---

## 🔐 Environment Variables

Configure these in a `.env` file under `/frontend`:

```env
# Contact Form Configuration
VITE_FORMSPREE_CODE=

# LinkedIn URL
VITE_LINKEDIN_URL=

# GitHub Username
VITE_GITHUB_USERNAME=
```

---

## 📄 License

MIT – free to use, modify, and distribute.

---

## 🙌 Acknowledgments

Built with attention to polish, personality, and developer experience. Designed to reflect your work, your interests, and your story — all in one place.
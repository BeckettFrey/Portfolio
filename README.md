# Portfolio

[Live @ beckettfrey.com](https://beckettfrey.com)

![Profile Shot](./client/src/assets/profile.png)

---

## 🌟 Features

- 🖥️ **Desktop-style UI** with draggable windows and simulated environment  
- 📷 **Photo gallery** featuring personal photos and captions  
- 👨‍💻 **Projects page** with featured work, live demos, and source links  
- 🧠 **About section** with education, role, interests, location, etc.  
- 🎮 **Games** like Flappy Bird integrated into the portfolio  
- 📄 **Resume download** with custom filename for easy saving and sharing  
- 📨 **Contact form** powered by Formspree  
- 🔗 Easy linking to GitHub and LinkedIn  

---

## ⚙️ Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/beckettfrey/Portfolio.git
cd Portfolio/client
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

### Resume
Add your resume PDF here:
```
/client/public/documents/resume.pdf
```

### Photo Gallery
Optionally add gallery images to the gallery directory:
```
/client/public/gallery/
```
Then reference them in `config.json` using public URLs (e.g., `"/gallery/hiking.png"`, `"/gallery/conference.jpg"`).

### Favicon
Add your favicon here:
```
/client/public/favicon.ico
```

---

## 🔐 Environment Variables

Configure these in a `.env` file under `/client`:

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

# 🖊️ ImageCompress


A fast, browser-based image compression tool built with React. Compress JPG, PNG, SVG, and GIF files without losing quality — all processing happens in your browser, no uploads to any server.

**Now with authentication (Google & Email), free trial gating, and email verification!**

> Inspired by [iLoveIMG](https://www.iloveimg.com/)

---

## 🖥️ Preview

| Upload Screen | Compression Options | Download Result |
|---|---|---|
| Select an image to compress | Pick Low / Medium / High / Custom | Download your compressed file |

---

## ⚙️ How It Works

1. **Select** — Upload an image (JPG, PNG, SVG, GIF)
2. **Choose** — Pick a compression level or set a custom target size in KB
3. **Compress** — Click the button, compression runs in-browser via Web Workers
4. **Download** — Get your compressed image instantly

### Compression Levels

| Level | Reduction | Example (1 MB input) |
|-------|-----------|----------------------|
| **Low** | ~25% | → ~750 KB |
| **Medium** | ~50% | → ~500 KB |
| **High** | ~90% | → ~100 KB |
| **Custom** | User-defined | → any target KB |

---


## 🛠️ Tech Stack & Languages

| Language | Tool | Purpose |
|:--------:|------|---------|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="24" height="24" alt="JS"/> | [React 19](https://react.dev/) | UI framework |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="24" height="24" alt="JS"/> | [Vite 7](https://vite.dev/) | Build tool & dev server |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="24" height="24" alt="CSS"/> | [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="24" height="24" alt="JS"/> | [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) | Client-side image compression |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" width="24" height="24" alt="Firebase"/> | [Firebase Auth](https://firebase.google.com/docs/auth) | Google & Email/Password authentication, email verification |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" width="24" height="24" alt="ESLint"/> | [ESLint](https://eslint.org/) | Code linting |

<br/>

**Languages used:** &nbsp; <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="24" height="24" alt="JS"/> JavaScript &nbsp; <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="24" height="24" alt="CSS"/> CSS &nbsp; <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" width="24" height="24" alt="Firebase"/>

---

## 📁 Project Structure

```
my-image-compressor/
├── index.html                  # Entry HTML
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite + Tailwind plugin config
├── eslint.config.js            # ESLint rules
├── public/
│   └── vite.svg                # Favicon
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Root component
    ├── App.css                 # (empty — styles handled by Tailwind)
    ├── index.css               # Global styles + Tailwind import
    ├── ImageCompressor.jsx     # Main app — all UI & compression logic
    ├── components/
    │   └── Login.jsx           # Login/Signup page (split-screen, email verification)
    ├── context/
    │   └── AuthContext.jsx     # Auth logic (Google, Email, verification)
    └── assets/
        └── image/
            └── pen.png         # Logo icon (used in header & favicon)
```

### Key File: `src/ImageCompressor.jsx`


### Key Features

- **Header** — Pen logo, Login, Sign up
- **Upload Screen** — "Select images" button with drag-drop zone
- **Compress Screen** — Image preview + sidebar with level selector (Low / Medium / High / Custom)
- **Results Screen** — Circular progress indicator, size stats, download button
- **Authentication** — Google & Email/Password login, email verification, free trial gating (1 free compression for guests)
- **Footer** — Copyright

---

## 🚀 Getting Started

```bash
# Clone
git clone <your-repo-url>
cd my-image-compressor

# Install
npm install

# Run dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Other Commands

```bash
npm run build      # Production build → dist/
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 📦 Dependencies

### Production
- `react` ^19.2.0
- `react-dom` ^19.2.0
- `browser-image-compression` ^2.0.2

### Dev
- `vite` ^7.3.1
- `@vitejs/plugin-react` ^5.1.1
- `tailwindcss` ^4.1.18
- `@tailwindcss/vite` ^4.1.18
- `eslint` ^9.39.1

---

## 📝 License

MIT

---

Built by **Tanuj Purohit**

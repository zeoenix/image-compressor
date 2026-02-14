# ✂️ ImageCompress

A fast, browser-based image compression tool built with React. Compress JPG, PNG, SVG, and GIF files without losing quality — all processing happens in your browser, no uploads to any server.

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

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [React 19](https://react.dev/) | UI framework |
| [Vite 7](https://vite.dev/) | Build tool & dev server |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) | Client-side image compression |
| [ESLint](https://eslint.org/) | Code linting |

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
    └── assets/
        └── image/
            └── Scissor.png     # Logo icon
```

### Key File: `src/ImageCompressor.jsx`

Contains everything:

- **Header** — Logo, Login, Sign up
- **Upload Screen** — "Select images" button with drag-drop zone
- **Compress Screen** — Image preview + sidebar with level selector (Low / Medium / High / Custom)
- **Results Screen** — Circular progress indicator, size stats, download button
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

Open [http://localhost:5174](http://localhost:5174)

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

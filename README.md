# 🖊️ ImageCompress

A fast, browser-based image compression tool built with React, Vite, and Tailwind CSS. Compress JPG, PNG, SVG, and GIF files instantly — all processing happens in your browser, no uploads to any server.

**Now with authentication (Google & Email), free trial gating, email verification, and secure Firebase keys using environment variables!**

---

## 🖥️ Preview

| Upload Screen | Compression Options | Download Result |
|---|---|---|
| Select an image to compress | Pick Low / Medium / High / Custom | Download your compressed file |

---

## ⚙️ Features

- **Image Compression**: JPG, PNG, SVG, GIF
- **Compression Levels**: Low, Medium, High, Custom (target KB)
- **Authentication**: Google & Email/Password login, email verification
- **Free Trial Gating**: 1 free compression for guests
- **Secure Firebase Keys**: Keys stored in `.env`, not exposed on GitHub
- **Responsive UI**: Built with Tailwind CSS
- **Fast Build & Dev**: Powered by Vite

---

## 🛠️ Tech Stack

- React 19
- Vite 7
- Tailwind CSS 4
- Firebase Auth
- browser-image-compression
- ESLint

---

## 📁 Project Structure

```
my-image-compressor/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── public/
│   └── vite.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── ImageCompressor.jsx
    ├── assets/
    └── ...
```

---

## 🚀 Getting Started

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd my-image-compressor
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Firebase keys:**
   - Create a `.env` file in the project root.
   - Add your Firebase keys:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```
   - **Do not commit `.env` to GitHub!**
4. **Run the dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Deploying to Vercel

- Add all `.env` values as environment variables in the Vercel dashboard.
- Redeploy your project for keys to take effect.

---

## 📦 Dependencies

- `react` ^19.2.0
- `react-dom` ^19.2.0
- `browser-image-compression` ^2.0.2
- `firebase` ^12.9.0
- `vite` ^7.3.1
- `tailwindcss` ^4.1.18
- `eslint` ^9.39.1

---

## 📝 License

MIT

---

Built by **Tanuj Purohit**

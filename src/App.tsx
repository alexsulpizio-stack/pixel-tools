import { NavLink, Route, Routes } from "react-router-dom";
import CompressorPage from "./pages/CompressorPage";
import FaviconPage from "./pages/FaviconPage";
import "./App.css";

export default function App() {
  return (
    <div className="page">
      <header className="header">
        <div className="header__brand">
          <span className="header__logo">▣</span> PixelTools
        </div>
        <nav className="header__nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link nav-link--on" : "nav-link")}>
            Compress
          </NavLink>
          <NavLink to="/favicon-generator" className={({ isActive }) => (isActive ? "nav-link nav-link--on" : "nav-link")}>
            Favicon
          </NavLink>
          <a href="https://www.buymeacoffee.com/" target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
            ☕ Support
          </a>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<CompressorPage />} />
          <Route path="/favicon-generator" element={<FaviconPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} PixelTools · Images are processed locally and never leave your device.</p>
      </footer>
    </div>
  );
}

import { NavLink, Route, Routes } from "react-router-dom";
import CompressorPage from "./pages/CompressorPage";
import FaviconPage from "./pages/FaviconPage";
import QrPage from "./pages/QrPage";
import PalettePage from "./pages/PalettePage";
import PdfPage from "./pages/PdfPage";
import PrivacyPage from "./pages/PrivacyPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TargetSizePage from "./pages/TargetSizePage";
import GuidesIndexPage from "./pages/GuidesIndexPage";
import GuidePage from "./pages/GuidePage";
import { TARGET_PAGES } from "./lib/targetPages";
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
          <NavLink to="/qr-code-generator" className={({ isActive }) => (isActive ? "nav-link nav-link--on" : "nav-link")}>
            QR Code
          </NavLink>
          <NavLink to="/color-palette" className={({ isActive }) => (isActive ? "nav-link nav-link--on" : "nav-link")}>
            Palette
          </NavLink>
          <NavLink to="/image-to-pdf" className={({ isActive }) => (isActive ? "nav-link nav-link--on" : "nav-link")}>
            PDF
          </NavLink>
          <NavLink to="/guides" className={({ isActive }) => (isActive ? "nav-link nav-link--on" : "nav-link")}>
            Guides
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
          <Route path="/qr-code-generator" element={<QrPage />} />
          <Route path="/color-palette" element={<PalettePage />} />
          <Route path="/image-to-pdf" element={<PdfPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/guides" element={<GuidesIndexPage />} />
          <Route path="/guides/:slug" element={<GuidePage />} />
          {TARGET_PAGES.map((p) => (
            <Route key={p.slug} path={`/${p.slug}`} element={<TargetSizePage config={p} />} />
          ))}
        </Routes>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} PixelTools · Images are processed locally and never leave your device.</p>
        <p className="footer__links">
          <NavLink to="/guides">Guides</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/privacy">Privacy</NavLink>
        </p>
      </footer>
    </div>
  );
}

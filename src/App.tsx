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
import ToolsIndexPage from "./pages/ToolsIndexPage";
import ResizeImagePage from "./pages/ResizeImagePage";
import CropImagePage from "./pages/CropImagePage";
import CircleCropPage from "./pages/CircleCropPage";
import RotateImagePage from "./pages/RotateImagePage";
import RemoveExifPage from "./pages/RemoveExifPage";
import ImageBase64Page from "./pages/ImageBase64Page";
import HeicToJpgPage from "./pages/HeicToJpgPage";
import ImageConverterPage from "./pages/ImageConverterPage";
import WatermarkPage from "./pages/WatermarkPage";
import BlurImagePage from "./pages/BlurImagePage";
import { RelatedLinks } from "./components/RelatedLinks";
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
          <NavLink to="/tools" className={({ isActive }) => (isActive ? "nav-link nav-link--on" : "nav-link")}>
            Tools
          </NavLink>
          <NavLink to="/heic-to-jpg" className={({ isActive }) => (isActive ? "nav-link nav-link--on" : "nav-link")}>
            HEIC→JPG
          </NavLink>
          <NavLink to="/favicon-generator" className={({ isActive }) => (isActive ? "nav-link nav-link--on" : "nav-link")}>
            Favicon
          </NavLink>
          <NavLink to="/qr-code-generator" className={({ isActive }) => (isActive ? "nav-link nav-link--on" : "nav-link")}>
            QR Code
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
          <Route path="/tools" element={<ToolsIndexPage />} />
          <Route path="/favicon-generator" element={<FaviconPage />} />
          <Route path="/qr-code-generator" element={<QrPage />} />
          <Route path="/color-palette" element={<PalettePage />} />
          <Route path="/image-to-pdf" element={<PdfPage />} />
          <Route path="/resize-image" element={<ResizeImagePage />} />
          <Route path="/crop-image" element={<CropImagePage />} />
          <Route path="/circle-crop" element={<CircleCropPage />} />
          <Route path="/rotate-image" element={<RotateImagePage />} />
          <Route path="/remove-exif" element={<RemoveExifPage />} />
          <Route path="/image-to-base64" element={<ImageBase64Page />} />
          <Route path="/heic-to-jpg" element={<HeicToJpgPage />} />
          <Route path="/image-converter" element={<ImageConverterPage />} />
          <Route path="/watermark-image" element={<WatermarkPage />} />
          <Route path="/blur-image" element={<BlurImagePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/guides" element={<GuidesIndexPage />} />
          <Route path="/guides/:slug" element={<GuidePage />} />
          {TARGET_PAGES.map((p) => (
            <Route key={p.slug} path={`/${p.slug}`} element={<TargetSizePage config={p} />} />
          ))}
        </Routes>
        <RelatedLinks />
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} PixelTools · Images are processed locally and never leave your device.</p>
        <p className="footer__links">
          <NavLink to="/tools">All tools</NavLink>
          <NavLink to="/guides">Guides</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/privacy">Privacy</NavLink>
        </p>
      </footer>
    </div>
  );
}

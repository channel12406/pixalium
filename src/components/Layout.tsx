import React, { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, Facebook, Linkedin, MapPin, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLongPress } from "@/hooks/useLongPress";
import Logo from "./Logo";
import Newsletter from "./Newsletter";
import PromoBar from "./PromoBar";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
  { to: "/shop", label: "Shop" },
];

const WHATSAPP = "22872122191";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const longPressHandlers = useLongPress(useCallback(() => navigate("/admin"), [navigate]), 12000);
  
  // Theme toggle
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  });
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  // Set initial theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Logo />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary text-foreground hover:bg-primary/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity select-none"
            {...longPressHandlers}
          >
            <Phone className="w-4 h-4" /> WhatsApp
          </a>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/50"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                    location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Logo showText={false} />
            <p className="text-muted-foreground text-sm leading-relaxed mt-4">
              Premium digital & architectural solutions from Togo 🇹🇬, serving clients across Africa and beyond.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>📍 Lomé, Togo</p>
              <a
                href="https://www.google.com/maps/place/PixaliumDigital/data=!4m2!3m1!1s0x0:0xfd45778c8c122b1b?sa=X&ved=1t:2428&hl=fr&ictx=111"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-1 text-primary hover:underline"
              >
                <MapPin className="w-4 h-4" /> Voir notre localisation
              </a>
              <p>📞 +228 72 12 21 91</p>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-primary hover:underline"
              >
                <Phone className="w-4 h-4" /> Chat on WhatsApp
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61584331372644"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-primary hover:underline"
              >
                <Facebook className="w-4 h-4" /> Suivez-nous sur Facebook
              </a>
              <a
                href="https://www.linkedin.com/in/pixalium-digital-25b733363/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-primary hover:underline"
              >
                <Linkedin className="w-4 h-4" /> Connectez-vous sur LinkedIn
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Newsletter</h4>
            <Newsletter />
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PixaliumDigital. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showPromo, setShowPromo] = useState(true);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnimatePresence>
        {showPromo && (
          <PromoBar onClose={() => setShowPromo(false)} />
        )}
      </AnimatePresence>
      <Navbar />
      <main className="flex-1 pt-16">
        {showPromo && <div className="h-16" />}
        {children}
      </main>
      <Footer />
    </div>
  );
}

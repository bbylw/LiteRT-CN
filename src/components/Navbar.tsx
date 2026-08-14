import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.pageYOffset + 140;

      let current = '';
      sections.forEach((sec) => {
        const el = sec as HTMLElement;
        if (scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          current = el.getAttribute('id') || '';
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleTheme = () => {
    toggleTheme();
    showToast(`已切换至${theme === 'dark' ? '纯净浅色' : '深色极客'}模式`);
  };

  const navLinks = [
    { href: '#features', label: '核心架构', id: 'features' },
    { href: '#quantization', label: '量化实验室', id: 'quantization' },
    { href: '#pipeline', label: '流水线', id: 'pipeline' },
    { href: '#builder', label: '模型转换', id: 'builder' },
    { href: '#benchmarks', label: '性能实测', id: 'benchmarks' },
    { href: '#ide', label: '多语言 SDK', id: 'ide' },
    { href: '#matrix', label: '硬件生态', id: 'matrix' },
    { href: '#cli', label: 'CLI 终端', id: 'cli' }
  ];

  return (
    <header className="nav-header" role="banner">
      <div className="nav-container">
        <div className="nav-logo-wrap">
          <a href="#" className="logo-badge" title="Google AI Edge LiteRT" aria-label="LiteRT 开发者门户首页">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </a>
          <a href="#" className="brand-text">LiteRT</a>
          <span className="brand-pill">v2.x (React+Bun)</span>
        </div>

        <nav aria-label="主导航菜单">
          <ul className="nav-links-menu">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`nav-link-btn ${activeSection === link.id ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-controls">
          <button
            id="btn-theme-toggle"
            className="btn-theme-toggle"
            onClick={handleToggleTheme}
            aria-label="切换主题"
            title={theme === 'dark' ? '切换至浅色模式' : '切换至深色模式'}
          >
            {theme === 'dark' ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <a
            href="https://github.com/google-ai-edge/LiteRT"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-nav-gh"
            aria-label="访问 LiteRT GitHub 开源仓库"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </a>

          <a href="#ide" className="btn-nav-cta">快速上手</a>

          {/* Mobile Menu Toggle Button */}
          <button
            className="btn-theme-toggle mobile-only-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="展开菜单"
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};


import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import i18n from '../../i18n';

const navItems = [
  { path: '/', icon: '🏠', key: 'home', roles: ['admin', 'teacher', 'parent'] },
  { path: '/curriculum', icon: '📅', key: 'curriculum', roles: ['admin', 'teacher', 'parent'] },
  { path: '/students', icon: '👦', key: 'students', roles: ['admin', 'teacher'] },
  { path: '/lessons', icon: '📚', key: 'lessons', roles: ['admin', 'teacher', 'parent'] },
  { path: '/teachers', icon: '👩‍🏫', key: 'teachers', roles: ['admin'] },
  { path: '/admin', icon: '⚙️', key: 'admin', roles: ['admin'] },
];

const LANGS = [
  { code: 'az', label: '🇦🇿 AZ' },
  { code: 'ru', label: '🇷🇺 RU' },
  { code: 'en', label: '🇬🇧 EN' },
];

export default function Layout({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const filtered = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 72, background: 'linear-gradient(180deg, #6C63FF 0%, #5048CC 100%)',
        transition: 'width 0.3s', display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
        overflowX: 'hidden'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 12px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>🎒</div>
            {sidebarOpen && <div>
              <div style={{ color: 'white', fontWeight: 900, fontSize: 14, lineHeight: 1.2 }}>Məktəbə</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Hazırlıq</div>
            </div>}
          </div>
        </div>

        {/* Toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
          background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
          padding: '10px 12px', cursor: 'pointer', textAlign: 'left', fontSize: 18
        }}>{sidebarOpen ? '◀' : '▶'}</button>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {filtered.map(item => (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px', borderRadius: 12, marginBottom: 4,
              background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white', textDecoration: 'none', fontWeight: 600,
              transition: 'background 0.2s', fontSize: 14
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span>{t(`nav.${item.key}`)}</span>}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(255,107,107,0.3)', border: 'none', color: 'white',
            padding: '10px 12px', borderRadius: 12, cursor: 'pointer',
            width: '100%', fontWeight: 700, fontSize: 14
          }}>
            <span style={{ fontSize: 18 }}>🚪</span>
            {sidebarOpen && <span>{t('common.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: sidebarOpen ? 240 : 72, flex: 1, transition: 'margin-left 0.3s', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <header style={{
          background: 'white', padding: '12px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {LANGS.map(l => (
              <button key={l.code} onClick={() => changeLang(l.code)} style={{
                padding: '6px 12px', borderRadius: 8, border: 'none',
                background: i18n.language === l.code ? 'var(--primary)' : 'var(--bg)',
                color: i18n.language === l.code ? 'white' : 'var(--text)',
                cursor: 'pointer', fontWeight: 700, fontSize: 12
              }}>{l.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-light)' }}>
                {user?.role === 'admin' ? '👑 Admin' : user?.role === 'teacher' ? '👩‍🏫 Müəllim' : '👨‍👩‍👦 Valideyn'}
              </div>
            </div>
            <div className="avatar" style={{ width: 40, height: 40, fontSize: 16 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1 }}>{children}</div>

        {/* Footer */}
        <footer style={{
          background: 'linear-gradient(135deg, #5048CC, #6C63FF)',
          color: 'white', textAlign: 'center', padding: '16px 20px', marginTop: 'auto'
        }}>
          <p style={{ margin: 0, fontSize: 13 }}>
            🎒 Məktəbəqədər Hazırlıq Proqramı © {new Date().getFullYear()} — Bütün hüquqlar qorunur |{' '}
            <a href="https://www.instagram.com/s_akhundoff" target="_blank" rel="noreferrer"
              style={{ color: '#FFD93D', textDecoration: 'none', fontWeight: 800 }}>
              📸 @s_akhundoff
            </a>
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 11, opacity: 0.7 }}>By s_akhundoff</p>
        </footer>
      </main>
    </div>
  );
}

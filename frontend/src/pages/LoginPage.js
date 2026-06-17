import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import i18n from '../i18n';

const LANGS = [{ code: 'az', label: '🇦🇿 AZ' }, { code: 'ru', label: '🇷🇺 RU' }, { code: 'en', label: '🇬🇧 EN' }];

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Xoş gəlmisiniz! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Giriş xətası');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 20
    }}>
      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8 }}>
        {LANGS.map(l => (
          <button key={l.code} onClick={() => { i18n.changeLanguage(l.code); localStorage.setItem('lang', l.code); }}
            style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
            {l.label}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>🎒</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#2D3748' }}>Məktəbə Hazırlıq</h1>
          <p style={{ color: '#718096', marginTop: 6, fontSize: 14 }}>{t('auth.loginTitle')}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t('common.email')}</label>
            <input className="input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder={t('auth.emailPlaceholder')} required />
          </div>
          <div className="input-group">
            <label>{t('common.password')}</label>
            <input className="input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder={t('auth.passwordPlaceholder')} required />
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? '⌛ ...' : `🔑 ${t('auth.login')}`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#718096' }}>
          {t('auth.noAccount')}{' '}
          <Link to="/register" style={{ color: '#6C63FF', fontWeight: 700 }}>{t('auth.register')}</Link>
        </p>

        {/* Demo hesablar */}
        <div style={{ marginTop: 24, padding: 16, background: '#F8F9FF', borderRadius: 12, fontSize: 12 }}>
          <p style={{ fontWeight: 800, marginBottom: 8, color: '#6C63FF' }}>🔐 Demo Hesablar:</p>
          <p>👑 Admin: admin@demo.az / admin123</p>
          <p>👩‍🏫 Müəllim: teacher@demo.az / teacher123</p>
          <p>👨‍👩‍👦 Valideyn: parent@demo.az / parent123</p>
        </div>
      </div>
    </div>
  );
}

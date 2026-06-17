import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'parent', phone: '', language: 'az' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Qeydiyyat uğurlu oldu! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Qeydiyyat xətası');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: 20
    }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 50, marginBottom: 10 }}>✨</div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>{t('auth.registerTitle')}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t('common.name')}</label>
            <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t('auth.namePlaceholder')} required />
          </div>
          <div className="input-group">
            <label>{t('common.email')}</label>
            <input className="input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>{t('common.phone')}</label>
            <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+994 50 000 00 00" />
          </div>
          <div className="input-group">
            <label>{t('common.password')}</label>
            <input className="input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
          </div>
          <div className="input-group">
            <label>{t('common.role')}</label>
            <select className="input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="parent">👨‍👩‍👦 {t('auth.parentRole')}</option>
              <option value="teacher">👩‍🏫 {t('auth.teacherRole')}</option>
            </select>
          </div>
          <div className="input-group">
            <label>Dil / Язык / Language</label>
            <select className="input" value={form.language} onChange={e => setForm({...form, language: e.target.value})}>
              <option value="az">🇦🇿 Azərbaycan</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
          <button className="btn btn-secondary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? '⌛ ...' : `✅ ${t('auth.register')}`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#718096' }}>
          {t('auth.haveAccount')}{' '}
          <Link to="/login" style={{ color: '#6C63FF', fontWeight: 700 }}>{t('auth.login')}</Link>
        </p>
      </div>
    </div>
  );
}

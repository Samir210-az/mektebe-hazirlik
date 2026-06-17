// TeachersPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  useEffect(() => { axios.get(`${API}/teachers`).then(r => setTeachers(r.data)).catch(() => {}); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/teachers`, form);
      setTeachers([...teachers, res.data]);
      setModal(false); toast.success('Müəllim əlavə edildi!');
    } catch (err) { toast.error(err.response?.data?.message || 'Xəta'); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">👩‍🏫 Müəllimlər</h1>
        <button className="btn btn-primary" onClick={() => setModal(true)}>➕ Müəllim Əlavə Et</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {teachers.map((t, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', borderTop: '4px solid #FF6B9D' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #f093fb, #f5576c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 12px' }}>👩‍🏫</div>
            <h3 style={{ fontWeight: 800 }}>{t.name}</h3>
            <p style={{ color: 'var(--text-light)', fontSize: 13, margin: '4px 0' }}>{t.email}</p>
            {t.phone && <p style={{ color: 'var(--text-light)', fontSize: 13 }}>📞 {t.phone}</p>}
            <span className={`badge ${t.isActive ? 'badge-success' : 'badge-danger'}`} style={{ marginTop: 8 }}>{t.isActive ? 'Aktiv' : 'Deaktiv'}</span>
          </div>
        ))}
      </div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">👩‍🏫 Yeni Müəllim</h2><button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>✕</button></div>
            <form onSubmit={handleSubmit}>
              {[{ k: 'name', l: 'Ad Soyad', t: 'text' }, { k: 'email', l: 'Email', t: 'email' }, { k: 'password', l: 'Şifrə', t: 'password' }, { k: 'phone', l: 'Telefon', t: 'tel' }].map(f => (
                <div key={f.k} className="input-group"><label>{f.l}</label><input className="input" type={f.t} value={form[f.k]} onChange={e => setForm({...form, [f.k]: e.target.value})} required={f.k !== 'phone'} /></div>
              ))}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>✅ Əlavə Et</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

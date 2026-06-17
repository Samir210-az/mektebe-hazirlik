// AdminPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AdminPage() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, records: 0, parents: 0 });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/students`).catch(() => ({ data: [] })),
      axios.get(`${API}/teachers`).catch(() => ({ data: [] })),
      axios.get(`${API}/records/stats/overview`).catch(() => ({ data: { total: 0 } }))
    ]).then(([s, t, r]) => {
      setStats({ students: s.data.length, teachers: t.data.length, records: r.data.total });
      setUsers([...t.data]);
    });
  }, []);

  const createAdmin = async () => {
    try {
      await axios.post(`${API}/auth/register`, { name: 'Demo Admin', email: 'admin@demo.az', password: 'admin123', role: 'admin' });
      toast.success('Demo hesablar yaradıldı!');
    } catch (err) { toast.info(err.response?.data?.message || 'Artıq mövcuddur'); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">⚙️ Admin Panel</h1>
        <button className="btn btn-primary" onClick={createAdmin}>🔐 Demo Hesablar Yarat</button>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { icon: '👦', v: stats.students, l: 'Uşaqlar', c: '#6C63FF' },
          { icon: '👩‍🏫', v: stats.teachers, l: 'Müəllimlər', c: '#FF6B9D' },
          { icon: '📋', v: stats.records, l: 'Qeydlər', c: '#FFD93D' },
          { icon: '🏫', v: 1, l: 'Qruplar', c: '#6BCB77' }
        ].map((s, i) => (
          <div key={i} className="card stat-card">
            <div style={{ fontSize: 32 }}>{s.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: s.c, margin: '8px 0' }}>{s.v}</div>
            <div style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 600 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 800, marginBottom: 16 }}>👩‍🏫 Müəllimlər Siyahısı</h3>
        {users.length === 0 ? (
          <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: 20 }}>Müəllim tapılmadı</p>
        ) : (
          <table className="table">
            <thead><tr><th>Ad</th><th>Email</th><th>Status</th></tr></thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }}>👩‍🏫 {u.name}</td>
                  <td style={{ color: 'var(--text-light)' }}>{u.email}</td>
                  <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Aktiv' : 'Deaktiv'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 12 }}>ℹ️ Sistem Məlumatı</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
          <div>🗄️ Backend: Node.js + Express + MongoDB</div>
          <div>⚛️ Frontend: React.js</div>
          <div>🌐 Dillər: Azərbaycan, Rus, İngilis</div>
          <div>📅 Proqram: 8 Həftə (2 ay)</div>
          <div>👶 Yaş qrupu: 5-6 yaş</div>
        </div>
      </div>
    </div>
  );
}

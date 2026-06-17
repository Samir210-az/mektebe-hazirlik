import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const subjectEmoji = { math: '🔢', language: '📝', reading: '📖', drawing: '🎨', music: '🎵', physical: '⚽', nature: '🌿', logic: '🧩', creativity: '✂️' };

export default function HomePage() {
  const { t } = useTranslation();
  const { user, isAdmin, isTeacher } = useAuth();
  const [todayPlan, setTodayPlan] = useState(null);
  const [stats, setStats] = useState({ students: 0, teachers: 0, records: 0 });

  const getWeekDay = () => {
    const day = new Date().getDay();
    return day === 0 ? 5 : day === 6 ? 5 : day; // həftəsonu → cümə
  };

  const getCurrentWeek = () => {
    const start = new Date('2024-09-02');
    const now = new Date();
    const diff = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000)) + 1;
    return Math.min(Math.max(diff, 1), 8);
  };

  useEffect(() => {
    const week = getCurrentWeek();
    axios.get(`${API}/curriculum/week/${week}`).then(res => {
      const day = getWeekDay();
      const dayPlan = res.data.days?.find(d => d.day === day) || res.data.days?.[0];
      setTodayPlan({ ...dayPlan, week: res.data.week, theme: res.data.theme });
    }).catch(() => {});

    if (isAdmin) {
      Promise.all([
        axios.get(`${API}/students`).catch(() => ({ data: [] })),
        axios.get(`${API}/teachers`).catch(() => ({ data: [] })),
        axios.get(`${API}/records/stats/overview`).catch(() => ({ data: { total: 0 } }))
      ]).then(([s, t, r]) => setStats({ students: s.data.length, teachers: t.data.length, records: r.data.total }));
    }
  }, [isAdmin]);

  return (
    <div className="page">
      {/* Salam */}
      <div style={{ background: 'linear-gradient(135deg, #6C63FF, #FF6B9D)', borderRadius: 20, padding: '32px', marginBottom: 28, color: 'white' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
          👋 Xoş gəlmisiniz, {user?.name?.split(' ')[0]}!
        </h1>
        <p style={{ opacity: 0.9, fontSize: 15 }}>
          {new Date().toLocaleDateString('az-AZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <Link to="/curriculum" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.4)' }}>📅 Tədris Planı</Link>
          {(isAdmin || isTeacher) && <Link to="/students" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.4)' }}>👦 Uşaqlar</Link>}
        </div>
      </div>

      {/* Admin statistika */}
      {isAdmin && (
        <div className="grid-3" style={{ marginBottom: 28 }}>
          {[
            { icon: '👦', number: stats.students, label: 'Uşaqlar', color: '#6C63FF' },
            { icon: '👩‍🏫', number: stats.teachers, label: 'Müəllimlər', color: '#FF6B9D' },
            { icon: '📋', number: stats.records, label: 'Qeydlər', color: '#FFD93D' },
          ].map((s, i) => (
            <div key={i} className="card stat-card">
              <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 38, fontWeight: 900, color: s.color }}>{s.number}</div>
              <div style={{ color: 'var(--text-light)', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Bu günün planı */}
      {todayPlan && (
        <div className="card" style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            📅 Bu günün Planı — Həftə {todayPlan.week}
          </h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {todayPlan.lessons?.map((lesson, i) => (
              <div key={i} style={{
                background: 'linear-gradient(135deg, #6C63FF, #8B85FF)',
                color: 'white', borderRadius: 14, padding: '14px 18px',
                flex: '1 1 200px', minWidth: 180
              }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{subjectEmoji[lesson.subject] || '📚'}</div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{typeof lesson.title === 'object' ? lesson.title.az : lesson.title}</div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>⏱ {lesson.duration} dəq</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sürətli bağlantılar */}
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>⚡ Sürətli Keçidlər</h2>
      <div className="grid-4">
        {[
          { to: '/curriculum', icon: '📅', title: 'Tədris Planı', desc: '2 aylıq proqram', color: '#6C63FF' },
          { to: '/lessons', icon: '📚', title: 'Məşğələlər', desc: 'Fənn materialları', color: '#FF6B9D' },
          ...(isAdmin || isTeacher ? [{ to: '/students', icon: '👦', title: 'Uşaqlar', desc: 'Qeydiyyat & profil', color: '#FFD93D' }] : []),
          ...(isAdmin ? [{ to: '/admin', icon: '⚙️', title: 'Admin Panel', desc: 'İdarəetmə', color: '#6BCB77' }] : []),
        ].map((item, i) => (
          <Link key={i} to={item.to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ textAlign: 'center', cursor: 'pointer', borderTop: `4px solid ${item.color}` }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{item.title}</div>
              <div style={{ color: 'var(--text-light)', fontSize: 12, marginTop: 4 }}>{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

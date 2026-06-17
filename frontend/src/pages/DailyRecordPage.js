import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SUBJECTS = ['math', 'language', 'reading', 'drawing', 'music', 'physical', 'nature', 'logic', 'creativity'];
const SUBJECT_NAMES = { math: 'Riyaziyyat', language: 'Dil', reading: 'Oxu', drawing: 'Rəsm', music: 'Musiqi', physical: 'Bədən Tərbiyəsi', nature: 'Təbiət', logic: 'Məntiq', creativity: 'Yaradıcılıq' };
const SUBJECT_EMOJI = { math: '🔢', language: '📝', reading: '📖', drawing: '🎨', music: '🎵', physical: '⚽', nature: '🌿', logic: '🧩', creativity: '✂️' };
const BEHAVIOR_OPTIONS = [
  { value: 'excellent', label: '⭐ Əla', emoji: '🌟', color: '#FFD700' },
  { value: 'good', label: '😊 Yaxşı', emoji: '😊', color: '#6BCB77' },
  { value: 'satisfactory', label: '😐 Qənaətbəxş', emoji: '😐', color: '#FFB347' },
  { value: 'needs_improvement', label: '😢 Yaxşılaşdırılmalı', emoji: '😢', color: '#FF6B6B' }
];

export default function DailyRecordPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [student, setStudent] = useState(null);
  const [todayLessons, setTodayLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    lessonsCompleted: [],
    grades: SUBJECTS.slice(0, 4).map(s => ({ subject: s, grade: 5, comment: '' })),
    behavior: { rating: 'good', notes: '', attention: 3, activity: 3, cooperation: 3 },
    teacherNote: '',
    parentMessage: ''
  });

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/students/${id}`),
      axios.get(`${API}/curriculum/week/1`)
    ]).then(([s, c]) => {
      setStudent(s.data);
      const day = new Date().getDay();
      const dayPlan = c.data.days?.find(d => d.day === (day === 0 || day === 6 ? 1 : day));
      if (dayPlan) setTodayLessons(dayPlan.lessons || []);
      
      // Bugünün qeydini yükle
      axios.get(`${API}/records/today/${id}`).then(r => {
        if (r.data) {
          setForm(prev => ({ ...prev, ...r.data, date: new Date(r.data.date).toISOString().split('T')[0] }));
        }
      }).catch(() => {});
      
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const toggleLesson = (lesson) => {
    const exists = form.lessonsCompleted.find(l => l.lessonName === (typeof lesson.title === 'object' ? lesson.title.az : lesson.title));
    if (exists) {
      setForm(prev => ({ ...prev, lessonsCompleted: prev.lessonsCompleted.filter(l => l.lessonName !== (typeof lesson.title === 'object' ? lesson.title.az : lesson.title)) }));
    } else {
      setForm(prev => ({ ...prev, lessonsCompleted: [...prev.lessonsCompleted, { lessonName: typeof lesson.title === 'object' ? lesson.title.az : lesson.title, subject: lesson.subject, duration: lesson.duration, completed: true }] }));
    }
  };

  const updateGrade = (subject, field, value) => {
    setForm(prev => ({
      ...prev,
      grades: prev.grades.map(g => g.subject === subject ? { ...g, [field]: field === 'grade' ? parseInt(value) : value } : g)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${API}/records`, { ...form, studentId: id });
      toast.success('Qeyd saxlanıldı! ✅');
      navigate(`/students/${id}`);
    } catch (err) { toast.error('Xəta baş verdi'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="page"><div style={{ textAlign: 'center', padding: 60 }}>⌛</div></div>;

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Gündəlik Qeyd</h1>
          {student && <p className="page-subtitle">👦 {student.firstName} {student.lastName} • {new Date().toLocaleDateString('az-AZ')}</p>}
        </div>
        <button className="btn btn-outline" onClick={() => navigate(`/students/${id}`)}>← Geri</button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tarix */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>📅 Tarix</h3>
          <input className="input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={{ maxWidth: 200 }} />
        </div>

        {/* Bu günün məşğələləri */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>📚 Keçirilən Məşğələlər</h3>
          {todayLessons.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {todayLessons.map((lesson, i) => {
                const title = typeof lesson.title === 'object' ? lesson.title.az : lesson.title;
                const isChecked = form.lessonsCompleted.some(l => l.lessonName === title);
                return (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: isChecked ? 'rgba(108,99,255,0.08)' : 'var(--bg)', border: `2px solid ${isChecked ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <input type="checkbox" checked={isChecked} onChange={() => toggleLesson(lesson)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                    <span style={{ fontSize: 22 }}>{SUBJECT_EMOJI[lesson.subject]}</span>
                    <div>
                      <div style={{ fontWeight: 700 }}>{title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-light)' }}>⏱ {lesson.duration} dəq • {SUBJECT_NAMES[lesson.subject]}</div>
                    </div>
                    {isChecked && <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontWeight: 800 }}>✅</span>}
                  </label>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--text-light)' }}>Bu gün üçün dərs planı tapılmadı</p>
          )}
        </div>

        {/* Qiymətlər */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>⭐ Qiymətlər (1-10)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {form.grades.map((g, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 22, width: 32, textAlign: 'center' }}>{SUBJECT_EMOJI[g.subject]}</span>
                <select className="input" value={g.subject} onChange={e => { const newGrades = [...form.grades]; newGrades[i].subject = e.target.value; setForm({...form, grades: newGrades}); }}
                  style={{ flex: 1, maxWidth: 180 }}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{SUBJECT_NAMES[s]}</option>)}
                </select>
                <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                  {[...Array(10)].map((_, n) => (
                    <button key={n+1} type="button" onClick={() => updateGrade(g.subject, 'grade', n+1)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 13,
                        background: g.grade === n+1 ? (n+1 >= 8 ? '#6BCB77' : n+1 >= 5 ? '#FFB347' : '#FF6B6B') : 'var(--bg)',
                        color: g.grade === n+1 ? 'white' : 'var(--text)', transition: 'all 0.15s'
                      }}>{n+1}</button>
                  ))}
                </div>
                <button type="button" onClick={() => setForm(prev => ({ ...prev, grades: prev.grades.filter((_, gi) => gi !== i) }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#FF6B6B' }}>✕</button>
              </div>
            ))}
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setForm(prev => ({ ...prev, grades: [...prev.grades, { subject: 'math', grade: 5, comment: '' }] }))}>
              ➕ Fənn əlavə et
            </button>
          </div>
        </div>

        {/* Davranış */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>😊 Davranış</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            {BEHAVIOR_OPTIONS.map(opt => (
              <button key={opt.value} type="button" onClick={() => setForm(prev => ({ ...prev, behavior: { ...prev.behavior, rating: opt.value } }))}
                style={{
                  padding: '12px 18px', borderRadius: 14, border: '3px solid',
                  borderColor: form.behavior.rating === opt.value ? opt.color : 'var(--border)',
                  background: form.behavior.rating === opt.value ? opt.color + '20' : 'white',
                  cursor: 'pointer', fontWeight: 800, fontSize: 14, fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}>{opt.emoji} {opt.label.split(' ').slice(1).join(' ')}</button>
            ))}
          </div>

          {/* Xal sistemi */}
          <div className="grid-3" style={{ marginBottom: 16 }}>
            {[
              { key: 'attention', label: '🎯 Diqqət' },
              { key: 'activity', label: '⚡ Fəallıq' },
              { key: 'cooperation', label: '🤝 Əməkdaşlıq' }
            ].map(item => (
              <div key={item.key}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{item.label}</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setForm(prev => ({ ...prev, behavior: { ...prev.behavior, [item.key]: n } }))}
                      style={{ width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 18, background: 'none', opacity: form.behavior[item.key] >= n ? 1 : 0.3 }}>⭐</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="input-group">
            <label>Davranış qeydi</label>
            <textarea className="input" style={{ height: 70, resize: 'vertical' }} value={form.behavior.notes}
              onChange={e => setForm(prev => ({ ...prev, behavior: { ...prev.behavior, notes: e.target.value } }))}
              placeholder="Bu günki davranış haqqında qısa qeyd..." />
          </div>
        </div>

        {/* Müəllim qeydi */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>👩‍🏫 Müəllim Qeydi</h3>
          <div className="input-group">
            <label>Müəllim üçün qeyd</label>
            <textarea className="input" style={{ height: 80 }} value={form.teacherNote}
              onChange={e => setForm({...form, teacherNote: e.target.value})}
              placeholder="Bugünki dərs haqqında müşahidələr..." />
          </div>
          <div className="input-group">
            <label>📨 Valideynə mesaj</label>
            <textarea className="input" style={{ height: 80 }} value={form.parentMessage}
              onChange={e => setForm({...form, parentMessage: e.target.value})}
              placeholder="Valideynlərə bildirişlər, tapşırıqlar..." />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={saving}>
          {saving ? '⌛ Saxlanılır...' : '✅ Qeydi Saxla'}
        </button>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function StudentsPage() {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', birthDate: '', gender: 'male', group: '', teacherId: '', programStart: '', programEnd: '', notes: '' });

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/students`),
      axios.get(`${API}/teachers`).catch(() => ({ data: [] }))
    ]).then(([s, t]) => { setStudents(s.data); setTeachers(t.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/students`, form);
      setStudents([...students, res.data]);
      setModal(false);
      setForm({ firstName: '', lastName: '', birthDate: '', gender: 'male', group: '', teacherId: '', programStart: '', programEnd: '', notes: '' });
      toast.success('Uşaq əlavə edildi! 🎉');
    } catch (err) { toast.error(err.response?.data?.message || 'Xəta baş verdi'); }
  };

  const getAge = (birthDate) => {
    if (!birthDate) return '';
    const diff = new Date() - new Date(birthDate);
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)) + ' yaş';
  };

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    s.group?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page"><div style={{ textAlign: 'center', padding: 60 }}>⌛</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">👦 {t('student.title')}</h1>
          <p className="page-subtitle">Cəmi: {students.length} uşaq</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>➕ {t('student.addStudent')}</button>
      </div>

      {/* Axtarış */}
      <div style={{ marginBottom: 24, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
        <input className="input" style={{ paddingLeft: 44 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Uşaq axtar..." />
      </div>

      {/* Cədvəl */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>👶</div>
          <p style={{ color: 'var(--text-light)' }}>{t('student.noStudents')}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(student => (
            <div key={student._id} className="card" style={{ borderTop: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: student.gender === 'female' ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'linear-gradient(135deg, #4facfe, #00f2fe)',
                  fontSize: 26, flexShrink: 0
                }}>{student.gender === 'female' ? '👧' : '👦'}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{student.firstName} {student.lastName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 2 }}>
                    {getAge(student.birthDate)} {student.group && `• ${student.group}`}
                  </div>
                </div>
              </div>

              {student.teacherId && (
                <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 6 }}>
                  👩‍🏫 {student.teacherId.name}
                </div>
              )}
              {student.programStart && (
                <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 12 }}>
                  📅 {new Date(student.programStart).toLocaleDateString()} → {student.programEnd ? new Date(student.programEnd).toLocaleDateString() : '?'}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/students/${student._id}`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  👁️ Profil
                </Link>
                <Link to={`/students/${student._id}/record`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  📋 Qeyd
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">👦 Yeni Uşaq</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="input-group">
                  <label>Ad</label>
                  <input className="input" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Soyad</label>
                  <input className="input" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="input-group">
                  <label>Doğum tarixi</label>
                  <input className="input" type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Cins</label>
                  <select className="input" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                    <option value="male">👦 Oğlan</option>
                    <option value="female">👧 Qız</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="input-group">
                  <label>Qrup</label>
                  <input className="input" value={form.group} onChange={e => setForm({...form, group: e.target.value})} placeholder="məs. A qrupu" />
                </div>
                <div className="input-group">
                  <label>Müəllim</label>
                  <select className="input" value={form.teacherId} onChange={e => setForm({...form, teacherId: e.target.value})}>
                    <option value="">Seçin...</option>
                    {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="input-group">
                  <label>Proqram başlama</label>
                  <input className="input" type="date" value={form.programStart} onChange={e => setForm({...form, programStart: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Proqram bitmə</label>
                  <input className="input" type="date" value={form.programEnd} onChange={e => setForm({...form, programEnd: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Qeydlər</label>
                <textarea className="input" style={{ height: 80, resize: 'vertical' }} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModal(false)}>Ləğv et</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>✅ Əlavə et</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

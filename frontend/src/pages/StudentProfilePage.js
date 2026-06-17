// StudentProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function StudentProfilePage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/students/${id}`),
      axios.get(`${API}/records/student/${id}`)
    ]).then(([s, r]) => { setStudent(s.data); setRecords(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><div style={{ textAlign: 'center', padding: 60 }}>⌛</div></div>;
  if (!student) return <div className="page"><p>Uşaq tapılmadı</p></div>;

  const getAge = (b) => b ? Math.floor((new Date() - new Date(b)) / (365.25*24*60*60*1000)) : '';
  const avgGrade = records.length ? Math.round(records.filter(r => r.averageGrade).reduce((s,r) => s+r.averageGrade,0) / records.filter(r => r.averageGrade).length * 10) / 10 : null;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">👦 Uşaq Profili</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to={`/students/${id}/record`} className="btn btn-primary">📋 Qeyd əlavə et</Link>
          <Link to={`/students/${id}/report`} className="btn btn-outline">📊 Hesabat</Link>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: student.gender === 'female' ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'linear-gradient(135deg, #4facfe, #00f2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
              {student.gender === 'female' ? '👧' : '👦'}
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 900 }}>{student.firstName} {student.lastName}</h2>
              <p style={{ color: 'var(--text-light)' }}>{getAge(student.birthDate)} yaş • {student.group || 'Qrup yoxdur'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Müəllim', value: student.teacherId?.name, icon: '👩‍🏫' },
              { label: 'Valideyn', value: student.parentId?.name, icon: '👨‍👩‍👦' },
              { label: 'Telefon', value: student.parentId?.phone, icon: '📞' },
              { label: 'Proqram', value: student.programStart ? `${new Date(student.programStart).toLocaleDateString()} → ${student.programEnd ? new Date(student.programEnd).toLocaleDateString() : '?'}` : null, icon: '📅' },
              { label: 'Qeydlər', value: student.notes, icon: '📝' }
            ].filter(i => i.value).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{item.icon}</span>
                <span style={{ color: 'var(--text-light)', fontSize: 13, minWidth: 80 }}>{item.label}:</span>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 800, marginBottom: 16 }}>📊 Statistika</h3>
          <div className="grid-2">
            {[
              { v: records.length, l: 'Dərs günü', c: '#6C63FF', i: '📅' },
              { v: avgGrade || '—', l: 'Ortalama', c: '#FFD93D', i: '⭐' },
              { v: records.filter(r => r.behavior?.rating === 'excellent').length, l: 'Əla davranış', c: '#6BCB77', i: '🌟' },
              { v: records.reduce((s, r) => s + (r.lessonsCompleted?.length||0), 0), l: 'Dərs tamamlandı', c: '#FF6B9D', i: '✅' }
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 16, background: 'var(--bg)', borderRadius: 12 }}>
                <div style={{ fontSize: 24 }}>{s.i}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 16 }}>📋 Son Qeydlər</h3>
        {records.length === 0 ? <p style={{ color: 'var(--text-light)' }}>Hələ qeyd yoxdur</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {records.slice(0, 10).map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'var(--bg)', borderRadius: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, minWidth: 90 }}>{new Date(r.date).toLocaleDateString('az-AZ')}</div>
                <div style={{ flex: 1, fontSize: 13, color: 'var(--text-light)' }}>{r.lessonsCompleted?.length || 0} məşğələ</div>
                {r.averageGrade && <span style={{ background: r.averageGrade>=8?'#6BCB7720':r.averageGrade>=5?'#FFB34720':'#FF6B6B20', color: r.averageGrade>=8?'#6BCB77':r.averageGrade>=5?'#FFB347':'#FF6B6B', padding: '4px 12px', borderRadius: 20, fontWeight: 800 }}>{r.averageGrade}</span>}
                <span style={{ fontSize: 20 }}>{r.behavior?.rating === 'excellent' ? '🌟' : r.behavior?.rating === 'good' ? '😊' : r.behavior?.rating === 'satisfactory' ? '😐' : '😢'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

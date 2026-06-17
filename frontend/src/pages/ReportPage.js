import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SUBJECT_NAMES = { math: 'Riyaziyyat', language: 'Dil', reading: 'Oxu', drawing: 'Rəsm', music: 'Musiqi', physical: 'B.T.', nature: 'Təbiət', logic: 'Məntiq', creativity: 'Yaradıcılıq' };

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/students/${id}/report`)
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><div style={{ textAlign: 'center', padding: 60 }}>⌛</div></div>;
  if (!data) return <div className="page"><p>Məlumat tapılmadı</p></div>;

  const { summary, records } = data;

  const gradeColor = (g) => g >= 8 ? '#6BCB77' : g >= 5 ? '#FFB347' : '#FF6B6B';

  // Həftəlik ortalama
  const weeklyData = {};
  records.forEach(r => {
    const week = Math.ceil((new Date(r.date) - new Date(records[0]?.date)) / (7 * 24 * 60 * 60 * 1000)) + 1;
    if (!weeklyData[week]) weeklyData[week] = [];
    if (r.averageGrade) weeklyData[week].push(r.averageGrade);
  });
  const weeklyAvg = Object.keys(weeklyData).map(w => ({
    week: w,
    avg: weeklyData[w].length ? Math.round(weeklyData[w].reduce((a, b) => a + b, 0) / weeklyData[w].length * 10) / 10 : 0
  }));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 {t('report.title')}</h1>
          <p className="page-subtitle">2 aylıq tam analiz</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Çap et</button>
          <button className="btn btn-outline" onClick={() => navigate(`/students/${id}`)}>← Geri</button>
        </div>
      </div>

      {/* Əsas statistika */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { icon: '📅', value: summary.totalDays, label: 'Dərs günü', color: '#6C63FF' },
          { icon: '⭐', value: summary.averageGrade || 0, label: 'Ortalama qiymət', color: '#FFD93D' },
          { icon: '😊', value: summary.behaviorStats?.excellent || 0, label: 'Əla davranış', color: '#6BCB77' },
          { icon: '📚', value: records.reduce((s, r) => s + (r.lessonsCompleted?.length || 0), 0), label: 'Tamamlanan dərs', color: '#FF6B9D' }
        ].map((s, i) => (
          <div key={i} className="card stat-card">
            <div style={{ fontSize: 34, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Ümumi qiymət göstəricisi */}
      <div className="card" style={{ marginBottom: 24, textAlign: 'center', padding: '32px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>🏆 Ümumi Nəticə</h2>
        <div style={{
          fontSize: 72, fontWeight: 900,
          color: gradeColor(summary.averageGrade || 0)
        }}>{summary.averageGrade || '—'}</div>
        <div style={{ fontSize: 16, color: 'var(--text-light)', marginTop: 8, fontWeight: 600 }}>/ 10</div>
        <div style={{ marginTop: 16 }}>
          <span style={{
            background: gradeColor(summary.averageGrade || 0) + '20',
            color: gradeColor(summary.averageGrade || 0),
            padding: '8px 20px', borderRadius: 20, fontWeight: 800, fontSize: 16
          }}>
            {summary.averageGrade >= 8 ? '🌟 Əla' : summary.averageGrade >= 6 ? '👍 Yaxşı' : summary.averageGrade >= 4 ? '📈 Qənaətbəxş' : '💪 Yaxşılaşdırılmalı'}
          </span>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Fənn üzrə qiymətlər */}
        {Object.keys(summary.subjectAverages || {}).length > 0 && (
          <div className="card">
            <h3 style={{ fontWeight: 800, marginBottom: 16 }}>📚 Fənn üzrə nəticə</h3>
            <Bar data={{
              labels: Object.keys(summary.subjectAverages).map(s => SUBJECT_NAMES[s] || s),
              datasets: [{
                label: 'Ortalama qiymət',
                data: Object.values(summary.subjectAverages),
                backgroundColor: ['#6C63FF', '#FF6B9D', '#FFD93D', '#6BCB77', '#4ECDC4', '#FF6B6B', '#a18cd1', '#fccb90', '#43e97b'],
                borderRadius: 8
              }]
            }} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 10 } } }} />
          </div>
        )}

        {/* Davranış dairəvi diaqramı */}
        {summary.behaviorStats && (
          <div className="card">
            <h3 style={{ fontWeight: 800, marginBottom: 16 }}>😊 Davranış statistikası</h3>
            <Doughnut data={{
              labels: ['Əla', 'Yaxşı', 'Qənaətbəxş', 'Yaxşılaşdırılmalı'],
              datasets: [{
                data: [
                  summary.behaviorStats.excellent || 0,
                  summary.behaviorStats.good || 0,
                  summary.behaviorStats.satisfactory || 0,
                  summary.behaviorStats.needs_improvement || 0
                ],
                backgroundColor: ['#FFD700', '#6BCB77', '#FFB347', '#FF6B6B'],
                borderWidth: 0
              }]
            }} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        )}
      </div>

      {/* Həftəlik tərəqqi */}
      {weeklyAvg.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 16 }}>📈 Həftəlik Tərəqqi</h3>
          <Line data={{
            labels: weeklyAvg.map(w => `Həftə ${w.week}`),
            datasets: [{
              label: 'Ortalama qiymət',
              data: weeklyAvg.map(w => w.avg),
              borderColor: '#6C63FF',
              backgroundColor: 'rgba(108,99,255,0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#6C63FF',
              pointRadius: 6
            }]
          }} options={{ responsive: true, scales: { y: { min: 0, max: 10 } }, plugins: { legend: { display: false } } }} />
        </div>
      )}

      {/* Son qeydlər */}
      <div className="card">
        <h3 style={{ fontWeight: 800, marginBottom: 16 }}>📋 Son Qeydlər</h3>
        {records.length === 0 ? (
          <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: 20 }}>Hələ qeyd yoxdur</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Tarix</th>
                  <th>Qiymət</th>
                  <th>Davranış</th>
                  <th>Qeyd</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 20).map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{new Date(r.date).toLocaleDateString('az-AZ')}</td>
                    <td>
                      <span style={{ background: gradeColor(r.averageGrade) + '20', color: gradeColor(r.averageGrade), padding: '4px 10px', borderRadius: 20, fontWeight: 800 }}>
                        {r.averageGrade || '—'}
                      </span>
                    </td>
                    <td>
                      {r.behavior?.rating === 'excellent' ? '🌟 Əla' :
                       r.behavior?.rating === 'good' ? '😊 Yaxşı' :
                       r.behavior?.rating === 'satisfactory' ? '😐 Qənaətbəxş' :
                       r.behavior?.rating === 'needs_improvement' ? '😢 Yaxşılaşdır.' : '—'}
                    </td>
                    <td style={{ color: 'var(--text-light)', fontSize: 13, maxWidth: 200 }}>{r.teacherNote || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

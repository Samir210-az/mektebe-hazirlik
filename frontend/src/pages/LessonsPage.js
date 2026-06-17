import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SUBJECT_EMOJI = { math: '🔢', language: '📝', reading: '📖', drawing: '🎨', music: '🎵', physical: '⚽', nature: '🌿', logic: '🧩', creativity: '✂️' };
const SUBJECT_COLORS = { math: '#667eea', language: '#f5576c', reading: '#4facfe', drawing: '#43e97b', music: '#fa709a', physical: '#30cfd0', nature: '#a8edea80', logic: '#fccb90', creativity: '#a18cd1' };

// Nümunə məşğələlər (şəkillərlə)
const SAMPLE_LESSONS = [
  {
    id: 1, subject: 'math', week: 1, day: 1,
    title: { az: 'Rəqəmlər 1-5 öyrənək', ru: 'Учим цифры 1-5', en: 'Learn numbers 1-5' },
    description: { az: '5 yaşlı uşaqlar üçün rəqəmləri əyləncəli yolla öyrənirik', ru: 'Учим цифры в игровой форме', en: 'Fun way to learn numbers' },
    duration: 20, difficulty: 'easy',
    activities: [
      { az: '🖐️ Barmaqlarla saymaq - 1,2,3,4,5', emoji: '🖐️' },
      { az: '🃏 Kart oyunu - rəqəm görüntüsü', emoji: '🃏' },
      { az: '🎵 Saymaq mahnısı', emoji: '🎵' },
      { az: '✏️ Rəqəmləri dəftərə yazmaq', emoji: '✏️' }
    ],
    objectives: ['Rəqəmləri tanımaq', 'Saymağı öyrənmək', 'Yazı bacarığı']
  },
  {
    id: 2, subject: 'language', week: 1, day: 1,
    title: { az: 'A hərfi - alma', ru: 'Буква А - яблоко', en: 'Letter A - apple' },
    description: { az: 'A hərfini öyrənək, alma ilə tanışlıq', ru: 'Знакомство с буквой А через яблоко', en: 'Learn letter A through apple' },
    duration: 25, difficulty: 'easy',
    activities: [
      { az: '🍎 Alma göstər - A deyirik', emoji: '🍎' },
      { az: '✏️ Hərfi yazırıq', emoji: '✏️' },
      { az: '🎨 A hərfini boyayırıq', emoji: '🎨' },
      { az: '🔤 A ilə başlayan 3 söz', emoji: '🔤' }
    ],
    objectives: ['A hərfini tanımaq', 'Yazmaq', 'Söz bilgisi']
  },
  {
    id: 3, subject: 'drawing', week: 1, day: 1,
    title: { az: 'Günəş çəkirik', ru: 'Рисуем солнышко', en: 'Drawing the sun' },
    description: { az: 'Dairə, düz xətt - ilk rəsm dərsi', ru: 'Первый урок рисования', en: 'First drawing lesson' },
    duration: 20, difficulty: 'easy',
    activities: [
      { az: '⭕ Dairə çızmaq', emoji: '⭕' },
      { az: '☀️ Şüalar əlavə etmək', emoji: '☀️' },
      { az: '🌈 Boyalarla boyamaq', emoji: '🌈' }
    ],
    objectives: ['Dairə çızmaq', 'Boyalarla işləmək', 'Yaradıcılıq']
  },
  {
    id: 4, subject: 'nature', week: 3, day: 1,
    title: { az: 'Fəsillər - Payız', ru: 'Времена года - Осень', en: 'Seasons - Autumn' },
    description: { az: 'Payız fəslinin əlamətlərini öyrənmək', ru: 'Признаки осени', en: 'Signs of autumn' },
    duration: 20, difficulty: 'easy',
    activities: [
      { az: '🍂 Yarpaqları toplamaq', emoji: '🍂' },
      { az: '🌧️ Payız hava haqqında danışmaq', emoji: '🌧️' },
      { az: '🎨 Payız ağacı çəkmək', emoji: '🎨' }
    ],
    objectives: ['Fəsilləri tanımaq', 'Müşahidə etmək', 'Rəsm']
  },
  {
    id: 5, subject: 'logic', week: 2, day: 2,
    title: { az: 'Fiqurları çeşidləyək', ru: 'Сортируем фигуры', en: 'Sort the shapes' },
    description: { az: 'Dairə, üçbucaq, kvadrat - fiqurları tanı və çeşidlə', ru: 'Круг, треугольник, квадрат', en: 'Circle, triangle, square' },
    duration: 20, difficulty: 'easy',
    activities: [
      { az: '🔴 Dairəni tap', emoji: '🔴' },
      { az: '🔺 Üçbucağı say', emoji: '🔺' },
      { az: '🟦 Kvadratla rəsm', emoji: '🟦' }
    ],
    objectives: ['Fiqurları tanımaq', 'Çeşidləmək', 'Məntiq']
  },
  {
    id: 6, subject: 'music', week: 2, day: 2,
    title: { az: 'Uşaq mahnıları', ru: 'Детские песни', en: 'Children songs' },
    description: { az: 'Azərbaycan xalq uşaq mahnıları', ru: 'Азербайджанские народные детские песни', en: 'Azerbaijani folk children songs' },
    duration: 15, difficulty: 'easy',
    activities: [
      { az: '🎵 "Getdim yara baxçasına" mahnısı', emoji: '🎵' },
      { az: '👏 Ritm tutmaq', emoji: '👏' },
      { az: '🕺 Rəqs hərəkətləri', emoji: '🕺' }
    ],
    objectives: ['Musiqi hissi', 'Ritm', 'İfadəlilik']
  }
];

export default function LessonsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'az';
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'all' ? SAMPLE_LESSONS : SAMPLE_LESSONS.filter(l => l.subject === filter);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">📚 {t('nav.lessons')}</h1>
          <p className="page-subtitle">Nümunə məşğələlər — şəkillərlə izahlı</p>
        </div>
      </div>

      {/* Fənn filtri */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {['all', 'math', 'language', 'reading', 'drawing', 'music', 'physical', 'nature', 'logic', 'creativity'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className="btn"
            style={{ background: filter === s ? (s === 'all' ? 'var(--primary)' : SUBJECT_COLORS[s]) : 'white', color: filter === s ? 'white' : 'var(--text)', border: '2px solid', borderColor: filter === s ? (s === 'all' ? 'var(--primary)' : SUBJECT_COLORS[s]) : 'var(--border)', fontSize: 13 }}>
            {s === 'all' ? '🎯 Hamısı' : `${SUBJECT_EMOJI[s]} ${t(`curriculum.subjects.${s}`)}`}
          </button>
        ))}
      </div>

      {/* Məşğələ kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map((lesson) => (
          <div key={lesson.id} className="card" style={{ borderLeft: `5px solid ${SUBJECT_COLORS[lesson.subject]}`, cursor: 'pointer' }}
            onClick={() => setSelected(selected?.id === lesson.id ? null : lesson)}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: SUBJECT_COLORS[lesson.subject], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                {SUBJECT_EMOJI[lesson.subject]}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.3 }}>{typeof lesson.title === 'object' ? lesson.title[lang] || lesson.title.az : lesson.title}</h3>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">⏱ {lesson.duration} dəq</span>
                  <span className="badge" style={{ background: '#6BCB7720', color: '#6BCB77' }}>Həftə {lesson.week}</span>
                  <span className="badge badge-warning">😊 Asan</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 12 }}>{typeof lesson.description === 'object' ? lesson.description[lang] || lesson.description.az : lesson.description}</p>

            {/* Fəaliyyətlər önizleme */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {lesson.activities.slice(0, 3).map((act, i) => (
                <span key={i} style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  {act.emoji} {typeof act === 'object' ? (act[lang] || act.az || '') : act}
                </span>
              ))}
              {lesson.activities.length > 3 && <span style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: 20, fontSize: 12, color: 'var(--text-light)' }}>+{lesson.activities.length - 3}</span>}
            </div>

            {/* Detallı görünüş */}
            {selected?.id === lesson.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '2px solid var(--border)' }}>
                <h4 style={{ fontWeight: 800, marginBottom: 10 }}>🎯 Məqsədlər:</h4>
                {lesson.objectives.map((o, i) => <div key={i} style={{ fontSize: 13, padding: '4px 0', color: 'var(--text)' }}>✅ {o}</div>)}
                <h4 style={{ fontWeight: 800, margin: '14px 0 10px' }}>🎮 Tam fəaliyyətlər:</h4>
                {lesson.activities.map((act, i) => (
                  <div key={i} style={{ padding: '8px 12px', background: 'var(--bg)', borderRadius: 10, marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
                    {act.emoji} {typeof act === 'object' ? (act[lang] || act.az || '') : act}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 50 }}>📚</div>
          <p style={{ color: 'var(--text-light)', marginTop: 16 }}>Bu fənn üçün nümunə tapılmadı</p>
        </div>
      )}
    </div>
  );
}

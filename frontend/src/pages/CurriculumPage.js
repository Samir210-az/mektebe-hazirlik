import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const subjectEmoji = { math: '🔢', language: '📝', reading: '📖', drawing: '🎨', music: '🎵', physical: '⚽', nature: '🌿', logic: '🧩', creativity: '✂️' };
const subjectColors = {
  math: '#667eea', language: '#f5576c', reading: '#4facfe', drawing: '#43e97b',
  music: '#fa709a', physical: '#30cfd0', nature: '#a8edea', logic: '#fccb90', creativity: '#a18cd1'
};
const dayNames = { az: ['', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə'], ru: ['', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'], en: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] };

export default function CurriculumPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'az';
  const [curriculum, setCurriculum] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/curriculum`).then(res => { setCurriculum(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div style={{ textAlign: 'center', padding: 60 }}>⌛ Yüklənir...</div></div>;
  if (!curriculum) return <div className="page"><p>Məlumat yüklənmədi</p></div>;

  const currentWeek = curriculum.weeks?.find(w => w.week === selectedWeek);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">📅 {t('curriculum.title')}</h1>
          <p className="page-subtitle">5-6 yaş • Azərbaycana uyğunlaşdırılmış</p>
        </div>
      </div>

      {/* Həftə seçimi */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {curriculum.weeks?.map(w => (
          <button key={w.week} onClick={() => { setSelectedWeek(w.week); setSelectedDay(null); }} className="btn"
            style={{
              background: selectedWeek === w.week ? 'var(--primary)' : 'white',
              color: selectedWeek === w.week ? 'white' : 'var(--text)',
              border: '2px solid', borderColor: selectedWeek === w.week ? 'var(--primary)' : 'var(--border)'
            }}>
            {t('curriculum.week')} {w.week}
          </button>
        ))}
      </div>

      {currentWeek && (
        <>
          {/* Həftə mövzusu */}
          <div style={{ background: 'linear-gradient(135deg, #6C63FF, #FF6B9D)', color: 'white', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 600 }}>{t('curriculum.week')} {currentWeek.week}</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, margin: '4px 0' }}>
              {typeof currentWeek.theme === 'object' ? currentWeek.theme[lang] || currentWeek.theme.az : currentWeek.theme}
            </h2>
          </div>

          {/* Günlər */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
            {currentWeek.days?.map(day => (
              <button key={day.day} onClick={() => setSelectedDay(selectedDay?.day === day.day ? null : day)}
                style={{
                  background: selectedDay?.day === day.day ? 'var(--primary)' : 'white',
                  color: selectedDay?.day === day.day ? 'white' : 'var(--text)',
                  border: '2px solid', borderColor: selectedDay?.day === day.day ? 'var(--primary)' : 'var(--border)',
                  borderRadius: 14, padding: '14px 8px', cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}>
                <div style={{ fontWeight: 900, fontSize: 13 }}>{dayNames[lang]?.[day.day] || `Gün ${day.day}`}</div>
                <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>{day.lessons?.length} dərs</div>
              </button>
            ))}
          </div>

          {/* Seçilmiş günün dərslərı */}
          {selectedDay && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                📚 {dayNames[lang]?.[selectedDay.day]} — {selectedDay.lessons?.length} məşğələ
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {selectedDay.lessons?.map((lesson, i) => (
                  <div key={i} className="card" style={{ borderLeft: `5px solid ${subjectColors[lesson.subject] || '#6C63FF'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: subjectColors[lesson.subject] || '#6C63FF', fontSize: 24
                      }}>{subjectEmoji[lesson.subject] || '📚'}</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>
                          {typeof lesson.title === 'object' ? lesson.title[lang] || lesson.title.az : lesson.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>
                          ⏱ {lesson.duration} {t('curriculum.dqq')} • {t(`curriculum.subjects.${lesson.subject}`)}
                        </div>
                      </div>
                    </div>

                    {lesson.activities && lesson.activities.length > 0 && (
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-light)', marginBottom: 6 }}>🎯 Fəaliyyətlər:</p>
                        {lesson.activities.map((act, ai) => (
                          <div key={ai} style={{ fontSize: 12, padding: '4px 0', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                            • {typeof act === 'object' ? act[lang] || act.az || act : act}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bütün həftə görünüşü (gün seçilməyibsə) */}
          {!selectedDay && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-light)' }}>
                📊 Həftəlik icmal — Günü seçin
              </h3>
              <div style={{ display: 'grid', gap: 8 }}>
                {currentWeek.days?.map(day => (
                  <div key={day.day} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', cursor: 'pointer' }}
                    onClick={() => setSelectedDay(day)}>
                    <div style={{ fontWeight: 800, minWidth: 150, color: 'var(--primary)' }}>{dayNames[lang]?.[day.day]}</div>
                    <div style={{ display: 'flex', gap: 8, flex: 1, flexWrap: 'wrap' }}>
                      {day.lessons?.map((l, i) => (
                        <span key={i} style={{
                          background: subjectColors[l.subject] + '20',
                          color: subjectColors[l.subject] || '#6C63FF',
                          padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700
                        }}>{subjectEmoji[l.subject]} {t(`curriculum.subjects.${l.subject}`)}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

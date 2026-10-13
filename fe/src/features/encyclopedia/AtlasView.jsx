import React, { useState } from 'react';
import { STORIES_MASTER } from '../../data/master/storiesMaster';
import { CHARACTERS_MASTER } from '../../data/master/charactersMaster';
import { AUDIO_MASTER } from '../../data/master/audioMaster';
import WayangFigureSvg from '../../components/stage/WayangFigureSvg';
import soundEngine from '../../services/soundscape';
import {
  BookOpen,
  Users,
  Music,
  Search,
  Play,
  Square,
  Info,
} from 'lucide-react';

export default function AtlasView({ onPlayCharacterOnStage }) {
  const [activeTab, setActiveTab] = useState('stories'); // 'stories' | 'characters' | 'audio'
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [selectedStoryModal, setSelectedStoryModal] = useState(null);
  const [selectedCharModal, setSelectedCharModal] = useState(null);
  const [previewPose, setPreviewPose] = useState('default');

  // Filter Data
  const filteredStories = STORIES_MASTER.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tradition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCharacters = CHARACTERS_MASTER.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAudio = AUDIO_MASTER.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.instrument.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleAudio = (audio) => {
    if (playingAudioId === audio.id) {
      soundEngine.stopBgm();
      setPlayingAudioId(null);
    } else {
      if (audio.category === 'bgm') {
        soundEngine.startBgm(audio.synthType, audio.title);
      } else if (audio.category === 'sfx') {
        if (audio.synthType === 'dodogan') soundEngine.playDodogan();
        else if (audio.synthType === 'kepyak') soundEngine.playKepyak();
        else if (audio.synthType === 'gong') soundEngine.playGong();
      }
      setPlayingAudioId(audio.id);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px', color: 'var(--text-main, #fbf8ee)' }}>
      {/* Header Banner Atlas */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2b1b11, #140e09)',
          border: '1px solid #5a3b22',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.65)',
        }}
      >
        <div style={{ display: 'inline-block', background: '#8b4513', border: '1px solid #d4af37', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#fcf6e8', marginBottom: '8px' }}>
          KATALOG BUDAYA & ATRIBUSI
        </div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', color: '#fcf6e8' }}>
          Story & Character Atlas
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#bfae9c', maxWidth: '720px', lineHeight: '1.6' }}>
          Jelajahi lakon wiracarita, filosofi luhur watak pewayangan, naskah rujukan bersejarah, serta tata suara gamelan tradisional. Semua aset terhubung dengan prinsip <em>Cultural Integrity</em> dan atribusi sumber yang jelas.
        </p>
      </div>

      {/* Navigasi Tab & Pencarian */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('stories')}
            style={{
              ...tabBtnStyle,
              background: activeTab === 'stories' ? '#8b4513' : '#1a130d',
              color: activeTab === 'stories' ? '#fcf6e8' : '#bfae9c',
              borderColor: activeTab === 'stories' ? '#d4af37' : '#362619',
            }}
          >
            <BookOpen size={15} /> Lakon Cerita ({STORIES_MASTER.length})
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            style={{
              ...tabBtnStyle,
              background: activeTab === 'characters' ? '#8b4513' : '#1a130d',
              color: activeTab === 'characters' ? '#fcf6e8' : '#bfae9c',
              borderColor: activeTab === 'characters' ? '#d4af37' : '#362619',
            }}
          >
            <Users size={15} /> Tokoh Wayang ({CHARACTERS_MASTER.length})
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            style={{
              ...tabBtnStyle,
              background: activeTab === 'audio' ? '#8b4513' : '#1a130d',
              color: activeTab === 'audio' ? '#fcf6e8' : '#bfae9c',
              borderColor: activeTab === 'audio' ? '#d4af37' : '#362619',
            }}
          >
            <Music size={15} /> Tata Suara ({AUDIO_MASTER.length})
          </button>
        </div>

        {/* Input Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari cerita, tokoh, atau instrumen..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              background: '#1a1822',
              border: '1px solid #373347',
              borderRadius: '20px',
              color: '#fff',
              fontSize: '12px',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* KONTEN TAB: 1. CERITA (LAKON) */}
      {activeTab === 'stories' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredStories.map((story) => (
            <div
              key={story.id}
              style={{
                background: '#1b1824',
                border: '1px solid #3d3247',
                borderRadius: '14px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>{story.tradition}</span>
                  <span style={{ fontSize: '10px', color: '#9ca3af', background: '#272333', padding: '2px 8px', borderRadius: '8px' }}>
                    {story.versionLabel}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#fef3c7' }}>{story.title}</h3>
                <p style={{ fontSize: '12px', color: '#d1d5db', lineHeight: '1.5', marginBottom: '12px' }}>
                  {story.synopsis}
                </p>

                {/* Nilai Filosofis */}
                <div style={{ background: '#27201c', borderLeft: '3px solid #f59e0b', padding: '8px 12px', borderRadius: '4px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#fbbf24', display: 'block', marginBottom: '2px' }}>
                    Nilai Luhur & Filosofi:
                  </span>
                  <p style={{ margin: 0, fontSize: '11px', color: '#e5e7eb', fontStyle: 'italic' }}>
                    "{story.philosophy}"
                  </p>
                </div>

                {/* Rujukan Sumber Dokumen (Provenance) */}
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '12px' }}>
                  <strong>Rujukan Naskah Asal:</strong>
                  {story.sources.map((src, i) => (
                    <div key={i} style={{ marginTop: '2px' }}>
                      • {src.title} — {src.author} ({src.rightsNote})
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedStoryModal(story)}
                  style={{
                    width: '100%',
                    background: '#231e2e',
                    border: '1px solid #4a3e61',
                    color: '#fef3c7',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Info size={13} color="#f59e0b" /> Baca Lengkap, Karakter & Naskah Rujukan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KONTEN TAB: 2. TOKOH WAYANG (CHARACTERS) */}
      {activeTab === 'characters' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredCharacters.map((char) => (
            <div
              key={char.id}
              style={{
                background: '#1b1824',
                border: '1px solid #3d3247',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                transition: 'all 0.2s',
              }}
            >
              {/* Siluet Wayang Mini Preview */}
              <div
                style={{
                  width: '90px',
                  height: '130px',
                  background: 'radial-gradient(circle, #3d2b1a 0%, #15111e 80%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${char.accentColor || '#78350f'}`,
                  flexShrink: 0,
                }}
              >
                <WayangFigureSvg slug={char.slug} scale={0.42} width={80} height={120} accentColor={char.accentColor} />
              </div>

              {/* Detail Karakter */}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '10px', color: char.accentColor, fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {char.typeName}
                </span>
                <h3 style={{ margin: '2px 0 2px 0', fontSize: '16px', color: '#fff' }}>{char.name}</h3>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>{char.alias}</div>
                <div style={{ fontSize: '11px', color: '#d1d5db', lineHeight: '1.4', marginBottom: '8px' }}>
                  {char.description}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: '#fbbf24' }}>Pusaka: {char.weapons}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => {
                        setSelectedCharModal(char);
                        setPreviewPose('default');
                      }}
                      title="Lihat profil mendalam & uji pose"
                      style={{
                        background: '#231e2e',
                        border: '1px solid #4a3e61',
                        color: '#d1d5db',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Info size={12} color="#f59e0b" /> Profil & Pose
                    </button>
                    <button
                      onClick={() => onPlayCharacterOnStage && onPlayCharacterOnStage(char.id)}
                      style={{
                        background: '#78350f',
                        border: '1px solid #d97706',
                        color: '#fef3c7',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Mainkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KONTEN TAB: 3. TATA SUARA & SFX */}
      {activeTab === 'audio' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredAudio.map((audio) => {
            const isPlaying = playingAudioId === audio.id;
            return (
              <div
                key={audio.id}
                style={{
                  background: '#1b1824',
                  border: '1px solid #3d3247',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', background: audio.category === 'bgm' ? '#065f46' : '#78350f', color: '#fff', padding: '2px 6px', borderRadius: '6px' }}>
                      {audio.category.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>{audio.tempo}</span>
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#fef3c7' }}>{audio.title}</h4>
                  <div style={{ fontSize: '11px', color: '#d1d5db', marginBottom: '4px' }}>
                    Instrumen: {audio.instrument}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>
                    {audio.sourceNote} • {audio.licenseNote}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAudio(audio)}
                  style={{
                    background: isPlaying ? '#ef4444' : '#b45309',
                    border: 'none',
                    color: '#fff',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  {isPlaying ? <Square size={16} /> : <Play size={16} />}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: DETAIL LAKON CERITA (FR-02) */}
      {selectedStoryModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#1a1824',
              border: '2px solid #78350f',
              borderRadius: '16px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              color: '#f9fafb',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>
                  {selectedStoryModal.tradition} • {selectedStoryModal.versionLabel}
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', color: '#fef3c7' }}>
                  {selectedStoryModal.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedStoryModal(null)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#f59e0b' }}>Ringkasan Lakon</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#d1d5db', lineHeight: '1.6' }}>
                {selectedStoryModal.synopsis}
              </p>
            </div>

            <div
              style={{
                background: '#261c14',
                borderLeft: '4px solid #f59e0b',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            >
              <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#fbbf24' }}>
                Makna Filosofis & Nilai Moral
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#fef3c7', lineHeight: '1.5', fontStyle: 'italic' }}>
                "{selectedStoryModal.philosophy}"
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#38bdf8' }}>
                Catatan Sumber & Integritas Budaya
              </h4>
              <div style={{ background: '#131118', padding: '12px', borderRadius: '8px', border: '1px solid #2e283b' }}>
                {selectedStoryModal.sources.map((src, i) => (
                  <div key={i} style={{ marginBottom: i < selectedStoryModal.sources.length - 1 ? '10px' : 0, fontSize: '12px' }}>
                    <div style={{ fontWeight: 'bold', color: '#e0f2fe' }}>{src.title}</div>
                    <div style={{ color: '#94a3b8' }}>Pengarang / Penerbit: {src.author}</div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Rujukan: {src.reference} • Hak Cipta: {src.rightsNote}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => setSelectedStoryModal(null)}
                style={{
                  background: '#27272a',
                  border: '1px solid #3f3f46',
                  color: '#e4e4e7',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAIL PROFIL KARAKTER & UJI POSE (FR-03) */}
      {selectedCharModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#1a1824',
              border: '2px solid #78350f',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              color: '#f9fafb',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: selectedCharModal.accentColor, fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {selectedCharModal.typeName}
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', color: '#fef3c7' }}>
                  {selectedCharModal.name}
                </h2>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{selectedCharModal.alias}</div>
              </div>
              <button
                onClick={() => setSelectedCharModal(null)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
              {/* Kanvas Interactive Pose Preview */}
              <div
                style={{
                  background: 'radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.2) 0%, #110e17 75%)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `1px solid ${selectedCharModal.accentColor || '#78350f'}`,
                  textAlign: 'center',
                }}
              >
                <WayangFigureSvg
                  slug={selectedCharModal.slug}
                  pose={previewPose}
                  scale={0.8}
                  width={140}
                  height={200}
                  accentColor={selectedCharModal.accentColor}
                />
                <div style={{ fontSize: '11px', color: '#d1d5db', marginTop: '8px' }}>
                  Pose Aktif: <strong style={{ color: selectedCharModal.accentColor }}>{previewPose.toUpperCase()}</strong>
                </div>

                {/* Tombol Pilihan Pose */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', marginTop: '10px' }}>
                  {selectedCharModal.availablePoses.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPreviewPose(p)}
                      style={{
                        background: previewPose === p ? '#b45309' : '#272333',
                        border: `1px solid ${previewPose === p ? '#f59e0b' : '#3f384f'}`,
                        color: '#fef3c7',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Watak & Nilai Filosofis */}
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#f59e0b' }}>Senjata & Pusaka</h4>
                  <div style={{ fontSize: '12px', color: '#e5e7eb' }}>{selectedCharModal.weapons}</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#f59e0b' }}>Watak & Karakteristik</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#d1d5db', lineHeight: '1.5' }}>
                    {selectedCharModal.description}
                  </p>
                </div>

                <div
                  style={{
                    background: '#261c14',
                    borderLeft: '3px solid #f59e0b',
                    padding: '8px 12px',
                    borderRadius: '6px',
                  }}
                >
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#fbbf24' }}>Nilai Luhur</h4>
                  <p style={{ margin: 0, fontSize: '11px', color: '#fef3c7', lineHeight: '1.4', fontStyle: 'italic' }}>
                    "{selectedCharModal.philosophy}"
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #2e283b', paddingTop: '16px' }}>
              <button
                onClick={() => setSelectedCharModal(null)}
                style={{
                  background: '#27272a',
                  border: '1px solid #3f3f46',
                  color: '#e4e4e7',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  if (onPlayCharacterOnStage) onPlayCharacterOnStage(selectedCharModal.id);
                  setSelectedCharModal(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)',
                }}
              >
                Mainkan di Virtual Stage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const tabBtnStyle = {
  borderWidth: '1px',
  borderStyle: 'solid',
  padding: '8px 16px',
  borderRadius: '10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  fontWeight: '600',
  transition: 'all 0.15s ease',
};

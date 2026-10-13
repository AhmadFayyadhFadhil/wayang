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
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#bfae9c' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lakon, tokoh, pusaka..."
            style={{
              width: '100%',
              padding: '9px 14px 9px 36px',
              background: '#17110c',
              border: '1px solid #362619',
              borderRadius: '20px',
              color: '#fcfaf2',
              fontSize: '12px',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* KONTEN TAB: 1. CERITA (LAKON) - PROGRESSIVE DISCLOSURE */}
      {activeTab === 'stories' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredStories.map((story) => (
            <div
              key={story.id}
              style={{
                background: '#17110c',
                border: '1px solid #362619',
                borderRadius: '16px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {story.tradition}
                  </span>
                  <span style={{ fontSize: '10px', color: '#bfae9c', background: '#231a13', border: '1px solid #362619', padding: '2px 8px', borderRadius: '12px' }}>
                    {story.versionLabel}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 10px 0', fontSize: '19px', color: '#fcfaf2', fontWeight: '700' }}>
                  {story.title}
                </h3>

                <p style={{ fontSize: '13px', color: '#bfae9c', lineHeight: '1.6', marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {story.synopsis}
                </p>

                {/* Nilai Filosofis Ringkas */}
                <div style={{ background: '#221a13', borderLeft: '3px solid #d4af37', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                    Intisari Filosofi:
                  </div>
                  <div style={{ fontSize: '12px', color: '#fcfaf2', fontStyle: 'italic', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    "{story.philosophy}"
                  </div>
                </div>
              </div>

              {/* Footer Kartu & Tombol Baca Lengkap */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#bfae9c', paddingBottom: '12px', borderBottom: '1px solid #231a13', marginBottom: '12px' }}>
                  <span>{story.sources.length} Naskah Kuno Terkurasi</span>
                  <span style={{ color: '#d4af37' }}>{story.theme_song || 'Gamelan Klasik'}</span>
                </div>

                <button
                  onClick={() => setSelectedStoryModal(story)}
                  style={{
                    width: '100%',
                    background: '#221a13',
                    border: '1px solid #4a3826',
                    color: '#d4af37',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <BookOpen size={14} /> Baca Naskah & Filosofi Lengkap
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KONTEN TAB: 2. TOKOH WAYANG (CHARACTERS) */}
      {activeTab === 'characters' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredCharacters.map((char) => (
            <div
              key={char.id}
              style={{
                background: '#17110c',
                border: '1px solid #362619',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
            >
              {/* Siluet Wayang Mini Preview */}
              <div
                style={{
                  width: '95px',
                  height: '140px',
                  background: 'radial-gradient(circle, #2a1d13 0%, #120e0a 80%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${char.accentColor || '#d4af37'}`,
                  flexShrink: 0,
                }}
              >
                <WayangFigureSvg slug={char.slug} scale={0.46} width={85} height={125} accentColor={char.accentColor} />
              </div>

              {/* Detail Karakter */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '10px', color: char.accentColor, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {char.typeName}
                </span>
                <h3 style={{ margin: '2px 0 2px 0', fontSize: '17px', color: '#fcfaf2', fontWeight: '700' }}>{char.name}</h3>
                <div style={{ fontSize: '11px', color: '#bfae9c', marginBottom: '6px' }}>{char.alias}</div>
                <div style={{ fontSize: '12px', color: '#e5dec9', lineHeight: '1.4', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {char.description}
                </div>

                <div style={{ fontSize: '11px', color: '#d4af37', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <strong>Pusaka:</strong> {char.weapons}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSelectedCharModal(char);
                      setPreviewPose('default');
                    }}
                    title="Lihat profil mendalam & uji pose"
                    style={{
                      flex: 1,
                      background: '#221a13',
                      border: '1px solid #4a3826',
                      color: '#d4af37',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <Info size={12} color="#d4af37" /> Profil & Pose
                  </button>
                  <button
                    onClick={() => onPlayCharacterOnStage && onPlayCharacterOnStage(char.id)}
                    style={{
                      background: 'linear-gradient(135deg, #d4af37, #8b4513)',
                      border: 'none',
                      color: '#0d0a07',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '800',
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
          ))}
        </div>
      )}

      {/* KONTEN TAB: 3. TATA SUARA & SFX */}
      {activeTab === 'audio' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {filteredAudio.map((audio) => {
            const isPlaying = playingAudioId === audio.id;
            return (
              <div
                key={audio.id}
                style={{
                  background: '#17110c',
                  border: '1px solid #362619',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', background: '#221a13', border: '1px solid #362619', color: '#d4af37', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                      {audio.category.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '11px', color: '#bfae9c' }}>{audio.tempo}</span>
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#fcfaf2', fontWeight: '700' }}>{audio.title}</h4>
                  <div style={{ fontSize: '12px', color: '#bfae9c', marginBottom: '4px' }}>
                    Instrumen: {audio.instrument}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8c7d6e' }}>
                    {audio.sourceNote} • {audio.licenseNote}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAudio(audio)}
                  style={{
                    background: isPlaying ? '#991b1b' : 'linear-gradient(135deg, #d4af37, #8b4513)',
                    border: 'none',
                    color: isPlaying ? '#fff' : '#0d0a07',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isPlaying ? '0 4px 15px rgba(153, 27, 27, 0.4)' : '0 4px 15px rgba(212, 175, 55, 0.3)',
                    flexShrink: 0,
                    fontWeight: 'bold',
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
              background: '#17110c',
              border: '1px solid #d4af37',
              borderRadius: '16px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              color: '#fcfaf2',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212, 175, 55, 0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {selectedStoryModal.tradition} • {selectedStoryModal.versionLabel}
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', color: '#fcfaf2', fontWeight: '700' }}>
                  {selectedStoryModal.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedStoryModal(null)}
                style={{ background: 'none', border: 'none', color: '#bfae9c', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#d4af37', fontWeight: '700' }}>Ringkasan Lakon</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#e5dec9', lineHeight: '1.6' }}>
                {selectedStoryModal.synopsis}
              </p>
            </div>

            <div
              style={{
                background: '#221a13',
                borderLeft: '4px solid #d4af37',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            >
              <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#d4af37' }}>
                Makna Filosofis & Nilai Moral
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#fcfaf2', lineHeight: '1.5', fontStyle: 'italic' }}>
                "{selectedStoryModal.philosophy}"
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#d4af37', fontWeight: '700' }}>
                Catatan Sumber & Integritas Budaya
              </h4>
              <div style={{ background: '#120e0a', padding: '14px', borderRadius: '8px', border: '1px solid #362619' }}>
                {selectedStoryModal.sources.map((src, i) => (
                  <div key={i} style={{ marginBottom: i < selectedStoryModal.sources.length - 1 ? '10px' : 0, fontSize: '12px' }}>
                    <div style={{ fontWeight: 'bold', color: '#fcfaf2' }}>{src.title}</div>
                    <div style={{ color: '#bfae9c' }}>Pengarang / Penerbit: {src.author}</div>
                    <div style={{ color: '#8c7d6e', fontSize: '11px' }}>Rujukan: {src.reference} • Hak Cipta: {src.rightsNote}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => setSelectedStoryModal(null)}
                style={{
                  background: '#221a13',
                  border: '1px solid #4a3826',
                  color: '#fcfaf2',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
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
              background: '#17110c',
              border: '1px solid #d4af37',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              color: '#fcfaf2',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212, 175, 55, 0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: selectedCharModal.accentColor, fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {selectedCharModal.typeName}
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', color: '#fcfaf2', fontWeight: '700' }}>
                  {selectedCharModal.name}
                </h2>
                <div style={{ fontSize: '12px', color: '#bfae9c' }}>{selectedCharModal.alias}</div>
              </div>
              <button
                onClick={() => setSelectedCharModal(null)}
                style={{ background: 'none', border: 'none', color: '#bfae9c', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
              {/* Kanvas Interactive Pose Preview */}
              <div
                style={{
                  background: 'radial-gradient(circle at 50% 40%, rgba(212, 175, 55, 0.18) 0%, #120e0a 75%)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `1px solid ${selectedCharModal.accentColor || '#d4af37'}`,
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
                <div style={{ fontSize: '11px', color: '#bfae9c', marginTop: '8px' }}>
                  Pose Aktif: <strong style={{ color: selectedCharModal.accentColor }}>{previewPose.toUpperCase()}</strong>
                </div>

                {/* Tombol Pilihan Pose */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', marginTop: '10px' }}>
                  {selectedCharModal.availablePoses.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPreviewPose(p)}
                      style={{
                        background: previewPose === p ? 'linear-gradient(135deg, #d4af37, #8b4513)' : '#221a13',
                        border: `1px solid ${previewPose === p ? '#d4af37' : '#362619'}`,
                        color: previewPose === p ? '#0d0a07' : '#fcfaf2',
                        fontWeight: previewPose === p ? '700' : '500',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
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
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#d4af37' }}>Senjata & Pusaka</h4>
                  <div style={{ fontSize: '12px', color: '#fcfaf2' }}>{selectedCharModal.weapons}</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#d4af37' }}>Watak & Karakteristik</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#e5dec9', lineHeight: '1.5' }}>
                    {selectedCharModal.description}
                  </p>
                </div>

                <div
                  style={{
                    background: '#221a13',
                    borderLeft: '3px solid #d4af37',
                    padding: '10px 14px',
                    borderRadius: '6px',
                  }}
                >
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#d4af37' }}>Nilai Luhur</h4>
                  <p style={{ margin: 0, fontSize: '11px', color: '#fcfaf2', lineHeight: '1.4', fontStyle: 'italic' }}>
                    "{selectedCharModal.philosophy}"
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #362619', paddingTop: '16px' }}>
              <button
                onClick={() => setSelectedCharModal(null)}
                style={{
                  background: '#221a13',
                  border: '1px solid #4a3826',
                  color: '#fcfaf2',
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
                  background: 'linear-gradient(135deg, #d4af37, #8b4513)',
                  border: 'none',
                  color: '#0d0a07',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
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

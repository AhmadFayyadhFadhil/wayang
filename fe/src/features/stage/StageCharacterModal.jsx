import React, { useState, useRef, useMemo } from 'react';
import { CHARACTERS_MASTER } from '../../data/master/charactersMaster';
import soundEngine from '../../services/soundscape';
import { UserPlus, Upload, Search, X } from 'lucide-react';

import avatarGatotkaca from '../../assets/avatar_gatotkaca.png';
import avatarArjuna from '../../assets/avatar_arjuna.png';
import avatarShinta from '../../assets/avatar_shinta.png';
import avatarBima from '../../assets/avatar_bima.png';

const CHAR_AVATARS = {
  gatotkaca: avatarGatotkaca,
  arjuna: avatarArjuna,
  shinta: avatarShinta,
  werkudara: avatarBima,
};

export default function StageCharacterModal({
  isOpen,
  onClose,
  onAddCharacter,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const customFileInputRef = useRef(null);

  const filteredCharacters = useMemo(() => {
    if (!searchQuery.trim()) return CHARACTERS_MASTER;
    const q = searchQuery.toLowerCase();
    return CHARACTERS_MASTER.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.typeName && c.typeName.toLowerCase().includes(q)) ||
        (c.weapons && c.weapons.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleUploadCustomPuppet = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    onAddCharacter({
      name: cleanName || 'Wayang Koleksi Dalang',
      customImageUrl: url,
    });
    onClose();
    try {
      soundEngine.playDodogan();
    } catch {
      // Audio fail-soft
    }
  };

  return (
    <div
      className="wayang-modal-backdrop"
      style={{ zIndex: 1100 }}
      onClick={onClose}
    >
      <div
        className="wayang-modal-chassis"
        style={{ maxWidth: '640px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="wayang-modal-inner modal-custom-scroll" style={{ padding: '28px 24px' }}>
          <div className="wayang-modal-hairline" />

          {/* Header Modal */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '16px',
              marginBottom: '16px',
              borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
              paddingBottom: '14px',
            }}
          >
            <div>
              <div className="wayang-modal-eyebrow" style={{ marginBottom: '6px' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
                <span>ROSTER TOKOH WAYANG KULIT</span>
              </div>
              <h4
                style={{
                  margin: 0,
                  color: '#1a140e',
                  fontSize: '20px',
                  fontWeight: '850',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  letterSpacing: '-0.3px',
                  fontFamily: 'Cinzel, Georgia, serif',
                }}
              >
                <UserPlus size={18} style={{ color: '#8b4513' }} />
                <span>Pilih Tokoh ke Panggung Kelir</span>
              </h4>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Dialog"
              className="wayang-modal-close-btn"
            >
              <X size={18} />
            </button>
          </div>

          {/* Input File Tersembunyi untuk Unggah Wayang Sendiri */}
          <input
            ref={customFileInputRef}
            type="file"
            accept="image/png,image/webp,image/jpeg"
            onChange={handleUploadCustomPuppet}
            style={{ display: 'none' }}
          />

          {/* Bar Pencarian & Tombol Unggah */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '18px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: '220px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  color: '#8b4513',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari tokoh wayang (nama, watak, pusaka)..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  background: '#fcfaf5',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: '#1a140e',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => customFileInputRef.current?.click()}
              style={{
                background: 'linear-gradient(135deg, #2a1c12 0%, #150d08 100%)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                borderRadius: '10px',
                color: '#fef08a',
                padding: '9px 14px',
                fontSize: '12px',
                fontWeight: 750,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                whiteSpace: 'nowrap',
              }}
            >
              <Upload size={14} style={{ color: '#eab308' }} />
              <span>+ Unggah Wayang Sendiri</span>
            </button>
          </div>

          {/* Grid Tokoh Karakter */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px',
              maxHeight: '380px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {filteredCharacters.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '36px 12px',
                  color: '#8b4513',
                  fontSize: '13.5px',
                }}
              >
                Tokoh tidak ditemukan. Gunakan tombol &quot;Unggah Wayang Sendiri&quot; untuk menambahkan gambar custom.
              </div>
            ) : (
              filteredCharacters.map((char) => {
                const avatarImg = CHAR_AVATARS[char.slug];

                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      onAddCharacter(char.id);
                      onClose();
                      try { soundEngine.playDodogan(); } catch {}
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: '#ffffff',
                      border: '1px solid rgba(212, 175, 55, 0.32)',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      color: '#1a140e',
                      textAlign: 'left',
                      minHeight: '44px',
                      boxShadow: '0 2px 8px rgba(40, 28, 16, 0.04)',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#d4af37';
                      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.32)';
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        border: `1.5px solid ${char.accentColor || '#d4af37'}`,
                        overflow: 'hidden',
                        background: '#0d0805',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {avatarImg ? (
                        <img src={avatarImg} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontWeight: '800', color: '#e8bb5c', fontSize: '15px' }}>{char.name[0]}</span>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#1a140e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {char.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#8b4513', fontWeight: '700', marginTop: '1px' }}>
                        {char.typeName}
                      </div>
                      {char.weapons && (
                        <div style={{ fontSize: '10.5px', color: '#6e5e4d', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Pusaka: {char.weapons.split(',')[0]}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

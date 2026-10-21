import React, { useState } from 'react';
import {
  getAllBackgrounds,
  saveCustomBackground,
  deleteCustomBackground,
} from '../../data/master/stageConfigMaster';
import { X, Check, Sparkles, Plus, Trash2 } from 'lucide-react';

export default function StageBackgroundModal({
  isOpen,
  onClose,
  currentBackgroundId,
  onSelectBackground,
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'image' | 'gradient' | 'custom'
  const [applyToAll, setApplyToAll] = useState(false);
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Form custom background
  const [customName, setCustomName] = useState('');
  const [customAtmosphere, setCustomAtmosphere] = useState('');
  const [customBgType, setCustomBgType] = useState('gradient');
  const [customBgImage, setCustomBgImage] = useState('');
  const [customGlowColor, setCustomGlowColor] = useState('#d4af37');
  const customKelirColor = '#fef3c7';
  const customBgColor = '#17110c';

  if (!isOpen) return null;

  const allBackgrounds = getAllBackgrounds();

  const filtered = allBackgrounds.filter((bg) => {
    if (filterType === 'image') return bg.bgType === 'image';
    if (filterType === 'gradient') return bg.bgType === 'gradient';
    if (filterType === 'custom') return bg.isCustom;
    return true;
  });

  const handleSelect = (bgId) => {
    onSelectBackground(bgId, applyToAll);
    onClose();
  };

  const handleSaveCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const id = `custom-bg-${Date.now()}`;
    const newBg = {
      id,
      name: customName.trim(),
      atmosphere: customAtmosphere.trim() || 'Kustom Pilihan Dalang',
      description: 'Latar panggung kreasi mandiri pengguna.',
      bgType: customBgType,
      bgImage: customBgType === 'image' ? customBgImage.trim() : undefined,
      glowColor: customGlowColor,
      kelirColor: customKelirColor,
      bgColor: customBgColor,
      shadowColor: '#2b1a10',
      status: 'published',
      isCustom: true,
    };

    saveCustomBackground(newBg);
    setIsAddingCustom(false);
    setCustomName('');
    setCustomAtmosphere('');
    setCustomBgImage('');

    // Langsung terapkan panggung baru
    onSelectBackground(id, applyToAll);
  };

  const handleDeleteCustom = (e, bgId) => {
    e.stopPropagation();
    deleteCustomBackground(bgId);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10, 7, 5, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          background: '#18120c',
          border: '1px solid #8b4513',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212, 175, 55, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div
          style={{
            padding: '20px 24px 16px 24px',
            borderBottom: '1px solid #362619',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, #221811 0%, #18120c 100%)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#d4af37',
                }}
              >
                <Sparkles size={16} />
              </span>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#fcfaf2' }}>
                Pilih Latar Kelir Panggung
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 36px', fontSize: '13px', color: '#bfae9c' }}>
              Sesuaikan suasana kain kelir pakem pedalangan untuk babak lakon yang sedang dirancang.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '10px',
              color: '#d4af37',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Tab & Controls */}
        <div
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid #2a1c12',
            background: '#140e09',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'all', label: 'Semua Latar' },
              { id: 'image', label: 'Latar Bergambar HD' },
              { id: 'gradient', label: 'Kelir Gradasi Klasik' },
              { id: 'custom', label: 'Latar Kustom' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                style={{
                  background: filterType === tab.id ? '#d4af37' : 'rgba(255, 255, 255, 0.04)',
                  color: filterType === tab.id ? '#0d0a07' : '#bfae9c',
                  border: filterType === tab.id ? '1px solid #e5c158' : '1px solid #362619',
                  borderRadius: '20px',
                  padding: '5px 14px',
                  fontSize: '12px',
                  fontWeight: filterType === tab.id ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            style={{
              background: isAddingCustom ? 'rgba(239, 68, 68, 0.15)' : 'rgba(212, 175, 55, 0.12)',
              border: `1px solid ${isAddingCustom ? '#ef4444' : '#d4af37'}`,
              color: isAddingCustom ? '#ef4444' : '#e5c158',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isAddingCustom ? <X size={14} /> : <Plus size={14} />}
            <span>{isAddingCustom ? 'Tutup Form' : 'Tambah Kelir Kustom'}</span>
          </button>
        </div>

        {/* Form Tambah Kustom jika dibuka */}
        {isAddingCustom && (
          <form
            onSubmit={handleSaveCustom}
            style={{
              margin: '16px 24px 0 24px',
              padding: '16px',
              background: '#221811',
              borderRadius: '12px',
              border: '1px solid #8b4513',
            }}
          >
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#e5c158', fontWeight: '700' }}>
              Buat Desain Panggung Kustom
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#bfae9c', marginBottom: '4px' }}>
                  Nama Panggung *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Alas Dandaka Senja"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#bfae9c', marginBottom: '4px' }}>
                  Suasana Budaya
                </label>
                <input
                  type="text"
                  placeholder="Misal: Rindang, Mistis & Wening"
                  value={customAtmosphere}
                  onChange={(e) => setCustomAtmosphere(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#bfae9c', marginBottom: '4px' }}>
                  Tipe Latar
                </label>
                <select
                  value={customBgType}
                  onChange={(e) => setCustomBgType(e.target.value)}
                  style={inputStyle}
                >
                  <option value="gradient">Gradasi Kelir Klasik</option>
                  <option value="image">Gambar / Foto Latar HD</option>
                </select>
              </div>

              {customBgType === 'image' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#bfae9c', marginBottom: '4px' }}>
                    Path / URL Gambar Latar
                  </label>
                  <input
                    type="text"
                    placeholder="/images/backgrounds/nama_file.png"
                    value={customBgImage}
                    onChange={(e) => setCustomBgImage(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#bfae9c', marginBottom: '4px' }}>
                  Warna Blencong (Glow)
                </label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={customGlowColor}
                    onChange={(e) => setCustomGlowColor(e.target.value)}
                    style={{ width: '36px', height: '32px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={customGlowColor}
                    onChange={(e) => setCustomGlowColor(e.target.value)}
                    style={{ ...inputStyle, width: '90px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                style={{
                  background: 'none',
                  border: '1px solid #5c3a21',
                  color: '#bfae9c',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{
                  background: '#d4af37',
                  border: 'none',
                  color: '#0d0a07',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Simpan & Terapkan
              </button>
            </div>
          </form>
        )}

        {/* Galeri Kartu Panggung Visual (Scrollable) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
          }}
        >
          {filtered.map((bg) => {
            const isSelected = bg.id === currentBackgroundId;

            return (
              <div
                key={bg.id}
                onClick={() => handleSelect(bg.id)}
                style={{
                  background: '#221911',
                  border: isSelected ? '2px solid #d4af37' : '1px solid #3d2a1b',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isSelected
                    ? '0 0 20px rgba(212, 175, 55, 0.35), 0 8px 18px rgba(0,0,0,0.6)'
                    : '0 4px 12px rgba(0,0,0,0.4)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#8b4513';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#3d2a1b';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Thumbnail Panggung 16:9 */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '52%',
                    overflow: 'hidden',
                    background: `radial-gradient(ellipse at 50% 25%, ${bg.glowColor}44 0%, ${bg.kelirColor} 45%, ${bg.bgColor} 100%)`,
                  }}
                >
                  {/* Gambar Latar jika ada */}
                  {bg.bgImage && (
                    <img
                      src={bg.bgImage}
                      alt={bg.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: bg.imageOpacity || 0.9,
                      }}
                    />
                  )}

                  {/* Lampu Blencong Mini */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${bg.glowColor} 0%, rgba(245, 158, 11, 0.4) 40%, transparent 70%)`,
                      filter: 'blur(5px)',
                    }}
                  />

                  {/* Debog Pisang Mini di Dasar */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '16%',
                      background: 'linear-gradient(to top, #140b05 0%, #29180c 100%)',
                      borderTop: '1px solid #78350f',
                    }}
                  />

                  {/* Badge Status Aktif */}
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#d4af37',
                        color: '#0d0a07',
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                      <span>Aktif</span>
                    </div>
                  )}

                  {/* Tag Tipe Latar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(13, 10, 7, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#e5c158',
                      fontSize: '9px',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    {bg.bgType === 'image' ? 'Gambar HD' : 'Gradasi Klasik'}
                  </div>
                </div>

                {/* Deskripsi & Judul Panggung */}
                <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#fcfaf2' }}>
                      {bg.name}
                    </h4>
                    {bg.isCustom && (
                      <button
                        onClick={(e) => handleDeleteCustom(e, bg.id)}
                        title="Hapus panggung kustom ini"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#d4af37', fontWeight: '600', marginTop: '2px' }}>
                    {bg.atmosphere}
                  </div>
                  <p
                    style={{
                      margin: '6px 0 0 0',
                      fontSize: '11px',
                      color: '#bfae9c',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {bg.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Modal: Opsi Terapkan & Tombol Tutup */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #362619',
            background: '#140e09',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#fcfaf2',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              style={{ accentColor: '#d4af37', width: '15px', height: '15px', cursor: 'pointer' }}
            />
            <span>Terapkan pilihan panggung ini ke seluruh adegan dalam pertunjukan</span>
          </label>

          <button
            onClick={onClose}
            style={{
              background: '#231a13',
              border: '1px solid #5c3a21',
              color: '#fcfaf2',
              padding: '8px 20px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '7px 10px',
  background: '#160f09',
  border: '1px solid #5c3a21',
  borderRadius: '6px',
  color: '#fcfaf2',
  fontSize: '12px',
  boxSizing: 'border-box',
};

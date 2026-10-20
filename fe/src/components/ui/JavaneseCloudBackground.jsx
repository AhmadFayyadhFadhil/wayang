import React from 'react';
import cloudUkel from '../../assets/cloud_javanese_ukel.png';
import cloudPanji from '../../assets/cloud_javanese_panji.png';

/**
 * Komponen Elemen Tunggal Awan Ukel Jawa
 * Motif awan bergulung bertingkat dengan ukiran ukel pilin dan gradasi soga prada otentik
 */
export function JavaneseCloudUkel({
  className = '',
  style = {},
  mirrored = false,
  animated = false,
  animationType = 'drift-left', // 'drift-left' | 'drift-right'
  alt = 'Awan Ukel Wayang Jawa',
}) {
  const animClass = animated
    ? animationType === 'drift-right'
      ? 'javanese-cloud-drift-right'
      : 'javanese-cloud-drift-left'
    : '';

  return (
    <div
      className={`${animClass} ${className}`}
      style={{
        display: 'inline-block',
        pointerEvents: 'none',
        userSelect: 'none',
        willChange: animated ? 'transform' : 'auto',
        transform: mirrored ? 'scaleX(-1)' : undefined,
        ...style,
      }}
    >
      <img
        src={cloudUkel}
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

/**
 * Komponen Elemen Tunggal Awan Panji Jawa
 * Motif awan sayap simetris meruncing dengan spiral ukel ganda di bagian tengah
 */
export function JavaneseCloudPanji({
  className = '',
  style = {},
  mirrored = false,
  animated = false,
  animationType = 'float-panji', // 'float-panji' | 'float-panji-mirrored' | 'drift-center'
  alt = 'Awan Panji Wayang Jawa',
}) {
  let animClass = '';
  if (animated) {
    if (animationType === 'float-panji-mirrored') {
      animClass = 'javanese-cloud-float-panji-mirrored';
    } else if (animationType === 'drift-center') {
      animClass = 'javanese-cloud-drift-center';
    } else {
      animClass = 'javanese-cloud-float-panji';
    }
  }

  return (
    <div
      className={`${animClass} ${className}`}
      style={{
        display: 'inline-block',
        pointerEvents: 'none',
        userSelect: 'none',
        willChange: animated ? 'transform' : 'auto',
        transform: mirrored ? 'scaleX(-1)' : undefined,
        ...style,
      }}
    >
      <img
        src={cloudPanji}
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

/**
 * Backward compatibility exports
 */
export const JavaneseCloudLeft = (props) => (
  <JavaneseCloudUkel {...props} mirrored={false} animated={false} />
);
export const JavaneseCloudRight = (props) => (
  <JavaneseCloudUkel {...props} mirrored={true} animated={false} />
);
export const JavaneseCloudWisp = (props) => (
  <JavaneseCloudPanji {...props} animated={false} />
);

/**
 * Komponen Utama: Latar Belakang Motif Awan Wayang Tradisional Jawa
 * Menampilkan motif awan ukel & panji otentik Nusantara dengan animasi mengambang/melayang halus
 * Dikalibrasi agar tidak menabrak cardbox / teks konten dan bebas dari kontras kotor/kasar
 *
 * @param {number} opacity - Tingkat transparansi motif (default adaptif sesuai theme)
 * @param {boolean} animated - Mengaktifkan animasi melayang multi-axis (default: true)
 * @param {string} theme - 'dark' (untuk Hero panggung kelir malam) | 'light' (untuk section terang dengan cardbox)
 * @param {string} variant - Varian layout susunan:
 *   - 'hero': Suasana panggung kelir dramatis di langit atas dan horizon panggung
 *   - 'flanking': Hanya di margin tepi kiri & kanan luar (sangat aman untuk area dengan cardbox)
 *   - 'tall-section': Susunan awan di tepi margin luar untuk section vertikal tinggi
 *   - 'single': Satu awan panji mengambang elegan di horizon
 * @param {object} style - Kustomisasi style inline container
 * @param {boolean} showBottom - Menampilkan awan di bawah cardbox/konten (default: true)
 * @param {object} style - Kustomisasi style inline container
 * @param {string} className - Kelas CSS tambahan
 */
export default function JavaneseCloudBackground({
  opacity,
  animated = true,
  theme = 'dark',
  variant = 'flanking',
  showBottom = true,
  style = {},
  className = '',
}) {
  const isLight = theme === 'light';

  // Opasitas default yang harmonis:
  // - Pada section terang dengan cardbox: 0.22 (halus seperti watermark batik sutra, tidak kontras mengotori kartu)
  // - Pada hero panggung kelir gelap: 0.85 (keemasan hangat di langit malam)
  const resolvedOpacity = opacity !== undefined ? opacity : (isLight ? 0.22 : 0.85);

  // Filter bayangan:
  // - Pada tema terang: bayangan soga hangat lembut tanpa halo hitam kotor
  // - Pada tema gelap: bayangan malam dramatis
  const cloudFilter = isLight
    ? 'drop-shadow(0 2px 8px rgba(139, 90, 27, 0.08))'
    : 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.50)) drop-shadow(0 2px 6px rgba(40, 24, 12, 0.30))';

  return (
    <div
      className={`javanese-cloud-container ${isLight ? 'javanese-cloud-light-theme' : ''} ${className}`}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0, // Selalu di lapisan dasar di belakang cardbox dan konten
        opacity: resolvedOpacity,
        userSelect: 'none',
        transition: 'opacity 0.4s ease',
        ...style,
      }}
    >
      {/* ====================================================================
          VARIAN 1: HERO / DRAMATIC STAGE ATMOSPHERE (Untuk Panggung Gelap)
          Awan diletakkan di langit atas dan margin tepi, tidak menabrak stat box tengah
          ==================================================================== */}
      {variant === 'hero' && (
        <>
          {/* Awan Panji Tengah Atas (Zenith Sky Floating Cloud) - Di atas eyebrow, aman dari cardbox */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(260px, 28vw, 440px)',
              pointerEvents: 'none',
            }}
          >
            <div
              className={animated ? 'javanese-cloud-drift-center' : ''}
              style={{
                width: '100%',
                filter: cloudFilter,
              }}
            >
              <img
                src={cloudPanji}
                alt="Awan Panji Jawa Tengah Atas"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>

          {/* Awan Ukel Kiri Atas (Flanking Left Utama) */}
          <div
            className={animated ? 'javanese-cloud-drift-left' : ''}
            style={{
              position: 'absolute',
              top: '32px',
              left: '-20px',
              width: 'clamp(290px, 29vw, 480px)',
              filter: cloudFilter,
            }}
          >
            <img
              src={cloudUkel}
              alt="Awan Ukel Jawa Kiri Atas"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Awan Ukel Kanan Atas (Flanking Right Utama, Mirrored) */}
          <div
            className={animated ? 'javanese-cloud-drift-right' : ''}
            style={{
              position: 'absolute',
              top: '40px',
              right: '-20px',
              width: 'clamp(280px, 28vw, 460px)',
              filter: cloudFilter,
            }}
          >
            <img
              src={cloudUkel}
              alt="Awan Ukel Jawa Kanan Atas"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* Awan Panji Horizon Kiri (Margin Tepi Bawah, di luar area cardbox) */}
          <div
            className={animated ? 'javanese-cloud-float-panji' : ''}
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '-30px',
              width: 'clamp(220px, 20vw, 340px)',
              filter: cloudFilter,
            }}
          >
            <img
              src={cloudPanji}
              alt="Awan Panji Jawa Horizon Kiri"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Awan Panji Horizon Kanan (Margin Tepi Bawah, di luar area cardbox) */}
          <div
            className={animated ? 'javanese-cloud-float-panji-mirrored' : ''}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '-30px',
              width: 'clamp(230px, 21vw, 360px)',
              filter: cloudFilter,
            }}
          >
            <img
              src={cloudPanji}
              alt="Awan Panji Jawa Horizon Kanan"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        </>
      )}

      {/* ====================================================================
          VARIAN 2: FLANKING (Dirancang Khusus untuk Section dengan Cardbox)
          Awan hadir di tepi atas DAN tepi bawah cardbox (sesuai arahan: jangan di atas aja)
          ==================================================================== */}
      {variant === 'flanking' && (
        <>
          {/* Awan Ukel Margin Kiri Atas */}
          <div
            className={animated ? 'javanese-cloud-drift-left' : ''}
            style={{
              position: 'absolute',
              top: '20px',
              left: '-40px',
              width: 'clamp(250px, 24vw, 380px)',
              filter: cloudFilter,
            }}
          >
            <img
              src={cloudUkel}
              alt="Awan Ukel Jawa Margin Kiri Atas"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Awan Ukel Margin Kanan Atas (Mirrored) */}
          <div
            className={animated ? 'javanese-cloud-drift-right' : ''}
            style={{
              position: 'absolute',
              top: '28px',
              right: '-40px',
              width: 'clamp(240px, 23vw, 370px)',
              filter: cloudFilter,
            }}
          >
            <img
              src={cloudUkel}
              alt="Awan Ukel Jawa Margin Kanan Atas"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* Awan di Bawah Cardbox (Tepi Bawah Kiri, Kanan, dan Tengah Horizon) */}
          {showBottom && (
            <>
              {/* Awan Ukel Margin Kiri Bawah (Di Bawah Cardbox Sisi Kiri) */}
              <div
                className={animated ? 'javanese-cloud-drift-left' : ''}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '-35px',
                  width: 'clamp(230px, 22vw, 350px)',
                  filter: cloudFilter,
                }}
              >
                <img
                  src={cloudUkel}
                  alt="Awan Ukel Jawa Margin Kiri Bawah"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              {/* Awan Panji Tengah Bawah (Tepat Mengambang Lembut di Bawah Barisan Cardbox) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'clamp(270px, 26vw, 420px)',
                  pointerEvents: 'none',
                }}
              >
                <div
                  className={animated ? 'javanese-cloud-drift-center' : ''}
                  style={{
                    width: '100%',
                    filter: cloudFilter,
                  }}
                >
                  <img
                    src={cloudPanji}
                    alt="Awan Panji Jawa Tengah Bawah"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </div>

              {/* Awan Ukel Margin Kanan Bawah (Di Bawah Cardbox Sisi Kanan, Mirrored) */}
              <div
                className={animated ? 'javanese-cloud-drift-right' : ''}
                style={{
                  position: 'absolute',
                  bottom: '22px',
                  right: '-35px',
                  width: 'clamp(230px, 22vw, 350px)',
                  filter: cloudFilter,
                }}
              >
                <img
                  src={cloudUkel}
                  alt="Awan Ukel Jawa Margin Kanan Bawah"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </>
          )}
        </>
      )}

      {/* ====================================================================
          VARIAN 3: TALL-SECTION (Untuk Halaman Panjang / Katalog)
          Awan tersebar di tepi vertikal margin luar dan dasar halaman
          ==================================================================== */}
      {variant === 'tall-section' && (
        <>
          {/* Awan Ukel Atas Kiri Luar */}
          <div
            className={animated ? 'javanese-cloud-drift-left' : ''}
            style={{
              position: 'absolute',
              top: '20px',
              left: '-40px',
              width: 'clamp(250px, 24vw, 380px)',
              filter: cloudFilter,
            }}
          >
            <img
              src={cloudUkel}
              alt="Awan Ukel Jawa Atas Kiri"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Awan Ukel Atas Kanan Luar */}
          <div
            className={animated ? 'javanese-cloud-drift-right' : ''}
            style={{
              position: 'absolute',
              top: '36px',
              right: '-40px',
              width: 'clamp(240px, 23vw, 370px)',
              filter: cloudFilter,
            }}
          >
            <img
              src={cloudUkel}
              alt="Awan Ukel Jawa Atas Kanan"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* Awan Panji Bawah Kiri Luar (Margin Gutter Samping) */}
          <div
            className={animated ? 'javanese-cloud-float-panji' : ''}
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '-35px',
              width: 'clamp(220px, 20vw, 340px)',
              filter: cloudFilter,
            }}
          >
            <img
              src={cloudPanji}
              alt="Awan Panji Jawa Bawah Kiri"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Awan Panji Tengah Bawah (Horizon Dasar) */}
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(270px, 26vw, 420px)',
              pointerEvents: 'none',
            }}
          >
            <div
              className={animated ? 'javanese-cloud-drift-center' : ''}
              style={{
                width: '100%',
                filter: cloudFilter,
              }}
            >
              <img
                src={cloudPanji}
                alt="Awan Panji Jawa Horizon Tengah"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>

          {/* Awan Panji Bawah Kanan Luar (Margin Gutter Samping) */}
          <div
            className={animated ? 'javanese-cloud-float-panji-mirrored' : ''}
            style={{
              position: 'absolute',
              bottom: '38px',
              right: '-35px',
              width: 'clamp(220px, 20vw, 340px)',
              filter: cloudFilter,
            }}
          >
            <img
              src={cloudPanji}
              alt="Awan Panji Jawa Bawah Kanan"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        </>
      )}

      {/* ====================================================================
          VARIAN 4: SINGLE
          Satu awan panji berayun lembut di horizon
          ==================================================================== */}
      {variant === 'single' && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'clamp(260px, 28vw, 440px)',
            pointerEvents: 'none',
          }}
        >
          <div
            className={animated ? 'javanese-cloud-drift-center' : ''}
            style={{
              width: '100%',
              filter: cloudFilter,
            }}
          >
            <img
              src={cloudPanji}
              alt="Awan Panji Tunggal Wayang Jawa"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

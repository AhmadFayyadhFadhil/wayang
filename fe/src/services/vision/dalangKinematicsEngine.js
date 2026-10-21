import soundEngine from '../soundscape';

/**
 * DalangKinematicsEngine
 * Menerjemahkan 21 titik koordinat MediaPipe Hands ke kinematika wayang kulit
 * Mendukung Mode Dalang Tunggal (1 Tokoh Rinci) dan Mode Dalang Ganda (2 Tokoh Laga)
 */
class DalangKinematicsEngine {
  constructor() {
    this.mode = 'dual'; // 'solo' | 'dual'
    this.isMirrored = true;
    this.alpha = 0.28; // Koefisien Low-Pass Filter Exponential Moving Average (EMA)

    // State Pelacakan Halus
    this.smoothedHands = [];
    this.lastWayangStates = new Map(); // instanceId -> { x, y, pose, facing }
    this.grabbedMap = new Map(); // handIndex -> instanceId

    // Hentakan Dodogan Deteksi
    this.lastY = [0, 0];
    this.lastTimestamp = performance.now();
    this.lastDodoganTime = 0;

    // Status Interaksi untuk UI HUD
    this.statusMessage = 'Mencari telapak tangan di depan kamera...';
    this.statusTone = 'idle'; // 'idle' | 'detected' | 'grabbing' | 'tancep'
  }

  setMode(newMode) {
    if (newMode === 'solo' || newMode === 'dual') {
      this.mode = newMode;
      this.grabbedMap.clear();
      this.statusMessage = `Beralih ke ${newMode === 'solo' ? 'Mode Dalang Tunggal (1 Tokoh Rinci)' : 'Mode Dalang Ganda (Laga 2 Tokoh)'}`;
    }
  }

  setMirrored(mirrored) {
    this.isMirrored = mirrored;
  }

  /**
   * Jarak Euclidean antara dua titik landmark
   */
  getDistance(p1, p2) {
    if (!p1 || !p2) return 1;
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = (p1.z || 0) - (p2.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Perhitungan cubitan jempol dan telunjuk (Cengkeram Cempurit)
   * Landmark 4 = Thumb Tip, Landmark 8 = Index Tip
   */
  isPinching(landmarks) {
    if (!landmarks || landmarks.length < 9) return false;
    const dist = this.getDistance(landmarks[4], landmarks[8]);
    return dist < 0.082; // Threshold cubitan cempurit
  }

  /**
   * Deteksi apakah telapak tangan mengepal tinju (Fist)
   */
  isFist(landmarks) {
    if (!landmarks || landmarks.length < 21) return false;
    const wrist = landmarks[0];
    // Jarak ujung semua jari ke pergelangan tangan memendek
    const d8 = this.getDistance(landmarks[8], wrist);
    const d12 = this.getDistance(landmarks[12], wrist);
    const d16 = this.getDistance(landmarks[16], wrist);
    const d20 = this.getDistance(landmarks[20], wrist);
    return d8 < 0.28 && d12 < 0.28 && d16 < 0.28 && d20 < 0.28;
  }

  /**
   * Deteksi pose sembah (kedua telapak merapat berhadapan)
   */
  isSembah(hand1, hand2) {
    if (!hand1 || !hand2) return false;
    const distPalms = this.getDistance(hand1[9], hand2[9]);
    return distPalms < 0.15;
  }

  /**
   * Memproses hasil deteksi MediaPipe pada setiap frame
   * Mengembalikan daftar update karakter: [ { instanceId, updates: { x, y, pose, facing, ... } } ]
   */
  processFrame(results, characters = [], selectedInstanceId = null) {
    const rawHands = results?.landmarks || [];
    const now = performance.now();
    const dt = Math.max(16, now - this.lastTimestamp);
    this.lastTimestamp = now;

    // KASUS 1: Tangan tidak terlihat / keluar dari kamera -> TANCEP DEBOG
    if (rawHands.length === 0) {
      this.statusMessage = 'Tangan di luar kamera — Wayang tertancap di debog';
      this.statusTone = 'tancep';
      this.smoothedHands = [];
      return [];
    }

    // Normalisasi dan Smoothing Landmark Tangan
    const hands = rawHands.map((landmarks, hIdx) => {
      // Pusat telapak (MCP tengah = #9)
      const rawX = this.isMirrored ? 1.0 - landmarks[9].x : landmarks[9].x;
      const rawY = landmarks[9].y;

      // Filter Low-Pass (EMA)
      const prev = this.smoothedHands[hIdx] || { x: rawX, y: rawY };
      const smoothX = this.alpha * rawX + (1 - this.alpha) * prev.x;
      const smoothY = this.alpha * rawY + (1 - this.alpha) * prev.y;

      // Cek kecepatan hentakan ke bawah (Dodogan SFX)
      const velY = (rawY - (this.lastY[hIdx] || rawY)) / (dt / 1000);
      this.lastY[hIdx] = rawY;

      if (velY > 2.6 && now - this.lastDodoganTime > 380) {
        try {
          soundEngine.playDodogan();
          this.lastDodoganTime = now;
        } catch {
          // Safe audio
        }
      }

      return {
        rawLandmarks: landmarks,
        x: Math.max(0.06, Math.min(0.94, smoothX)),
        y: Math.max(0.35, Math.min(0.85, smoothY)),
        isPinching: this.isPinching(landmarks),
        isFist: this.isFist(landmarks),
      };
    });

    this.smoothedHands = hands;
    const updates = [];

    // =========================================================================
    // MODE 1: DALANG TUNGGAL (1 TOKOH RINCI DENGAN TUDING)
    // =========================================================================
    if (this.mode === 'solo') {
      if (characters.length === 0) return [];

      // Tentukan target wayang aktif
      let targetChar = characters.find((c) => c.instanceId === selectedInstanceId);
      if (!targetChar) targetChar = characters[0];
      if (!targetChar) return [];

      const primaryHand = hands[0];
      const secondaryHand = hands[1];

      // Hand 1 (Kendali Cempurit / Posisi Badan)
      if (primaryHand) {
        if (primaryHand.isPinching) {
          this.statusMessage = `Menggerakkan ${targetChar.name || 'Wayang'} (Cempurit Terkunci)`;
          this.statusTone = 'grabbing';

          // Arah hadap otomatis
          let facing = targetChar.facing || 'right';
          if (primaryHand.x > targetChar.x + 0.03) facing = 'right';
          else if (primaryHand.x < targetChar.x - 0.03) facing = 'left';

          let pose = targetChar.pose || 'default';
          if (primaryHand.isFist) pose = 'perang';

          updates.push({
            instanceId: targetChar.instanceId,
            updates: {
              x: Number(primaryHand.x.toFixed(4)),
              y: Number(primaryHand.y.toFixed(4)),
              facing,
              pose,
            },
          });
        } else {
          this.statusMessage = `Tangan siap — Jepit jempol-telunjuk untuk memegang ${targetChar.name || 'wayang'}`;
          this.statusTone = 'detected';
        }
      }

      // Hand 2 (Kendali Tuding Tangan / Artikulasi Ekstra)
      if (secondaryHand && updates.length > 0) {
        // Jika dua tangan merapat berdekatan -> Pose Sembah
        if (this.isSembah(primaryHand.rawLandmarks, secondaryHand.rawLandmarks)) {
          updates[0].updates.pose = 'sembah';
          this.statusMessage = `${targetChar.name || 'Wayang'} bersikap Sembah Takzim`;
        } else if (secondaryHand.isFist) {
          updates[0].updates.pose = 'perang';
        }
      }

      return updates;
    }

    // =========================================================================
    // MODE 2: DALANG GANDA (2 TOKOH LAGA / PERANG TANDING)
    // =========================================================================
    if (this.mode === 'dual') {
      if (characters.length === 0) return [];

      // Sortir karakter dari kiri ke kanan panggung
      const sortedChars = [...characters].sort((a, b) => a.x - b.x);
      const leftChar = sortedChars[0];
      const rightChar = sortedChars.length > 1 ? sortedChars[1] : null;

      // Cek apakah kedua tangan saling berbenturan (Clash Laga)
      const isClashing = hands.length >= 2 && this.getDistance(hands[0].rawLandmarks[9], hands[1].rawLandmarks[9]) < 0.18;
      const isDualSembah = hands.length >= 2 && this.isSembah(hands[0].rawLandmarks, hands[1].rawLandmarks);

      let anyGrabbing = false;

      // Petakan setiap tangan yang terdeteksi
      hands.forEach((hand) => {
        // Tangan di sisi kiri layar -> Tokoh Kiri (Left Character)
        if (hand.x <= 0.52 && leftChar) {
          if (hand.isPinching) {
            anyGrabbing = true;
            let pose = 'default';
            if (isDualSembah) pose = 'sembah';
            else if (isClashing || hand.isFist) pose = 'perang';

            updates.push({
              instanceId: leftChar.instanceId,
              updates: {
                x: Number(Math.min(0.55, hand.x).toFixed(4)),
                y: Number(hand.y.toFixed(4)),
                facing: 'right', // Tokoh kiri selalu menghadap ke kanan (ke arah musuh)
                pose,
              },
            });
          }
        }
        // Tangan di sisi kanan layar -> Tokoh Kanan (Right Character)
        else if (hand.x > 0.48 && rightChar) {
          if (hand.isPinching) {
            anyGrabbing = true;
            let pose = 'default';
            if (isDualSembah) pose = 'sembah';
            else if (isClashing || hand.isFist) pose = 'perang';

            updates.push({
              instanceId: rightChar.instanceId,
              updates: {
                x: Number(Math.max(0.45, hand.x).toFixed(4)),
                y: Number(hand.y.toFixed(4)),
                facing: 'left', // Tokoh kanan selalu menghadap ke kiri
                pose,
              },
            });
          }
        }
      });

      // Perbarui pesan status HUD
      if (isClashing) {
        this.statusMessage = '⚔️ Laga Sabetan: Kedua tokoh berbenturan senjata!';
        this.statusTone = 'grabbing';
      } else if (isDualSembah) {
        this.statusMessage = '🙏 Sembah Bersama: Kedua ksatria saling menghormat.';
        this.statusTone = 'grabbing';
      } else if (anyGrabbing) {
        this.statusMessage = 'Wayang digenggam — Gerakkan telapak untuk solah sabetan';
        this.statusTone = 'grabbing';
      } else {
        this.statusMessage = 'Tangan terdeteksi — Jepit jari cempurit di kiri / kanan untuk mendalang';
        this.statusTone = 'detected';
      }

      return updates;
    }

    return [];
  }
}

export const dalangKinematicsEngine = new DalangKinematicsEngine();
export default dalangKinematicsEngine;

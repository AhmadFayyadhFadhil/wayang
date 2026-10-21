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

    // Normalisasi dan Smoothing Landmark Tangan dengan Adaptive Damping & Time Scaling
    const timeScale = Math.min(2.0, Math.max(0.5, dt / 16.67));

    const hands = rawHands.map((landmarks, hIdx) => {
      // Pusat telapak (MCP tengah = #9)
      const rawX = this.isMirrored ? 1.0 - landmarks[9].x : landmarks[9].x;
      const rawY = landmarks[9].y;

      // Hitung orientasi kemiringan telapak tangan (Hand Tilt):
      // Vektor horizontal dari pergelangan tangan (wrist = #0) ke pangkal jari tengah (MCP = #9)
      const wristRawX = this.isMirrored ? 1.0 - landmarks[0].x : landmarks[0].x;
      const tiltX = rawX - wristRawX; // Positif jika telapak miring ke kanan, negatif jika miring ke kiri

      const prev = this.smoothedHands[hIdx] || { x: rawX, y: rawY };
      const dx = rawX - prev.x;
      const dy = rawY - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Adaptive Alpha: 0.14 saat santai/diam (nol getar) s/d 0.58 saat gerak cepat (nol lag)
      const baseAlpha = dist > 0.08 ? 0.58 : dist > 0.02 ? 0.32 : 0.14;
      const dynamicAlpha = Math.min(0.75, baseAlpha * timeScale);
      const smoothX = dynamicAlpha * rawX + (1 - dynamicAlpha) * prev.x;
      const smoothY = dynamicAlpha * rawY + (1 - dynamicAlpha) * prev.y;

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
        tiltX,
        isPinching: this.isPinching(landmarks),
        isFist: this.isFist(landmarks),
        isLocked: true, // Auto-Lock: Tangan terdeteksi langsung mengunci wayang tanpa syarat pinch
        targetChar: null,
        role: 'dalang',
      };
    });

    this.smoothedHands = hands;
    const updates = [];

    // =========================================================================
    // MODE 1: DALANG TUNGGAL (1 TOKOH RINCI DENGAN TUDING)
    // =========================================================================
    if (this.mode === 'solo') {
      if (characters.length === 0) return [];

      let targetChar = characters.find((c) => c.instanceId === selectedInstanceId);
      if (!targetChar) targetChar = characters[0];
      if (!targetChar) return [];

      const primaryHand = hands[0];
      const secondaryHand = hands[1];

      if (primaryHand) {
        primaryHand.targetChar = targetChar;
        primaryHand.role = 'cempurit';

        // Deteksi kemiringan telapak untuk membalik arah hadap (Flip)
        const lastState = this.lastWayangStates.get(targetChar.instanceId);
        let facing = lastState?.facing || targetChar.facing || 'right';
        if (primaryHand.tiltX > 0.032) {
          facing = 'right';
        } else if (primaryHand.tiltX < -0.032) {
          facing = 'left';
        }

        let pose = targetChar.pose || 'default';
        if (primaryHand.isFist) pose = 'perang';

        const clampedX = Math.max(0.06, Math.min(0.94, primaryHand.x));
        const clampedY = Math.max(0.35, Math.min(0.85, primaryHand.y));

        const dx = lastState ? Math.abs(clampedX - lastState.x) : 1;
        const dy = lastState ? Math.abs(clampedY - lastState.y) : 1;
        const poseChanged = !lastState || lastState.pose !== pose || lastState.facing !== facing;

        if (dx > 0.001 || dy > 0.001 || poseChanged) {
          const newState = {
            x: Number(clampedX.toFixed(4)),
            y: Number(clampedY.toFixed(4)),
            facing,
            pose,
          };
          this.lastWayangStates.set(targetChar.instanceId, newState);
          updates.push({
            instanceId: targetChar.instanceId,
            updates: newState,
          });
        }

        this.statusMessage = `🔒 Wayang ${targetChar.name || 'Wayang'} Terkunci — Miringkan telapak untuk hadap kiri/kanan`;
        this.statusTone = 'grabbing';
      }

      if (secondaryHand && updates.length > 0) {
        secondaryHand.targetChar = targetChar;
        secondaryHand.role = 'tuding';

        if (this.isSembah(primaryHand.rawLandmarks, secondaryHand.rawLandmarks)) {
          updates[0].updates.pose = 'sembah';
          this.statusMessage = `🙏 ${targetChar.name || 'Wayang'} bersikap Sembah Takzim`;
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

      const sortedChars = [...characters].sort((a, b) => a.x - b.x);
      const leftChar = sortedChars[0];
      const rightChar = sortedChars.length > 1 ? sortedChars[1] : null;

      const isClashing = hands.length >= 2 && this.getDistance(hands[0].rawLandmarks[9], hands[1].rawLandmarks[9]) < 0.18;
      const isDualSembah = hands.length >= 2 && this.isSembah(hands[0].rawLandmarks, hands[1].rawLandmarks);

      // Asosiasi tangan cerdas: urutkan tangan dari kiri ke kanan
      if (hands.length === 1) {
        const singleHand = hands[0];
        if (singleHand.x < 0.5 && leftChar) {
          singleHand.targetChar = leftChar;
          singleHand.role = 'tokoh_kiri';
        } else if (rightChar) {
          singleHand.targetChar = rightChar;
          singleHand.role = 'tokoh_kanan';
        } else if (leftChar) {
          singleHand.targetChar = leftChar;
          singleHand.role = 'tokoh_kiri';
        }
      } else if (hands.length >= 2) {
        const sortedHands = [...hands].sort((a, b) => a.x - b.x);
        if (leftChar) {
          sortedHands[0].targetChar = leftChar;
          sortedHands[0].role = 'tokoh_kiri';
        }
        if (rightChar) {
          sortedHands[1].targetChar = rightChar;
          sortedHands[1].role = 'tokoh_kanan';
        }
      }

      hands.forEach((hand) => {
        if (!hand.targetChar) return;
        const char = hand.targetChar;
        const isLeft = hand.role === 'tokoh_kiri';

        // Deteksi kemiringan telapak untuk membalik arah hadap (Flip)
        const lastState = this.lastWayangStates.get(char.instanceId);
        let facing = lastState?.facing || (isLeft ? 'right' : 'left');
        if (hand.tiltX > 0.032) {
          facing = 'right';
        } else if (hand.tiltX < -0.032) {
          facing = 'left';
        }

        let pose = 'default';
        if (isDualSembah) pose = 'sembah';
        else if (isClashing || hand.isFist) pose = 'perang';

        // Anti-clipping margin agar tidak saling menabrak 100%
        let targetX = hand.x;
        if (isLeft && rightChar) {
          targetX = Math.min(rightChar.x - 0.08, targetX);
        } else if (!isLeft && leftChar) {
          targetX = Math.max(leftChar.x + 0.08, targetX);
        }

        const clampedX = Math.max(0.06, Math.min(0.94, targetX));
        const clampedY = Math.max(0.35, Math.min(0.85, hand.y));

        // Deadband filter untuk hemat rendering & jaminan smooth
        const dx = lastState ? Math.abs(clampedX - lastState.x) : 1;
        const dy = lastState ? Math.abs(clampedY - lastState.y) : 1;
        const poseChanged = !lastState || lastState.pose !== pose || lastState.facing !== facing;

        if (dx > 0.001 || dy > 0.001 || poseChanged) {
          const newState = {
            x: Number(clampedX.toFixed(4)),
            y: Number(clampedY.toFixed(4)),
            facing,
            pose,
          };
          this.lastWayangStates.set(char.instanceId, newState);
          updates.push({
            instanceId: char.instanceId,
            updates: newState,
          });
        }
      });

      // Perbarui pesan status HUD
      if (isClashing) {
        this.statusMessage = '⚔️ Laga Sabetan: Kedua tokoh berbenturan senjata!';
        this.statusTone = 'grabbing';
      } else if (isDualSembah) {
        this.statusMessage = '🙏 Sembah Bersama: Kedua ksatria saling menghormat.';
        this.statusTone = 'grabbing';
      } else if (hands.length >= 2) {
        this.statusMessage = '🔒 2 Tokoh Terkunci — Gerakkan telapak & jari, miringkan untuk hadap kiri/kanan';
        this.statusTone = 'grabbing';
      } else if (hands.length === 1) {
        const h = hands[0];
        const targetName = h.targetChar?.name || (h.role === 'tokoh_kiri' ? 'Tokoh Kiri' : 'Tokoh Kanan');
        this.statusMessage = `🔒 ${targetName} Terkunci — Gerakkan telapak bebas`;
        this.statusTone = 'grabbing';
      } else {
        this.statusMessage = 'Mencari telapak tangan dalang di depan kamera...';
        this.statusTone = 'detected';
      }

      return updates;
    }

    return [];
  }
}

export const dalangKinematicsEngine = new DalangKinematicsEngine();
export default dalangKinematicsEngine;

import soundEngine from '../soundscape';

/**
 * Filter Low-Pass Sederhana
 */
class LowPassFilter {
  constructor(alpha = 0) {
    this.s = null;
    this.alpha = alpha;
  }
  filter(value, alpha = this.alpha) {
    this.alpha = alpha;
    if (this.s === null) {
      this.s = value;
    } else {
      this.s = alpha * value + (1 - alpha) * this.s;
    }
    return this.s;
  }
  reset() {
    this.s = null;
  }
}

/**
 * OneEuroFilter (Filter Adaptif Anti-Jitter & Zero-Lag)
 * Mengeliminasi getaran saat tangan diam, dan memberikan respon seketika saat gerakan cepat
 */
class OneEuroFilter {
  constructor(minCutoff = 1.4, beta = 7.5, dCutoff = 1.0) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
    this.x = new LowPassFilter();
    this.dx = new LowPassFilter();
    this.lastTime = null;
  }
  alpha(rate, cutoff) {
    const tau = 1.0 / (2 * Math.PI * cutoff);
    const te = 1.0 / rate;
    return 1.0 / (1.0 + tau / te);
  }
  filter(value, timestamp) {
    if (this.lastTime === null) {
      this.lastTime = timestamp;
      return this.x.filter(value, 1.0);
    }
    const dt = Math.max(0.001, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;
    const rate = 1.0 / dt;

    const prevX = this.x.s !== null ? this.x.s : value;
    const dvalue = (value - prevX) * rate;
    const edvalue = this.dx.filter(dvalue, this.alpha(rate, this.dCutoff));

    const cutoff = this.minCutoff + this.beta * Math.abs(edvalue);
    return this.x.filter(value, this.alpha(rate, cutoff));
  }
  reset() {
    this.x.reset();
    this.dx.reset();
    this.lastTime = null;
  }
}

/**
 * DalangKinematicsEngine
 * Menerjemahkan 21 titik koordinat MediaPipe Hands ke kinematika wayang kulit
 * Dilengkapi OneEuro Filter, Deteksi Kiprahan Kelingking, Z-Depth Blencong, dan Artikulasi Tudhing
 */
class DalangKinematicsEngine {
  constructor() {
    this.mode = 'dual'; // 'solo' | 'dual'
    this.isMirrored = true;

    // Filter OneEuro Adaptif per slot tangan [tangan 0, tangan 1] (Ultra Silky Smooth & Zero-Jitter Motion)
    this.filters = [
      { x: new OneEuroFilter(0.55, 3.0), y: new OneEuroFilter(0.55, 3.0) },
      { x: new OneEuroFilter(0.55, 3.0), y: new OneEuroFilter(0.55, 3.0) },
    ];
    this.smoothedFingers = [{}, {}];

    // State Pelacakan Halus
    this.smoothedHands = [];
    this.lastWayangStates = new Map(); // instanceId -> { x, y, pose, facing, scale, depth, isKiprah }
    this.grabbedMap = new Map(); // handIndex -> instanceId

    // Solah Kiprahan via Jari Kelingking
    this.pinkyHoldStart = [0, 0];
    this.isKiprahActive = [false, false];
    this.kiprahEndTimes = [0, 0];

    // Hentakan Dodogan & Kecepatan Horizontal
    this.lastY = [0, 0];
    this.lastX = [0, 0];
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
    const d8 = this.getDistance(landmarks[8], wrist);
    const d12 = this.getDistance(landmarks[12], wrist);
    const d16 = this.getDistance(landmarks[16], wrist);
    const d20 = this.getDistance(landmarks[20], wrist);
    return d8 < 0.28 && d12 < 0.28 && d16 < 0.28 && d20 < 0.28;
  }

  /**
   * Deteksi gestur jari kelingking terangkat (Pinky Sign -> Kiprahan Joged Wayang)
   */
  isPinkySign(landmarks) {
    if (!landmarks || landmarks.length < 21) return false;
    const wrist = landmarks[0];
    const dPinky = this.getDistance(landmarks[20], wrist);
    const dPinkyBase = this.getDistance(landmarks[17], wrist);
    const dIndex = this.getDistance(landmarks[8], wrist);
    const dMiddle = this.getDistance(landmarks[12], wrist);
    const dRing = this.getDistance(landmarks[16], wrist);

    const pinkyExtended = dPinky > dPinkyBase * 1.32;
    const othersCurled = dIndex < 0.29 && dMiddle < 0.29 && dRing < 0.33;
    return pinkyExtended && othersCurled;
  }

  /**
   * Deteksi kedalaman Z-Depth (jarak telapak tangan ke webcam)
   */
  getHandDepth(landmarks) {
    if (!landmarks || landmarks.length < 21) return 0;
    const palmSize = this.getDistance(landmarks[0], landmarks[9]);
    const normalizedDepth = (palmSize - 0.15) / 0.16;
    return Math.max(0, Math.min(1.0, Number(normalizedDepth.toFixed(2))));
  }

  /**
   * Sudut kemiringan tudhing lengan berdasarkan posisi jempol dan telunjuk
   */
  calculateArmAngles(landmarks) {
    if (!landmarks || landmarks.length < 21) return null;
    const palmCenter = landmarks[9];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];

    const dxThumb = (this.isMirrored ? 1.0 - thumbTip.x : thumbTip.x) - (this.isMirrored ? 1.0 - palmCenter.x : palmCenter.x);
    const dyThumb = thumbTip.y - palmCenter.y;
    const dxIndex = (this.isMirrored ? 1.0 - indexTip.x : indexTip.x) - (this.isMirrored ? 1.0 - palmCenter.x : palmCenter.x);
    const dyIndex = indexTip.y - palmCenter.y;

    const angleThumb = (Math.atan2(dyThumb, dxThumb) * 180) / Math.PI;
    const angleIndex = (Math.atan2(dyIndex, dxIndex) * 180) / Math.PI;

    return {
      frontShoulder: Math.max(-25, Math.min(35, (angleIndex + 45) * 0.35)),
      frontElbow: Math.max(-30, Math.min(45, (angleThumb + 30) * 0.45)),
      backShoulder: Math.max(-35, Math.min(25, -(angleIndex + 45) * 0.3)),
      backElbow: Math.max(-40, Math.min(30, -(angleThumb + 30) * 0.35)),
    };
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
      this.filters.forEach((f) => {
        f.x.reset();
        f.y.reset();
      });
      return [];
    }

    const hands = rawHands.slice(0, 2).map((landmarks, hIdx) => {
      // Pusat telapak (MCP tengah = #9)
      const rawX = this.isMirrored ? 1.0 - landmarks[9].x : landmarks[9].x;
      const rawY = landmarks[9].y;

      // Filter OneEuro adaptif untuk kelembutan ekstra tinggi & zero-jitter
      const filter = this.filters[hIdx] || this.filters[0];
      const smoothX = filter.x.filter(rawX, now);
      const smoothY = filter.y.filter(rawY, now);

      // 1. Hitung orientasi kemiringan telapak tangan (Hand Tilt Angle dalam derajat)
      const wristRawX = this.isMirrored ? 1.0 - landmarks[0].x : landmarks[0].x;
      const wristRawY = landmarks[0].y;
      const midRawX = this.isMirrored ? 1.0 - landmarks[9].x : landmarks[9].x;
      const midRawY = landmarks[9].y;

      const vX = midRawX - wristRawX;
      const vY = midRawY - wristRawY;
      // Derajat kemiringan: positif = miring ke kanan, negatif = miring ke kiri
      const tiltAngleDeg = Math.atan2(vX, -vY) * (180 / Math.PI);

      // Deteksi Kedalaman Z-Depth & Sudut Tudhing Lengan
      const depth = this.getHandDepth(landmarks);
      const armAngles = this.calculateArmAngles(landmarks);

      // Deteksi Gestur Kelingking (Pinky Sign) untuk Tarian Kiprahan
      const isPinky = this.isPinkySign(landmarks);
      if (isPinky) {
        if (!this.pinkyHoldStart[hIdx]) {
          this.pinkyHoldStart[hIdx] = now;
        } else if (now - this.pinkyHoldStart[hIdx] > 280) {
          this.isKiprahActive[hIdx] = true;
          this.kiprahEndTimes[hIdx] = now + 2400; // Kiprahan berlangsung 2.4 detik
          try {
            soundEngine.playKepyak();
          } catch {
            // Audio safe
          }
        }
      } else {
        this.pinkyHoldStart[hIdx] = 0;
      }

      if (this.isKiprahActive[hIdx] && now > this.kiprahEndTimes[hIdx]) {
        this.isKiprahActive[hIdx] = false;
      }

      // 2. Target Posisi Ujung Jempol (Landmark 4) & Telunjuk (Landmark 8) untuk IK Lengan
      const palmSize = Math.max(0.06, Math.hypot(landmarks[9].x - landmarks[0].x, landmarks[9].y - landmarks[0].y));
      const thumbTip = landmarks[4];
      const thumbMcp = landmarks[2];
      const indexTip = landmarks[8];
      const indexMcp = landmarks[5];

      const thbRawX = ((this.isMirrored ? 1.0 - thumbTip.x : thumbTip.x) - (this.isMirrored ? 1.0 - thumbMcp.x : thumbMcp.x)) / palmSize;
      const thbRawY = (thumbTip.y - thumbMcp.y) / palmSize;

      const idxRawX = ((this.isMirrored ? 1.0 - indexTip.x : indexTip.x) - (this.isMirrored ? 1.0 - indexMcp.x : indexMcp.x)) / palmSize;
      const idxRawY = (indexTip.y - indexMcp.y) / palmSize;

      // Filter Low-Pass / EMA untuk kelembutan gerak jempol dan telunjuk (Super Smooth Finger IK)
      if (!this.smoothedFingers) this.smoothedFingers = [{}, {}];
      const prevF = this.smoothedFingers[hIdx] || {};

      const smoothThbX = prevF.thbX !== undefined ? 0.28 * thbRawX + 0.72 * prevF.thbX : thbRawX;
      const smoothThbY = prevF.thbY !== undefined ? 0.28 * thbRawY + 0.72 * prevF.thbY : thbRawY;
      const smoothIdxX = prevF.idxX !== undefined ? 0.28 * idxRawX + 0.72 * prevF.idxX : idxRawX;
      const smoothIdxY = prevF.idxY !== undefined ? 0.28 * idxRawY + 0.72 * prevF.idxY : idxRawY;

      this.smoothedFingers[hIdx] = {
        thbX: smoothThbX,
        thbY: smoothThbY,
        idxX: smoothIdxX,
        idxY: smoothIdxY,
      };

      const fingerTargets = {
        thumb: {
          dx: Number(smoothThbX.toFixed(3)),
          dy: Number(smoothThbY.toFixed(3)),
        },
        index: {
          dx: Number(smoothIdxX.toFixed(3)),
          dy: Number(smoothIdxY.toFixed(3)),
        },
      };

      // Cek kecepatan hentakan ke bawah (Dodogan SFX) dan kecepatan horizontal (Swipe Flip)
      const velY = (rawY - (this.lastY[hIdx] || rawY)) / (dt / 1000);
      const velX = (rawX - (this.lastX[hIdx] || rawX)) / (dt / 1000);
      this.lastY[hIdx] = rawY;
      this.lastX[hIdx] = rawX;

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
        tiltAngleDeg,
        velX,
        depth,
        armAngles,
        fingerTargets,
        isKiprah: this.isKiprahActive[hIdx],
        isPinching: this.isPinching(landmarks),
        isFist: this.isFist(landmarks),
        isLocked: true, // Auto-Lock instan
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

        // Deteksi kemiringan telapak / gesekan cepat untuk membalik arah hadap (Ultra Responsive Flip)
        const lastState = this.lastWayangStates.get(targetChar.instanceId);
        let facing = lastState?.facing || targetChar.facing || 'right';
        if (primaryHand.tiltAngleDeg > 6 || primaryHand.velX > 0.4) {
          facing = 'right';
        } else if (primaryHand.tiltAngleDeg < -6 || primaryHand.velX < -0.4) {
          facing = 'left';
        }

        let pose = targetChar.pose || 'default';
        if (primaryHand.isFist) pose = 'perang';

        const clampedX = Math.max(0.06, Math.min(0.94, primaryHand.x));
        const clampedY = Math.max(0.35, Math.min(0.85, primaryHand.y));

        const dx = lastState ? Math.abs(clampedX - lastState.x) : 1;
        const dy = lastState ? Math.abs(clampedY - lastState.y) : 1;
        const poseChanged = !lastState || lastState.pose !== pose || lastState.facing !== facing;

        if (dx > 0.0003 || dy > 0.0003 || poseChanged) {
          const newState = {
            x: Number(clampedX.toFixed(4)),
            y: Number(clampedY.toFixed(4)),
            facing,
            pose,
            depth: primaryHand.depth,
            armAngles: primaryHand.armAngles,
            fingerTargets: primaryHand.fingerTargets,
            isKiprah: primaryHand.isKiprah,
          };
          this.lastWayangStates.set(targetChar.instanceId, newState);
          updates.push({
            instanceId: targetChar.instanceId,
            updates: newState,
          });
        }

        this.statusMessage = `Wayang ${targetChar.name || 'Wayang'} aktif: miringkan telapak untuk hadap kiri atau kanan`;
        this.statusTone = 'grabbing';
      }

      if (secondaryHand && updates.length > 0) {
        secondaryHand.targetChar = targetChar;
        secondaryHand.role = 'tuding';

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

        // Deteksi kemiringan telapak / gesekan cepat untuk membalik arah hadap (Ultra Responsive Flip)
        const lastState = this.lastWayangStates.get(char.instanceId);
        let facing = lastState?.facing || (isLeft ? 'right' : 'left');
        if (hand.tiltAngleDeg > 6 || hand.velX > 0.4) {
          facing = 'right';
        } else if (hand.tiltAngleDeg < -6 || hand.velX < -0.4) {
          facing = 'left';
        }

        let pose = 'default';
        if (isDualSembah) pose = 'sembah';
        else if (isClashing || hand.isFist) pose = 'perang';

        // Kedua karakter bebas bergerak melintasi seluruh panggung (0.06 - 0.94) untuk pagelaran perang tanding
        const clampedX = Math.max(0.06, Math.min(0.94, hand.x));
        const clampedY = Math.max(0.35, Math.min(0.85, hand.y));

        // Filter halus berkelanjutan (smooth continuous motion)
        const dx = lastState ? Math.abs(clampedX - lastState.x) : 1;
        const dy = lastState ? Math.abs(clampedY - lastState.y) : 1;
        const poseChanged = !lastState || lastState.pose !== pose || lastState.facing !== facing;

        if (dx > 0.0003 || dy > 0.0003 || poseChanged) {
          const newState = {
            x: Number(clampedX.toFixed(4)),
            y: Number(clampedY.toFixed(4)),
            facing,
            pose,
            depth: hand.depth,
            armAngles: hand.armAngles,
            fingerTargets: hand.fingerTargets,
            isKiprah: hand.isKiprah,
          };
          this.lastWayangStates.set(char.instanceId, newState);
          updates.push({
            instanceId: char.instanceId,
            updates: newState,
          });
        }
      });

      // Perbarui pesan status HUD bersih tanpa emoticon
      if (isClashing) {
        this.statusMessage = 'Laga Sabetan: Kedua tokoh berbenturan senjata';
        this.statusTone = 'grabbing';
      } else if (isDualSembah) {
        this.statusMessage = 'Sembah Bersama: Kedua ksatria saling menghormat';
        this.statusTone = 'grabbing';
      } else if (hands.length >= 2) {
        this.statusMessage = 'Dua tokoh terhubung: gerakkan jempol dan telunjuk untuk memainkan tudhing';
        this.statusTone = 'grabbing';
      } else if (hands.length === 1) {
        const h = hands[0];
        const targetName = h.targetChar?.name || (h.role === 'tokoh_kiri' ? 'Tokoh Kiri' : 'Tokoh Kanan');
        this.statusMessage = `${targetName} terhubung: gerakkan tangan bebas`;
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

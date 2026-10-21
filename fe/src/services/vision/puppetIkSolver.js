/**
 * 2-Bone Analytical Inverse Kinematics & DOM Direct Manipulation Engine
 * Menghitung sudut sendi pundak-siku dan menggerakkan tudhing lengan wayang kulit
 */

// Posisi pundak dalam sistem koordinat lokal wayang 240 x 360
export const SHOULDER_L = { x: 92, y: 122 };
export const SHOULDER_R = { x: 148, y: 122 };

export const DEFAULT_FRONT_TARGET = { x: 70, y: 220 };
export const DEFAULT_BACK_TARGET = { x: 170, y: 220 };

/**
 * Normalisasi selisih sudut modular ke rentang [-180°, +180°]
 * Menghilangkan branch cut jump dari atan2 (mencegah patahan snap -271° ke +89°)
 */
export function normalizeAngleDiff(diffDeg) {
  return ((diffDeg + 540) % 360) - 180;
}

/**
 * 2-Bone Analytical Inverse Kinematics Solver (Full 360° Continuous Freedom)
 * Lu = 60px (Upper Arm), Lf = 52px (Forearm) sesuai proporsi multi-part rigging wayang kulit
 */
export function solve2BoneIK(shoulder, target, Lu = 60, Lf = 52, bend = -1) {
  const dx = target.x - shoulder.x;
  const dy = target.y - shoulder.y;
  const maxReach = Lu + Lf - 2; // 110px
  const dist = Math.max(15, Math.min(maxReach, Math.hypot(dx, dy)));
  const baseAngle = Math.atan2(dy, dx);

  const cosAngle = Math.max(-1, Math.min(1, (Lu * Lu + dist * dist - Lf * Lf) / (2 * Lu * dist)));
  const upperAngle = baseAngle + bend * Math.acos(cosAngle);

  const elbowX = shoulder.x + Lu * Math.cos(upperAngle);
  const elbowY = shoulder.y + Lu * Math.sin(upperAngle);

  const foreAngle = Math.atan2(target.y - elbowY, target.x - elbowX);

  const shoulderDeg = (upperAngle * 180) / Math.PI;
  const foreDeg = (foreAngle * 180) / Math.PI;
  const elbowDeg = normalizeAngleDiff(foreDeg - shoulderDeg);

  return {
    shoulderAngle: shoulderDeg,
    foreAngle: foreDeg,
    elbowAngle: elbowDeg,
    elbow: { x: elbowX, y: elbowY },
    wrist: target,
  };
}

/**
 * Mapping koordinat gerak jempol & telunjuk dalang ke target tangan wayang (Full 360° Dynamic Flexibility)
 * Tangan wayang terpaku langsung pada 2 jari dalang sehingga dapat berputar bebas 360° ke segala arah
 */
export function mapFingerToIkTarget(tip, defaultPos, isThumb = false) {
  if (!tip) return defaultPos;

  // Jangkauan tangan fleksibel penuh: 96px radius dari bahu (jangkauan max 110px)
  const armReach = 96;
  const shoulder = isThumb ? SHOULDER_L : SHOULDER_R;

  // Simpangan ujung jari relatif terhadap pusat telapak tangan (bisa berputar 360° bebas)
  const targetX = shoulder.x + tip.dx * armReach;
  const targetY = shoulder.y + tip.dy * armReach;

  return {
    x: Math.max(10, Math.min(230, targetX)),
    y: Math.max(15, Math.min(320, targetY)),
  };
}

/**
 * Menghitung target tangan wayang langsung dari koordinat piksel nyata kamera (Snap to Finger Landmark)
 * Memetakan posisi piksel ujung jari (Landmark 4 untuk jempol, Landmark 8 untuk telunjuk) ke ruang koordinat lokal wayang
 */
export function mapScreenLandmarkToPuppet(fingerScreen, palmScreen, scale = 1.0, facing = 'right') {
  if (!fingerScreen || !palmScreen) return null;

  const facingSign = facing === 'left' ? -1 : 1;
  // Selisih piksel nyata kamera dari pusat telapak (Landmark 9) ke ujung jari
  const deltaX = fingerScreen.x - palmScreen.x;
  const deltaY = fingerScreen.y - palmScreen.y;

  // Titik jangkar telapak di lokal wayang (pinggul / pangkal cempurit di x:120, y:190)
  const ANCHOR_X = 120;
  const ANCHOR_Y = 190;

  const targetLocalX = ANCHOR_X + (deltaX / scale) * facingSign;
  const targetLocalY = ANCHOR_Y + (deltaY / scale);

  return {
    x: Math.max(5, Math.min(235, targetLocalX)),
    y: Math.max(10, Math.min(340, targetLocalY)),
  };
}

/**
 * Manipulasi DOM Langsung 60-120 FPS tanpa React re-render
 * Mendukung fingerTargets relatif maupun directTargets (snap piksel kamera)
 */
export function updatePuppetArmsDOM(containerEl, fingerTargets, directTargets = null) {
  if (!containerEl) return;

  let frontTarget;
  let backTarget;

  if (directTargets?.front && directTargets?.back) {
    frontTarget = directTargets.front;
    backTarget = directTargets.back;
  } else if (fingerTargets) {
    frontTarget = mapFingerToIkTarget(fingerTargets.thumb, DEFAULT_FRONT_TARGET, true);
    backTarget = mapFingerToIkTarget(fingerTargets.index, DEFAULT_BACK_TARGET, false);
  } else {
    return;
  }

  const ikFront = solve2BoneIK(SHOULDER_L, frontTarget, 60, 52, -1);
  const ikBack = solve2BoneIK(SHOULDER_R, backTarget, 60, 52, 1);

  const frontShld = containerEl.querySelector('.real-puppet-arm-front-shld');
  const frontElbw = containerEl.querySelector('.real-puppet-arm-front-elbw');
  const backShld = containerEl.querySelector('.real-puppet-arm-back-shld');
  const backElbw = containerEl.querySelector('.real-puppet-arm-back-elbw');

  if (frontShld) frontShld.style.transform = `rotate(${ikFront.shoulderAngle.toFixed(1)}deg)`;
  if (frontElbw) frontElbw.style.transform = `rotate(${ikFront.elbowAngle.toFixed(1)}deg)`;
  if (backShld) backShld.style.transform = `rotate(${ikBack.shoulderAngle.toFixed(1)}deg)`;
  if (backElbw) backElbw.style.transform = `rotate(${ikBack.elbowAngle.toFixed(1)}deg)`;

  const frontLine = containerEl.querySelector('.real-puppet-tudhing-front-line');
  const frontJoint = containerEl.querySelector('.real-puppet-tudhing-front-joint');
  const backLine = containerEl.querySelector('.real-puppet-tudhing-back-line');
  const backJoint = containerEl.querySelector('.real-puppet-tudhing-back-joint');

  if (frontLine) {
    frontLine.setAttribute('x1', frontTarget.x);
    frontLine.setAttribute('y1', frontTarget.y);
    frontLine.setAttribute('x2', frontTarget.x + 8);
  }
  if (frontJoint) {
    frontJoint.setAttribute('cx', frontTarget.x);
    frontJoint.setAttribute('cy', frontTarget.y);
  }
  if (backLine) {
    backLine.setAttribute('x1', backTarget.x);
    backLine.setAttribute('y1', backTarget.y);
    backLine.setAttribute('x2', backTarget.x + 8);
  }
  if (backJoint) {
    backJoint.setAttribute('cx', backTarget.x);
    backJoint.setAttribute('cy', backTarget.y);
  }
}

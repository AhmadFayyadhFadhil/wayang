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
 * 2-Bone Analytical Inverse Kinematics Solver
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

  return {
    shoulderAngle: (upperAngle * 180) / Math.PI,
    foreAngle: (foreAngle * 180) / Math.PI,
    elbow: { x: elbowX, y: elbowY },
    wrist: target,
  };
}

/**
 * Mapping koordinat gerak jempol & telunjuk dalang ke target tangan wayang (Full Dynamic Flexibility)
 * Tangan wayang terpaku langsung pada 2 jari dalang sehingga dapat bergerak fleksibel ke segala arah
 */
export function mapFingerToIkTarget(tip, defaultPos, isThumb = false) {
  if (!tip) return defaultPos;

  // Jangkauan tangan fleksibel penuh: 92px radius dari bahu
  const armReach = 92;
  const shoulder = isThumb ? SHOULDER_L : SHOULDER_R;

  // Offset alami jempol & telunjuk
  const neutralOffsetX = isThumb ? -0.2 : 0.2;
  const neutralOffsetY = isThumb ? 0.45 : 0.6;

  const targetX = shoulder.x + (tip.dx + neutralOffsetX) * armReach;
  const targetY = shoulder.y + (tip.dy + neutralOffsetY) * armReach;

  return {
    x: Math.max(15, Math.min(225, targetX)),
    y: Math.max(25, Math.min(275, targetY)),
  };
}

/**
 * Manipulasi DOM Langsung 60-120 FPS tanpa React re-render
 */
export function updatePuppetArmsDOM(containerEl, fingerTargets) {
  if (!containerEl || !fingerTargets) return;

  const frontTarget = mapFingerToIkTarget(fingerTargets.thumb, DEFAULT_FRONT_TARGET, true);
  const backTarget = mapFingerToIkTarget(fingerTargets.index, DEFAULT_BACK_TARGET, false);

  const ikFront = solve2BoneIK(SHOULDER_L, frontTarget, 60, 52, -1);
  const ikBack = solve2BoneIK(SHOULDER_R, backTarget, 60, 52, 1);

  const frontShld = containerEl.querySelector('.real-puppet-arm-front-shld');
  const frontElbw = containerEl.querySelector('.real-puppet-arm-front-elbw');
  const backShld = containerEl.querySelector('.real-puppet-arm-back-shld');
  const backElbw = containerEl.querySelector('.real-puppet-arm-back-elbw');

  if (frontShld) frontShld.style.transform = `rotate(${ikFront.shoulderAngle.toFixed(1)}deg)`;
  if (frontElbw) frontElbw.style.transform = `rotate(${(ikFront.foreAngle - ikFront.shoulderAngle).toFixed(1)}deg)`;
  if (backShld) backShld.style.transform = `rotate(${ikBack.shoulderAngle.toFixed(1)}deg)`;
  if (backElbw) backElbw.style.transform = `rotate(${(ikBack.foreAngle - ikBack.shoulderAngle).toFixed(1)}deg)`;

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

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
 */
export function solve2BoneIK(shoulder, target, Lu = 75, Lf = 70, bend = -1) {
  const dx = target.x - shoulder.x;
  const dy = target.y - shoulder.y;
  const dist = Math.max(20, Math.min(Lu + Lf - 2, Math.hypot(dx, dy)));
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
 * Mapping koordinat gerak jempol/telunjuk dalang ke target jangkauan tangan wayang
 */
export function mapFingerToIkTarget(tip, defaultPos, isThumb = false) {
  if (!tip) return defaultPos;
  // Offset alami ujung jari diukur dari resting pose dalang
  const restX = isThumb ? -0.4 : 0.0;
  const restY = isThumb ? -0.4 : -0.8;
  const deltaX = (tip.dx - restX) * 110;
  const deltaY = (tip.dy - restY) * 110;

  return {
    x: Math.max(25, Math.min(215, defaultPos.x + deltaX)),
    y: Math.max(65, Math.min(275, defaultPos.y + deltaY)),
  };
}

/**
 * Manipulasi DOM Langsung 60-120 FPS tanpa React re-render
 */
export function updatePuppetArmsDOM(containerEl, fingerTargets) {
  if (!containerEl || !fingerTargets) return;

  const frontTarget = mapFingerToIkTarget(fingerTargets.thumb, DEFAULT_FRONT_TARGET, true);
  const backTarget = mapFingerToIkTarget(fingerTargets.index, DEFAULT_BACK_TARGET, false);

  const ikFront = solve2BoneIK(SHOULDER_L, frontTarget, 75, 70, -1);
  const ikBack = solve2BoneIK(SHOULDER_R, backTarget, 75, 70, 1);

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

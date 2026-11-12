/**
 * Master Registry Aset Wayang Kulit Otentik
 * Menyediakan mapping gambar cutout resolusi tinggi (RGBA) tatah-sungging untuk ke-7 tokoh utama.
 */

import gatotkacaCutout from '../../assets/characters/gatotkaca_otentik_cutout.png';
import arjunaCutout from '../../assets/characters/arjuna_otentik_cutout.png';
import bimaCutout from '../../assets/characters/bima_otentik_cutout.png';
import karnaCutout from '../../assets/characters/karna_otentik_cutout.png';
import rahwanaCutout from '../../assets/characters/rahwana_otentik_cutout.png';
import semarCutout from '../../assets/characters/semar_otentik_cutout.png';
import shintaCutout from '../../assets/characters/shinta_otentik_cutout.png';

export const CHARACTER_CUTOUTS = {
  gatotkaca: gatotkacaCutout,
  arjuna: arjunaCutout,
  bima: bimaCutout,
  karna: karnaCutout,
  rahwana: rahwanaCutout,
  semar: semarCutout,
  shinta: shintaCutout,
};

export const CHARACTER_PUBLIC_CUTOUTS = {
  gatotkaca: '/images/characters/gatotkaca_otentik_cutout.png',
  arjuna: '/images/characters/arjuna_otentik_cutout.png',
  bima: '/images/characters/bima_otentik_cutout.png',
  karna: '/images/characters/karna_otentik_cutout.png',
  rahwana: '/images/characters/rahwana_otentik_cutout.png',
  semar: '/images/characters/semar_otentik_cutout.png',
  shinta: '/images/characters/shinta_otentik_cutout.png',
};

/**
 * Mendapatkan aset gambar wayang kulit otentik berdasarkan slug
 */
export function getCharacterCutout(slug) {
  if (!slug) return CHARACTER_CUTOUTS.gatotkaca;
  const normalized = String(slug).toLowerCase().trim();
  return CHARACTER_CUTOUTS[normalized] || CHARACTER_CUTOUTS.gatotkaca;
}

/**
 * Konfigurasi gestur & solah dalang interaktif untuk setiap pose tokoh
 */
export const POSE_DYNAMICS = {
  default: {
    transform: 'rotate(0deg) translate3d(0, 0, 0) scale(1)',
    filterExtra: 'drop-shadow(0 14px 22px rgba(10, 6, 3, 0.78))',
    label: 'Default (Siaga)',
    badge: 'JUMENENG SIAGA',
    description: 'Sikap jumeneng tegak penuh kewibawaan kesatria luhur.',
    auraColor: 'rgba(212, 175, 55, 0.28)',
  },
  sembah: {
    transform: 'rotate(-9deg) translate3d(-10px, 16px, 0) scale(0.96)',
    filterExtra: 'drop-shadow(0 8px 20px rgba(234, 179, 8, 0.55)) drop-shadow(0 0 18px rgba(254, 240, 138, 0.4))',
    label: 'Sembah (Ngabekti)',
    badge: 'SEMBAH PANGABEKTI',
    description: 'Ngaturaken sembah pangabekti takzim kanthi andhap asor marang Gusti lan sesepuh.',
    auraColor: 'rgba(234, 179, 8, 0.65)',
  },
  perang: {
    transform: 'rotate(15deg) translate3d(14px, -14px, 0) scale(1.1)',
    filterExtra: 'drop-shadow(0 20px 34px rgba(220, 38, 38, 0.75)) drop-shadow(0 0 24px rgba(239, 68, 68, 0.55))',
    label: 'Perang (Kiprah)',
    badge: 'KIPRAH TANDING',
    description: 'Solah kiprah tanggap jurit gagah perkasa ing madya paprangan.',
    auraColor: 'rgba(220, 38, 38, 0.65)',
  },
  terbang: {
    transform: 'rotate(-32deg) translate3d(24px, -38px, 0) scale(1.08)',
    filterExtra: 'drop-shadow(0 26px 40px rgba(232, 187, 92, 0.75)) drop-shadow(0 0 30px rgba(245, 158, 11, 0.6))',
    label: 'Terbang (Nglayang)',
    badge: 'NGLAYANG ING GEGANA',
    description: 'Melesat ing mega tanpa suwiwi kanti Aji Brajamusti & Kotang Antakusuma.',
    auraColor: 'rgba(245, 158, 11, 0.75)',
  },
  memanah: {
    transform: 'rotate(-11deg) translate3d(-12px, -8px, 0) scale(1.06)',
    filterExtra: 'drop-shadow(0 18px 28px rgba(212, 175, 55, 0.65)) drop-shadow(0 0 22px rgba(250, 204, 21, 0.55))',
    label: 'Memanah (Menthang)',
    badge: 'MENTHANG GANDEWA',
    description: 'Menthang gandewa jemparing Pasopati kanthi cipta wening paningal batin.',
    auraColor: 'rgba(234, 179, 8, 0.65)',
  },
  tinju: {
    transform: 'rotate(14deg) translate3d(14px, -14px, 0) scale(1.14)',
    filterExtra: 'drop-shadow(0 22px 36px rgba(197, 155, 39, 0.75)) drop-shadow(0 0 24px rgba(212, 175, 55, 0.6))',
    label: 'Tinju (Pancanaka)',
    badge: 'KUKU PANCANAKA',
    description: 'Hanyeblakaken Kuku Pancanaka ingkang ampuh kagem numpes angkara murka.',
    auraColor: 'rgba(197, 155, 39, 0.65)',
  },
  nasihat: {
    transform: 'rotate(8deg) translate3d(8px, 8px, 0) scale(1.04)',
    filterExtra: 'drop-shadow(0 12px 22px rgba(212, 175, 55, 0.55)) drop-shadow(0 0 16px rgba(254, 240, 138, 0.45))',
    label: 'Nasihat (Wejangan)',
    badge: 'WEJANGAN LUHUR',
    description: 'Paring pitedah kawicaksanan sejati minangka pamong agung Batara Ismaya.',
    auraColor: 'rgba(212, 175, 55, 0.55)',
  },
  tertawa: {
    transform: 'rotate(-15deg) translate3d(-12px, -16px, 0) scale(1.15)',
    filterExtra: 'drop-shadow(0 22px 38px rgba(153, 27, 27, 0.75)) drop-shadow(0 0 26px rgba(239, 68, 68, 0.6))',
    label: 'Tertawa (Angkara)',
    badge: 'NGGUYU ANGKARA',
    description: 'Gelak lakak-lakak ngumbar kanepsen lan kasudiran Raja Dasamuka.',
    auraColor: 'rgba(153, 27, 27, 0.65)',
  },
  sedih: {
    transform: 'rotate(-8deg) translate3d(-8px, 14px, 0) scale(0.95)',
    filterExtra: 'drop-shadow(0 10px 18px rgba(40, 28, 16, 0.6))',
    label: 'Sedih (Prihatin)',
    badge: 'PRIHATIN TAWAKAL',
    description: 'Nglenggana ing panandhang kanthi sabar tawakal ing Taman Asoka.',
    auraColor: 'rgba(140, 100, 60, 0.45)',
  },
  luruh: {
    transform: 'rotate(-6deg) translate3d(-6px, 10px, 0) scale(0.97)',
    filterExtra: 'drop-shadow(0 12px 22px rgba(224, 169, 109, 0.55))',
    label: 'Luruh (Jatmika)',
    badge: 'LURUH JATMIKA',
    description: 'Sikap putri jatmika luruh tumungkul kebak ing trapsila subasita.',
    auraColor: 'rgba(224, 169, 109, 0.55)',
  },
};

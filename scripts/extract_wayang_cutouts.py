"""
Script Ekstraksi & Standarisasi Karakter Wayang Otentik
Menghasilkan PNG Transparan (RGBA) resolusi tinggi untuk ke-7 tokoh wayang:
- Gatotkaca
- Arjuna
- Bima
- Karna
- Rahwana
- Semar
- Shinta
"""

import os
from PIL import Image
import rembg

ASSETS_DIR = r"d:\wayang\fe\src\assets"
OUTPUT_DIR = r"d:\wayang\fe\public\images\characters"

CHARACTERS = [
    ("gatotkaca", "wayang_card_gatotkaca.jpg", "gatotkaca_otentik_cutout.png"),
    ("arjuna", "wayang_card_arjuna.jpg", "arjuna_otentik_cutout.png"),
    ("bima", "wayang_card_bima.jpg", "bima_otentik_cutout.png"),
    ("karna", "wayang_card_karna.jpg", "karna_otentik_cutout.png"),
    ("rahwana", "wayang_card_rahwana.jpg", "rahwana_otentik_cutout.png"),
    ("semar", "wayang_card_semar.jpg", "semar_otentik_cutout.png"),
    ("shinta", "wayang_card_shinta.jpg", "shinta_otentik_cutout.png"),
]

os.makedirs(OUTPUT_DIR, exist_ok=True)
print("Initializing u2netp session...")
session = rembg.new_session("u2netp")

for slug, src_file, out_file in CHARACTERS:
    src_path = os.path.join(ASSETS_DIR, src_file)
    out_path = os.path.join(OUTPUT_DIR, out_file)
    
    if not os.path.exists(src_path):
        print(f"Skipping {slug}, source not found: {src_path}")
        continue
        
    print(f"Processing {slug} from {src_file}...")
    img = Image.open(src_path)
    
    # Ekstraksi background menggunakan model u2netp
    out = rembg.remove(img, session=session)
    
    # Auto-crop transparent boundaries to center character
    bbox = out.getbbox()
    if bbox:
        # Crop tight, then add slight padding (3%)
        cropped = out.crop(bbox)
        w, h = cropped.size
        pad_x = max(10, int(w * 0.03))
        pad_y = max(10, int(h * 0.03))
        padded = Image.new("RGBA", (w + pad_x * 2, h + pad_y * 2), (0, 0, 0, 0))
        padded.paste(cropped, (pad_x, pad_y))
        out = padded
        
    out.save(out_path, format="PNG", optimize=True)
    print(f"  -> Saved {out_file} ({out.size[0]}x{out.size[1]})")

print("\nAll 7 characters extracted and standardized successfully!")

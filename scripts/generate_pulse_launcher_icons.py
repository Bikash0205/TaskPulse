import cv2
import numpy as np
from PIL import Image, ImageFilter
import os

# Load clean isolated pulse
pulse_im = Image.open('scratch/pulse_tight.png').convert('RGBA')
pw, ph = pulse_im.size

def create_launcher_icon(size, is_adaptive=True, is_round=False):
    # Base canvas
    canvas = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    
    # Scale pulse mark to fit comfortably within Android safe zone
    # For adaptive icon: safe zone is central 66% circle. Pulse aspect ratio is ~2.48
    if is_adaptive:
        target_w = int(size * 0.62)
    else:
        target_w = int(size * 0.72)
        
    target_h = int(ph * (target_w / pw))
    
    resized_pulse = pulse_im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Center pulse mark on canvas
    x = (size - target_w) // 2
    y = (size - target_h) // 2
    
    # Paste with alpha
    canvas.paste(resized_pulse, (x, y), resized_pulse)
    
    if is_round:
        # Create circular mask
        mask = Image.new('L', (size, size), 0)
        from PIL import ImageDraw
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size - 1, size - 1), fill=255)
        canvas.putalpha(mask)
        
    return canvas

# Ensure output directories exist
os.makedirs('scratch/launcher_icons', exist_ok=True)

# 1. Master Expo assets (1024x1024)
master_icon = create_launcher_icon(1024, is_adaptive=False)
master_icon.save('mobile/assets/icon.png')
master_adaptive = create_launcher_icon(1024, is_adaptive=True)
master_adaptive.save('mobile/assets/adaptive-icon.png')
print('Generated master icon.png and adaptive-icon.png (1024x1024)')

# 2. Adaptive Foregrounds (res/5c.webp, etc.)
adaptive_sizes = {
    'res/5c.webp': 432,
    'res/Zt.png': 432,
    'res/iE.webp': 324,
    'res/9Q.webp': 216,
    'res/13.webp': 162,
    'res/Nt.webp': 108,
}

for rel_path, sz in adaptive_sizes.items():
    icon = create_launcher_icon(sz, is_adaptive=True)
    out_path = os.path.join('scratch/launcher_icons', rel_path.replace('/', '_'))
    if rel_path.endswith('.webp'):
        icon.save(out_path, format='WEBP', quality=95, method=6)
    else:
        icon.save(out_path, format='PNG', optimize=True)
    print(f'Saved {rel_path} ({sz}x{sz})')

# 3. Standard Legacy Icons (res/-6.webp, etc.)
legacy_sizes = {
    'res/-6.webp': 192,
    'res/Sn.webp': 144,
    'res/qs.webp': 96,
    'res/MO.webp': 72,
    'res/d2.webp': 48,
}

for rel_path, sz in legacy_sizes.items():
    icon = create_launcher_icon(sz, is_adaptive=False)
    out_path = os.path.join('scratch/launcher_icons', rel_path.replace('/', '_'))
    icon.save(out_path, format='WEBP', quality=95, method=6)
    print(f'Saved {rel_path} ({sz}x{sz})')

# 4. Round Legacy Icons (res/sK.webp, etc.)
round_sizes = {
    'res/sK.webp': 192,
    'res/j_.webp': 144,
    'res/u5.webp': 96,
    'res/fq.webp': 72,
    'res/yw.webp': 48,
}

for rel_path, sz in round_sizes.items():
    icon = create_launcher_icon(sz, is_adaptive=False, is_round=True)
    out_path = os.path.join('scratch/launcher_icons', rel_path.replace('/', '_'))
    icon.save(out_path, format='WEBP', quality=95, method=6)
    print(f'Saved {rel_path} ({sz}x{sz})')

print('All pulse-only launcher icons generated successfully!')

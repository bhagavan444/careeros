import os
import glob

target_dir = r'c:\Users\rocky\Desktop\RAYA\Academic projects\carrer-path-web-\frontend\src\components\predict'
files = glob.glob(os.path.join(target_dir, '*.jsx'))

replacements = {
    '"#9ca3af"': '"#86868b"',
    "'#9ca3af'": "'#86868b'",
    '"#d1d5db"': '"#86868b"',
    "'#d1d5db'": "'#86868b'",
    '"#374151"': '"#1d1d1f"',
    "'#374151'": "'#1d1d1f'",
    '"rgba(255, 255, 255, 0.05)"': '"rgba(0, 0, 0, 0.02)"',
    '"rgba(255, 255, 255, 0.08)"': '"rgba(0, 0, 0, 0.03)"',
    '"rgba(255,255,255,0.1)"': '"rgba(0,0,0,0.06)"',
    '"rgba(255,255,255,0.15)"': '"rgba(0,0,0,0.08)"',
}

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Successfully patched colors in all predict components!")

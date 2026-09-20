import base64

with open('mobile/assets/taskpulse_boot_animated.webp', 'rb') as f:
    webp_b64 = base64.b64encode(f.read()).decode('utf-8')

with open('mobile/assets/taskpulse_boot_animated.gif', 'rb') as f:
    gif_b64 = base64.b64encode(f.read()).decode('utf-8')

with open('mobile/assets/bootAnimationBase64.ts', 'w', encoding='utf-8') as f:
    f.write('export const TASKPULSE_BOOT_WEBP_URI = "data:image/webp;base64,' + webp_b64 + '";\n')
    f.write('export const TASKPULSE_BOOT_GIF_URI = "data:image/gif;base64,' + gif_b64 + '";\n')

print("Success: Generated bootAnimationBase64.ts")

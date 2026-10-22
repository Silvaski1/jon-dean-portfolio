import cv2, json, os

FOLDER = "images/banner"
OUT = os.path.join(FOLDER, "cells")
BASE = "images/banner/cells/"
COLS, ROWS = 5, 6

full = cv2.imread(os.path.join(FOLDER, "banner-full.jpg"))
H, W = full.shape[:2]
os.makedirs(OUT, exist_ok=True)

tiles, n = [], 1
for r in range(ROWS):
    for c in range(COLS):
        x0, x1 = round(c * W / COLS), round((c + 1) * W / COLS)
        y0, y1 = round(r * H / ROWS), round((r + 1) * H / ROWS)
        name = f"cell-{n:02d}.jpg"
        cv2.imwrite(os.path.join(OUT, name), full[y0:y1, x0:x1],
                    [cv2.IMWRITE_JPEG_QUALITY, 85])
        tiles.append({"src": name,
                      "x": round(x0 / W * 100, 3), "y": round(y0 / H * 100, 3),
                      "w": round((x1 - x0) / W * 100, 3), "h": round((y1 - y0) / H * 100, 3)})
        n += 1

cfg = {"base": BASE, "aspect": f"{W} / {H}", "tiles": tiles}
with open(os.path.join(FOLDER, "banner-config.js"), "w") as f:
    f.write("window.BANNER_CONFIG = " + json.dumps(cfg, indent=1) + ";\n")
print(f"wrote {len(tiles)} cells and banner-config.js")

import os
import sys
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
from PIL import Image

SOURCE_DIR = Path("public/frames")
OUTPUT_DIR = Path("public/frames-webp")
QUALITY = 82

def convert_single_frame(args):
    src_file, dst_file = args
    if dst_file.exists() and dst_file.stat().st_size > 0:
        return src_file.name, True  # Already converted
    
    dst_file.parent.mkdir(parents=True, exist_ok=True)
    try:
        with Image.open(src_file) as img:
            if img.mode in ("RGBA", "LA"):
                img = img.convert("RGB")
            elif img.mode != "RGB":
                img = img.convert("RGB")
            img.save(dst_file, "WEBP", quality=QUALITY, method=4)
        return src_file.name, True
    except Exception as e:
        print(f"Error converting {src_file}: {e}", file=sys.stderr)
        return src_file.name, False

def main():
    if not SOURCE_DIR.exists():
        print(f"Source directory {SOURCE_DIR} does not exist!")
        sys.exit(1)

    tasks = []
    # 1. Check direct PNG files in SOURCE_DIR
    for frame_file in sorted(SOURCE_DIR.glob("*.png")):
        dst_file = OUTPUT_DIR / f"{frame_file.stem}.webp"
        tasks.append((frame_file, dst_file))

    # 2. Check subdirectory PNG files (if any exist)
    for seq_dir in sorted(SOURCE_DIR.iterdir()):
        if seq_dir.is_dir():
            dst_seq_dir = OUTPUT_DIR / seq_dir.name
            for frame_file in sorted(seq_dir.glob("*.png")):
                dst_file = dst_seq_dir / f"{frame_file.stem}.webp"
                tasks.append((frame_file, dst_file))

    print(f"Found {len(tasks)} frames to convert from PNG to WebP (Quality: {QUALITY})...")
    
    cpu_count = os.cpu_count() or 4
    workers = min(cpu_count, 12)
    print(f"Converting using {workers} parallel worker processes...")

    converted_count = 0
    with ProcessPoolExecutor(max_workers=workers) as executor:
        for idx, (filename, success) in enumerate(executor.map(convert_single_frame, tasks), 1):
            if success:
                converted_count += 1
            if idx % 100 == 0 or idx == len(tasks):
                print(f"Progress: {idx}/{len(tasks)} frames processed ({converted_count} converted)...")

    print(f"Done! Converted {converted_count} frames to {OUTPUT_DIR}.")

if __name__ == "__main__":
    main()

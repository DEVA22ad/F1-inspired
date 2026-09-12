import os
import sys
import time
import shutil
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import cv2

DEFAULT_OUTPUT_DIR = Path("public/frames")

def find_default_video():
    candidates = [
        Path("F1 Inspire_Color.mp4"),
        Path("F1 Inspire.mp4"),
    ]
    for c in candidates:
        if c.exists():
            return c
    
    # Fallback to any .mp4 in current directory
    mp4_files = list(Path(".").glob("*.mp4"))
    if mp4_files:
        return mp4_files[0]
    
    return None

def write_frame_task(args):
    filepath_str, frame, png_params = args
    cv2.imwrite(filepath_str, frame, png_params)
    return True

def extract_frames(video_path=None, output_dir=DEFAULT_OUTPUT_DIR):
    if video_path is None:
        video_path = find_default_video()

    if not video_path or not Path(video_path).exists():
        print(f"Error: Video file not found: {video_path}", file=sys.stderr)
        sys.exit(1)

    video_path = Path(video_path)
    output_dir = Path(output_dir)

    # 1. Open video
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        print(f"Error: Could not open video file: {video_path}", file=sys.stderr)
        sys.exit(1)

    # 2. Extract metadata
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration_sec = total_frames / fps if fps > 0 else 0

    minutes = int(duration_sec // 60)
    seconds = duration_sec % 60
    duration_formatted = f"{minutes:02d}:{seconds:05.2f} ({duration_sec:.2f}s)"

    # 3. Print video specifications
    print("=" * 60)
    print("F1 CINEMATIC FRAME EXTRACTION")
    print("=" * 60)
    print(f"Video:        {video_path.name}")
    print(f"Resolution:   {width}x{height}")
    print(f"FPS:          {fps:.2f}")
    print(f"Duration:     {duration_formatted}")
    print(f"Total frames: {total_frames}")
    print(f"Output folder: {output_dir.resolve()}")
    print("=" * 60)

    # 4. Clean & recreate output directory
    if output_dir.exists():
        print(f"Cleaning output directory '{output_dir}' for fresh extraction...")
        shutil.rmtree(output_dir)
    
    output_dir.mkdir(parents=True, exist_ok=True)

    # 5. Extract frames sequentially using parallel write pool
    workers = min(os.cpu_count() or 8, 12)
    print(f"Extracting {total_frames} lossless PNG frames using {workers} parallel writer threads...")
    start_time = time.time()
    
    frame_count = 0
    png_params = [cv2.IMWRITE_PNG_COMPRESSION, 1]  # 100% Lossless PNG with high-speed compression
    
    futures = []
    with ThreadPoolExecutor(max_workers=workers) as executor:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            filename = f"{frame_count:04d}.png"
            filepath = output_dir / filename
            
            # Submit frame write to thread pool
            future = executor.submit(write_frame_task, (str(filepath), frame, png_params))
            futures.append(future)
            
            if frame_count % 100 == 0 or frame_count == total_frames:
                elapsed = time.time() - start_time
                fps_extract = frame_count / elapsed if elapsed > 0 else 0
                percent = (frame_count / total_frames) * 100 if total_frames > 0 else 0
                print(f"Read progress: {frame_count}/{total_frames} frames ({percent:.1f}%) - {fps_extract:.1f} fps")

        # Wait for all writes to finish
        print("Waiting for all PNG frame writes to finish...")
        for idx, f in enumerate(as_completed(futures), 1):
            if idx % 200 == 0 or idx == len(futures):
                print(f"Written: {idx}/{len(futures)} frames to disk...")

    cap.release()
    elapsed_total = time.time() - start_time

    # 6. Verification
    extracted_files = list(output_dir.glob("*.png"))
    extracted_count = len(extracted_files)

    print("-" * 60)
    print("EXTRACTION SUMMARY")
    print("-" * 60)
    print(f"Video:                 {video_path.name}")
    print(f"Video Frame Count:     {total_frames}")
    print(f"Extracted PNG Count:   {extracted_count}")
    print(f"Resolution Preserved:  {width}x{height}")
    print(f"Time Taken:            {elapsed_total:.2f}s (avg {(extracted_count/elapsed_total if elapsed_total>0 else 0):.1f} fps)")

    if extracted_count == total_frames:
        print("Verification: SUCCESS - Extracted frame count EXACTLY matches video frame count!")
    else:
        print(f"Verification: WARNING - Count mismatch! Video frames: {total_frames}, Extracted: {extracted_count}")

    print("=" * 60)
    return {
        "video": video_path.name,
        "width": width,
        "height": height,
        "fps": fps,
        "duration": duration_sec,
        "total_frames": total_frames,
        "extracted_count": extracted_count
    }

if __name__ == "__main__":
    target_video = sys.argv[1] if len(sys.argv) > 1 else None
    extract_frames(target_video)

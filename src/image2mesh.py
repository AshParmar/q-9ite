"""
Stub for converting generated images to 3D meshes using TripoSR (or similar).
"""

import os
import subprocess
import sys


def image_to_mesh(image_path: str, output_obj: str, output_tex: str) -> str:
    """
    Convert image to 3D mesh using TripoSR.
    """
    output_dir = os.path.dirname(output_obj)
    os.makedirs(output_dir, exist_ok=True)
    
    # Run TripoSR: python run.py image.png --output-dir output/
    cmd = [
        sys.executable, "q9_triposr/run.py", 
        image_path, 
        "--output-dir", output_dir,
        "--mc-resolution", "512",      # Higher resolution for smoother mesh
        "--foreground-ratio", "0.9"    # Ensure object fills the volume
    ]
    if output_tex:
        cmd.append("--bake-texture")
        cmd.extend(["--texture-resolution", "4096"]) # High res textures
    
    subprocess.run(cmd, check=True)
    
    # TripoSR creates a subdirectory '0' for the first image
    actual_output = os.path.join(output_dir, "0", "mesh.obj")
    return actual_output

if __name__ == "__main__":
    import glob
    import argparse
    
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", type=str, help="")
    args = parser.parse_args()

    image_path = args.image
    
    if not image_path:
        # Find the most recent image in outputs/images
        list_of_files = glob.glob('outputs/images/*.png') 
        if not list_of_files:
            print("No images found in outputs/images/")
            sys.exit(1)
        image_path = max(list_of_files, key=os.path.getctime)
        print(f"No image provided. Using latest: {image_path}")

    # Create a unique output folder based on the image filename
    base_name = os.path.splitext(os.path.basename(image_path))[0]
    # If the filename has a timestamp, use it. Otherwise, just use the name.
    
    output_dir = os.path.join("outputs", "raw_meshes", base_name)
    output_obj = os.path.join(output_dir, "mesh.obj")
    
    print(f"Processing {image_path} -> {output_dir}")
    image_to_mesh(image_path, output_obj, True)



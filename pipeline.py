import argparse
import os
import sys
import datetime
import torch
from src.generate_image import generate_image
from src.generate_image_turbo import generate_image_turbo
from src.generate_image_pixart import generate_image_pixart
from src.image2mesh import image_to_mesh
from src.postprocess import clean_mesh, convert_to_glb

def main():
    parser = argparse.ArgumentParser(description="Ultimate 3D Asset Generation Pipeline")
    
    # Image Generation Args
    parser.add_argument("--prompt", type=str, required=True, help="Text prompt for generation")
    parser.add_argument("--model", type=str, default="sd15", choices=["sd15", "turbo", "pixart"], help="Image generation model")
    parser.add_argument("--steps", type=int, default=25, help="Inference steps (default: 25)")
    parser.add_argument("--guidance", type=float, default=7.5, help="Guidance scale (default: 7.5)")
    parser.add_argument("--seed", type=int, default=None, help="Random seed")
    parser.add_argument("--width", type=int, default=None, help="Image width (default depends on model)")
    parser.add_argument("--height", type=int, default=None, help="Image height (default depends on model)")
    
    # Pipeline Control
    parser.add_argument("--skip-image", action="store_true", help="Skip image generation (requires --input-image)")
    parser.add_argument("--input-image", type=str, help="Path to input image if skipping generation")
    parser.add_argument("--skip-mesh", action="store_true", help="Skip mesh generation")
    parser.add_argument("--skip-postprocess", action="store_true", help="Skip post-processing")
    
    # Output
    parser.add_argument("--output-dir", type=str, default="outputs", help="Base output directory")
    
    args = parser.parse_args()
    
    # default resolution based on model
    if args.width is None:
        args.width = 1024 if args.model == "pixart" else 512
    if args.height is None:
        args.height = 1024 if args.model == "pixart" else 512

    # Setup paths
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    run_id = f"{timestamp}_{args.model}"
    
    # 1. Image Generation
    image_path = args.input_image
    
    if not args.skip_image:
        print(f"--- Starting Image Generation ({args.model}) ---")
        print(f"Prompt: {args.prompt}")
        print(f"Resolution: {args.width}x{args.height}")
        
        images_dir = os.path.join(args.output_dir, "images")
        image_filename = f"img_{run_id}.png"
        image_path = os.path.join(images_dir, image_filename)
        
        if args.model == "sd15":
            generate_image(args.prompt, args.seed, args.steps, args.guidance, args.width, args.height, image_path)
        elif args.model == "turbo":
            generate_image_turbo(args.prompt, args.seed, args.steps, args.guidance, args.width, args.height, image_path)
        elif args.model == "pixart":
            generate_image_pixart(args.prompt, args.seed, args.steps, args.guidance, args.width, args.height, image_path)
            
        print(f"Image saved to: {image_path}")
    else:
        if not image_path:
            print("Error: --skip-image requires --input-image")
            sys.exit(1)
        print(f"Using existing image: {image_path}")

    if args.skip_mesh:
        print("Skipping mesh generation.")
        return

    # 2. Mesh Generation
    print(f"--- Starting Mesh Generation ---")
    # Create a unique folder for this mesh
    mesh_id = os.path.splitext(os.path.basename(image_path))[0]
    raw_mesh_dir = os.path.join(args.output_dir, "raw_meshes", mesh_id)
    # We pass a dummy output path to image_to_mesh, it uses the dir
    output_obj_placeholder = os.path.join(raw_mesh_dir, "mesh.obj")
    
    try:
        raw_mesh_path = image_to_mesh(image_path, output_obj_placeholder, True)
        print(f"Raw mesh generated at: {raw_mesh_path}")
    except Exception as e:
        print(f"Error during mesh generation: {e}")
        sys.exit(1)

    if args.skip_postprocess:
        print("Skipping post-processing.")
        return

    # 3. Post-processing
    print(f"--- Starting Post-processing ---")
    processed_dir = os.path.join(args.output_dir, "processed_meshes", mesh_id)
    os.makedirs(processed_dir, exist_ok=True)
    
    cleaned_path = os.path.join(processed_dir, "mesh_cleaned.obj")
    glb_path = os.path.join(processed_dir, "mesh.glb")
    
    try:
        clean_mesh(raw_mesh_path, cleaned_path)
        convert_to_glb(cleaned_path, glb_path)
        print(f"Pipeline Complete!")
        print(f"Final GLB: {glb_path}")
    except Exception as e:
        print(f"Error during post-processing: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

import argparse
import os
import sys
import datetime
import torch

# Add src to path just in case, though not strictly needed if running from root
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from src.generate_image import generate_image
from src.generate_image_turbo import generate_image_turbo
from src.generate_image_pixart import generate_image_pixart

def main():
    parser = argparse.ArgumentParser(description="Ultimate Image Generation Pipeline")
    
    # Image Generation Args
    parser.add_argument("--prompt", type=str, required=True, help="Text prompt for generation")
    parser.add_argument("--model", type=str, default="sd15", choices=["sd15", "turbo", "pixart"], help="Image generation model")
    parser.add_argument("--steps", type=int, default=25, help="Inference steps (default: 25)")
    parser.add_argument("--guidance", type=float, default=7.5, help="Guidance scale (default: 7.5)")
    parser.add_argument("--seed", type=int, default=None, help="Random seed")
    parser.add_argument("--width", type=int, default=None, help="Image width (default depends on model)")
    parser.add_argument("--height", type=int, default=None, help="Image height (default depends on model)")
    
    # Output
    parser.add_argument("--output-dir", type=str, default="outputs/images", help="Output directory for images")
    
    args = parser.parse_args()
    
    # Set default resolution based on model if not provided
    if args.width is None:
        args.width = 1024 if args.model == "sd15" else 512
    if args.height is None:
        args.height = 1024 if args.model == "sd15" else 512

    # Setup paths
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    run_id = f"{timestamp}_{args.model}"
    
    print(f"--- Starting Image Generation ({args.model}) ---")
    print(f"Prompt: {args.prompt}")
    print(f"Resolution: {args.width}x{args.height}")
    
    image_filename = f"img_{run_id}.png"
    image_path = os.path.join(args.output_dir, image_filename)
    
    if args.model == "sd15":
        generate_image(args.prompt, args.seed, args.steps, args.guidance, args.width, args.height, image_path)
    elif args.model == "turbo":
        generate_image_turbo(args.prompt, args.seed, args.steps, args.guidance, args.width, args.height, image_path)
    elif args.model == "pixart":
        generate_image_pixart(args.prompt, args.seed, args.steps, args.guidance, args.width, args.height, image_path)
        
    print(f"Image saved to: {image_path}")

if __name__ == "__main__":
    main()

import torch
from diffusers import ShapEImg2ImgPipeline
from diffusers.utils import export_to_gif
from PIL import Image
import os
import trimesh
import sys

def image_to_shape_mesh(image_path, output_dir):
    # Load the image
    print(f"Loading image from {image_path}...")
    image = Image.open(image_path).convert("RGB")

    # Setup pipeline
    ckpt_id = "openai/shap-e-img2img"
    print(f"Loading pipeline {ckpt_id}...")
    pipe = ShapEImg2ImgPipeline.from_pretrained(ckpt_id).to("cuda")

    # Settings
    generator = torch.Generator(device="cuda").manual_seed(0)
    batch_size = 2
    guidance_scale = 3.0
    num_inference_steps = 64
    # size = 256 # Removed as it causes TypeError in current diffusers version

    # 1. Generate GIF (Views)
    print("Generating 3D views (GIF)...")
    images = pipe(
        image,
        num_images_per_prompt=batch_size,
        generator=generator,
        guidance_scale=guidance_scale,
        num_inference_steps=num_inference_steps,
        output_type="pil"
    ).images

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)

    for i, frames in enumerate(images):
        gif_path = os.path.join(output_dir, f"output_{i}.gif")
        export_to_gif(frames, gif_path)
        print(f"Saved GIF to {gif_path}")

    # 2. Generate Mesh
    print("Generating 3D mesh...")
    mesh_results = pipe(
        image,
        num_images_per_prompt=batch_size,
        generator=generator,
        guidance_scale=guidance_scale,
        num_inference_steps=num_inference_steps,
        output_type="mesh"
    ).images
    
    for i, mesh_result in enumerate(mesh_results):
        # Save OBJ using trimesh
        obj_path = os.path.join(output_dir, f"mesh_{i}.obj")
        
        # mesh_result is a shap_e.rendering.mesh.Mesh object
        # It has .verts and .faces attributes
        # They are tensors on GPU, so we need to move them to CPU
        verts = mesh_result.verts.cpu().numpy()
        faces = mesh_result.faces.cpu().numpy()
        
        tm_mesh = trimesh.Trimesh(vertices=verts, faces=faces)
        tm_mesh.export(obj_path)
        print(f"Saved OBJ to {obj_path}")

if __name__ == "__main__":
    import argparse
    import glob
    
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", type=str, help="Path to input image")
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
    output_dir = os.path.join("outputs", "shape_meshes", base_name)
    
    image_to_shape_mesh(image_path, output_dir)

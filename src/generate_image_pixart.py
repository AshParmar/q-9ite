"""
Prompt-to-image generation using PixArt-alpha/PixArt-XL-2-1024-MS.
High resolution 1024px generation.
"""

import torch
from diffusers import DiffusionPipeline
import os
from typing import Optional

def generate_image_pixart(prompt: str, seed: Optional[int], steps: int, guidance: float, width: int, height: int, output_path: str) -> str:
    """
    Generate an image using PixArt-XL.
    """
    model_id = "PixArt-alpha/PixArt-XL-2-1024-MS"
    print(f"Loading model: {model_id}...")
    
    # Using float16 for broader GPU compatibility on Windows
    # Enable CPU offloading to save VRAM/RAM
    pipe = DiffusionPipeline.from_pretrained(
        model_id, 
        torch_dtype=torch.float16,
        use_safetensors=True
    )
    pipe.enable_model_cpu_offload()
    # pipe.to("cuda") # Removed explicit move to cuda, handled by offload

    generator = None
    if seed is not None:
        generator = torch.Generator(device="cuda").manual_seed(seed)

    print(f"Generating image with prompt: '{prompt}'")
    image = pipe(prompt, num_inference_steps=steps, guidance_scale=guidance, width=width, height=height, generator=generator).images[0]
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    image.save(output_path)
    return output_path

if __name__ == "__main__":
    import datetime
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"outputs/images/img_{timestamp}_pixart.png"
    
    prompt = """A stylized low-poly fantasy treasure chest, made of worn oak wood and reinforced with shiny gold metal bands, slightly open with a faint magical glow coming from inside.  
Isolated object, no background, no shadows, no ground, centered, evenly lit, orthographic feel, high contrast edges, clean contours, perfect for 3D reconstruction.  
Game art style, crisp details, simple textures, consistent proportions, no environment, no reflections, no particles, no blur."""

    print(f"Generating image to {output_filename}...")
    generate_image_pixart(prompt, 42, output_filename)
    print(f"Done. Image saved to {output_filename}")

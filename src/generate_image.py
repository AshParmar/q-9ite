"""
Stub for prompt-to-image generation using a CPU-friendly Stable Diffusion model.
"""

from typing import Optional
from diffusers import StableDiffusionPipeline
import torch

def generate_image(prompt: str, seed: Optional[int], steps: int, guidance: float, width: int , height: int, output_path: str) -> str:
    """
    Placeholder for text-to-image generation.
    """
    model_id = "sd-legacy/stable-diffusion-v1-5"
    pipe = StableDiffusionPipeline.from_pretrained(model_id, dtype=torch.float16)
    pipe = pipe.to("cuda")

    generator = None
    if seed is not None:
        generator = torch.Generator(device="cuda").manual_seed(seed)

    image = pipe(prompt, num_inference_steps=steps, guidance_scale=guidance, width=width, height=height, generator=generator).images[0]
    
    import os
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    image.save(output_path)
    return output_path

if __name__ == "__main__":
    import datetime
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"outputs/images/img_{timestamp}.png"
    
    prompt = "a single stylized wooden crate, centered in frame, full object visible, plain grey background, clean simple design, closed crate, 3d game asset render, soft even lighting, no variations, only one crate, product showcase style"
    seed=42
    width=576
    height=576
    print(f"Generating image to {output_filename}...")
    generate_image(prompt, seed, 26, 7.5, width, height, output_filename)
    print(f"Done. Image saved to {output_filename}")
    output_filename = f"outputs/images/img_{timestamp}_({seed}).png"
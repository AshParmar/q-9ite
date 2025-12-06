"""
Prompt-to-image generation using Stability AI's SD-Turbo model.
Fast generation with 1 step.
"""

from typing import Optional
# Use StableDiffusionPipeline directly instead of AutoPipeline to avoid import errors with older transformers
from diffusers import StableDiffusionPipeline
import torch
import os

def generate_image_turbo(prompt: str, seed: Optional[int], steps: int, guidance: float, width: int, height: int, output_path: str) -> str:
    """
    Generate an image using SD-Turbo.
    """
    model_id = "stabilityai/sd-turbo"
    print(f"Loading model: {model_id}...")
    
    # SD-Turbo is compatible with the standard StableDiffusionPipeline
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id, 
        torch_dtype=torch.float16, 
        variant="fp16"
    )
    pipe.to("cuda")

    generator = None
    if seed is not None:
        generator = torch.Generator(device="cuda").manual_seed(seed)

    print(f"Generating image with prompt: '{prompt}'")
    # SD-Turbo works best with 1 step and 0.0 guidance, but we allow overrides
    image = pipe(
        prompt=prompt, 
        num_inference_steps=steps, 
        guidance_scale=guidance, 
        width=width,
        height=height,
        generator=generator
    ).images[0]
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    image.save(output_path)
    return output_path

if __name__ == "__main__":
    import datetime
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"outputs/images/img_{timestamp}_turbo.png"
    
    # Example prompt
    prompt = "fantasy dragon slayer sword, full body view, centered, large blade, runic engravings, high detail, dark metal, game asset style, white background, sharp silhouette"
    
    print(f"Generating image to {output_filename}...")
    # SD-Turbo defaults: 1 step, 0.0 guidance
    generate_image_turbo(prompt, seed=42, steps=50, guidance=7.5, output_path=output_filename)
    print(f"Done. Image saved to {output_filename}")

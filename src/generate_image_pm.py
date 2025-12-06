"""
Prompt-to-image generation using Stable Diffusion v1.5 (Legacy).
Slower but offers more control and detail.
"""

from typing import Optional
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler, AutoencoderKL
import torch
import os

def generate_image(
    prompt: str, 
    seed: Optional[int], 
    steps: int, 
    guidance: float, 
    width: int, 
    height: int, 
    output_path: str,
    use_custom_vae: bool = True,
    use_karras: bool = True
) -> str:
    """
    Generate an image using SD v1.5 with advanced settings.
    """
    model_id = "sd-legacy/stable-diffusion-v1-5"
    vae_id = "stabilityai/sd-vae-ft-mse"
    
    print(f"Loading model: {model_id}...")
    
    # Load VAE if requested
    vae = None
    if use_custom_vae:
        print(f"Loading VAE: {vae_id}...")
        # Load VAE in float32 to avoid "Input type (float) and bias type (struct c10::Half)" mismatch
        # This also often improves decoding quality
        vae = AutoencoderKL.from_pretrained(vae_id, torch_dtype=torch.float32)

    # Load Pipeline
    if vae:
        # We load the main pipeline in float16, but inject the float32 VAE
        pipe = StableDiffusionPipeline.from_pretrained(model_id, vae=vae, dtype=torch.float16)
    else:
        pipe = StableDiffusionPipeline.from_pretrained(model_id, dtype=torch.float16)
        
    # Configure Scheduler (DPM++ 2M Karras)
    if use_karras:
        print("Using DPM++ 2M Karras scheduler...")
        pipe.scheduler = DPMSolverMultistepScheduler.from_config(
            pipe.scheduler.config, 
            use_karras_sigmas=True,
            algorithm_type="dpmsolver++"
        )

    pipe = pipe.to("cuda")
    
    # Ensure VAE remains in float32 even after pipe.to("cuda")
    # pipe.to() might cast submodules if they were registered with a specific dtype, 
    # but usually it just moves device. 
    # To be safe, we explicitly cast VAE to float32 again.
    if pipe.vae is not None:
        pipe.vae = pipe.vae.to(dtype=torch.float32)

    generator = None
    if seed is not None:
        generator = torch.Generator(device="cuda").manual_seed(seed)

    print(f"Generating image with prompt: '{prompt}'")
    print(f"Settings: Steps={steps}, CFG={guidance}, Size={width}x{height}, Seed={seed}")
    
    image = pipe(
        prompt, 
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
    
    # --- Configuration ---
    PROMPT = "fantasy dragon slayer sword, full body view, centered, large blade, runic engravings, high detail, dark metal, game asset style, white background, sharp silhouette"
    SEED = 42
    STEPS = 25
    GUIDANCE = 7.5
    WIDTH = 768
    HEIGHT = 768
    # ---------------------

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"outputs/images/img_{timestamp}_legacy.png"
    
    print(f"Generating image to {output_filename}...")
    generate_image(
        prompt=PROMPT, 
        seed=SEED, 
        steps=STEPS, 
        guidance=GUIDANCE, 
        width=WIDTH, 
        height=HEIGHT, 
        output_path=output_filename,
        use_custom_vae=True, # Corresponds to "vae-ft-mse-840000"
        use_karras=True      # Corresponds to "DPM++ 2M Karras"
    )
    print(f"Done. Image saved to {output_filename}")
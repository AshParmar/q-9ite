import os
import sys
import argparse
import itertools
import subprocess
import time
import shutil
import re

# Add src to path (one level up from experiments folder)
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "src"))

def run_pipeline(cmd, output_dir, new_filename_base):
    """
    Runs the pipeline command, captures output, and moves/renames the generated files.
    """
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        
        # Find image path
        image_path = None
        glb_path = None
        
        for line in result.stdout.splitlines():
            if "Image saved to:" in line:
                image_path = line.split("Image saved to:")[1].strip()
            if "Final GLB:" in line:
                glb_path = line.split("Final GLB:")[1].strip()
                
        if image_path and os.path.exists(image_path):
            new_image_path = os.path.join(output_dir, f"{new_filename_base}.png")
            shutil.move(image_path, new_image_path)
            print(f"  Saved Image: {new_image_path}")
            
        if glb_path and os.path.exists(glb_path):
            new_glb_path = os.path.join(output_dir, f"{new_filename_base}.glb")
            shutil.move(glb_path, new_glb_path)
            print(f"  Saved GLB: {new_glb_path}")
            
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running pipeline: {e}")
        print(e.stdout)
        print(e.stderr)
        return False

def run_experiment():
    parser = argparse.ArgumentParser(description="Run Image Generation Experiments")
    # Default output dir is current directory (experiments folder)
    parser.add_argument("--output-dir", type=str, default=".", help="Directory to save experiment results")
    args = parser.parse_args()

    # Path to pipeline.py (one level up)
    pipeline_script = os.path.join(os.path.dirname(__file__), "..", "pipeline.py")

    # Define experiment parameters
    prompts = [
        "a cute stylized robot mascot, round body, thick arms and legs, glossy metal surface, full body centered, studio lighting, 3d animation render style, smooth edges, clear silhouette",
        "low poly fantasy sword, hand painted texture, white background"
    ]
    
    # Variations
    steps_list = [15, 30, 50]
    guidance_list = [5.0, 7.5, 12.0]
    seed_list = [42, 123, 999] # Used for Seed Variation and as repetition seeds
    resolution_list = [(512, 512), (768, 768)]
    mesh_resolutions = [128, 256] # Reduced for speed
    
    # Defaults
    base_model = "sd15"
    base_guidance = 7.5
    base_steps = 30
    base_width = 512
    base_height = 512
    default_seed = 42
    
    print(f"Starting experiments. Results will be saved to {os.path.abspath(args.output_dir)}")
    
    # 1. Steps Variation
    exp_dir = os.path.join(args.output_dir, "steps_variation")
    os.makedirs(exp_dir, exist_ok=True)
    print(f"\n--- Experiment 1: Steps Variation (SD1.5) -> {exp_dir} ---")
    prompt = prompts[0]
    
    for steps in steps_list:
        # Create subfolder for this step count
        step_folder = os.path.join(exp_dir, f"steps_{steps}")
        os.makedirs(step_folder, exist_ok=True)
        
        for seed in seed_list:
            print(f"Running: Steps={steps}, Seed={seed}")
            cmd = [
                sys.executable, pipeline_script,
                "--prompt", prompt,
                "--model", base_model,
                "--steps", str(steps),
                "--guidance", str(base_guidance),
                "--seed", str(seed),
                "--output-dir", os.path.join(step_folder, "temp"), # Temp dir to avoid clutter
                "--skip-mesh",
                "--width", str(base_width), "--height", str(base_height)
            ]
            # Save as seed_X.png inside steps_Y folder
            run_pipeline(cmd, step_folder, f"seed_{seed}")

    # 2. Guidance Variation
    exp_dir = os.path.join(args.output_dir, "guidance_variation")
    os.makedirs(exp_dir, exist_ok=True)
    print(f"\n--- Experiment 2: Guidance Variation (SD1.5) -> {exp_dir} ---")
    
    for guidance in guidance_list:
        guidance_folder = os.path.join(exp_dir, f"guidance_{guidance}")
        os.makedirs(guidance_folder, exist_ok=True)
        
        for seed in seed_list:
            print(f"Running: Guidance={guidance}, Seed={seed}")
            cmd = [
                sys.executable, pipeline_script,
                "--prompt", prompt,
                "--model", base_model,
                "--steps", str(base_steps),
                "--guidance", str(guidance),
                "--seed", str(seed),
                "--output-dir", os.path.join(guidance_folder, "temp"),
                "--skip-mesh",
                "--width", str(base_width), "--height", str(base_height)
            ]
            run_pipeline(cmd, guidance_folder, f"seed_{seed}")

    # 3. Seed Variation
    exp_dir = os.path.join(args.output_dir, "seed_variation")
    os.makedirs(exp_dir, exist_ok=True)
    print(f"\n--- Experiment 3: Seed Variation (SD1.5) -> {exp_dir} ---")
    
    for seed in seed_list:
        seed_folder = os.path.join(exp_dir, f"seed_{seed}")
        os.makedirs(seed_folder, exist_ok=True)
        
        print(f"Running: Seed={seed}")
        cmd = [
            sys.executable, pipeline_script,
            "--prompt", prompt,
            "--model", base_model,
            "--steps", str(base_steps),
            "--guidance", str(base_guidance),
            "--seed", str(seed),
            "--output-dir", os.path.join(seed_folder, "temp"),
            "--skip-mesh",
            "--width", str(base_width), "--height", str(base_height)
        ]
        # Filename can be generic since folder has the info
        run_pipeline(cmd, seed_folder, "output")

    # 4. Prompt Variation
    exp_dir = os.path.join(args.output_dir, "prompt_variation")
    os.makedirs(exp_dir, exist_ok=True)
    print(f"\n--- Experiment 4: Prompt Variation (SD1.5) -> {exp_dir} ---")
    
    for i, p in enumerate(prompts):
        prompt_folder = os.path.join(exp_dir, f"prompt_{i+1}")
        os.makedirs(prompt_folder, exist_ok=True)
        
        for seed in seed_list:
            print(f"Running: Prompt {i+1}, Seed={seed}")
            cmd = [
                sys.executable, pipeline_script,
                "--prompt", p,
                "--model", base_model,
                "--steps", str(base_steps),
                "--guidance", str(base_guidance),
                "--seed", str(seed),
                "--output-dir", os.path.join(prompt_folder, "temp"),
                "--skip-mesh",
                "--width", str(base_width), "--height", str(base_height)
            ]
            run_pipeline(cmd, prompt_folder, f"seed_{seed}")

    # 5. Resolution Variation
    exp_dir = os.path.join(args.output_dir, "resolution_variation")
    os.makedirs(exp_dir, exist_ok=True)
    print(f"\n--- Experiment 5: Resolution Variation (SD1.5) -> {exp_dir} ---")
    
    for w, h in resolution_list:
        res_folder = os.path.join(exp_dir, f"res_{w}x{h}")
        os.makedirs(res_folder, exist_ok=True)
        
        for seed in seed_list:
            print(f"Running: Resolution={w}x{h}, Seed={seed}")
            cmd = [
                sys.executable, pipeline_script,
                "--prompt", prompt,
                "--model", base_model,
                "--steps", str(base_steps),
                "--guidance", str(base_guidance),
                "--seed", str(seed),
                "--output-dir", os.path.join(res_folder, "temp"),
                "--skip-mesh",
                "--width", str(w), "--height", str(h)
            ]
            run_pipeline(cmd, res_folder, f"seed_{seed}")

    # 6. Mesh Quality Variation
    exp_dir = os.path.join(args.output_dir, "mesh_quality")
    os.makedirs(exp_dir, exist_ok=True)
    print(f"\n--- Experiment 6: Mesh Quality Variation -> {exp_dir} ---")
    
    for res in mesh_resolutions:
        mesh_folder = os.path.join(exp_dir, f"mesh_res_{res}")
        os.makedirs(mesh_folder, exist_ok=True)
        
        for seed in seed_list:
            print(f"Running: Mesh Resolution={res}, Seed={seed}")
            cmd = [
                sys.executable, pipeline_script,
                "--prompt", prompt,
                "--model", base_model,
                "--steps", str(base_steps),
                "--guidance", str(base_guidance),
                "--seed", str(seed),
                "--output-dir", os.path.join(mesh_folder, "temp"),
                "--width", "512", "--height", "512",
                "--mesh-resolution", str(res)
            ]
            run_pipeline(cmd, mesh_folder, f"seed_{seed}")

    # Cleanup temp dirs
    for root, dirs, files in os.walk(args.output_dir, topdown=False):
        for name in dirs:
            if name == "temp":
                try:
                    shutil.rmtree(os.path.join(root, name))
                except:
                    pass

    print("\n--- Experiments Complete ---")

if __name__ == "__main__":
    run_experiment()

# Q-9ite: AI-Powered 3D Asset Pipeline

A modular pipeline for generating 3D game assets from text prompts using Stable Diffusion and TripoSR. This project demonstrates how machine learning can streamline the asset creation process for game developers.

## Features
*   **Text-to-Image:** Generates concept art using Stable Diffusion 1.5.
*   **Image-to-3D:** Converts generated images into 3D meshes (`.glb`, `.obj`) using TripoSR.
*   **Post-Processing:** Automatically cleans meshes and converts formats.
*   **Experimentation Suite:** Automated script to test variations in steps, guidance, and seeds.

## Models Used
*   **[Stable Diffusion 1.5](https://huggingface.co/runwayml/stable-diffusion-v1-5):**  
    A lightweight, efficient text-to-image model perfect for generating consistent game assets on consumer hardware.
*   **[TripoSR](https://github.com/VAST-AI-Research/TripoSR):**  
    A state-of-the-art feed-forward 3D reconstruction model that generates high-quality meshes from a single image in seconds.
*   **Additional experiments:** Briefly tried **Stable Diffusion Turbo** for faster drafts and **Shape-E** for direct text-to-3D, but the primary pipeline remains SD 1.5 → TripoSR due to quality and stability.

## Results
We tested the pipeline with a higher mesh resolution setting (Marching Cubes Resolution: 512).

*   **View the 3D Model:** [seed_42.glb](outputs/processed_meshes/seed_42/mesh.glb)
*   **Source Image:** [seed_42.png](outputs/images/seed_42.png)
*   **Interactive Preview (GitHub Pages):** https://ashparmar.github.io/q-9ite

<img src="experiments/blender_ss\Screenshot 2025-12-06 193810.png" width="800" alt="Mesh Analysis in Blender">

## 🛠️ Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AshParmar/q-9ite.git
    cd q-9ite
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *Note: Ensure you have a GPU with CUDA support for optimal performance.*

## 📖 Usage

### 1. Generate a Single Asset
Use the main pipeline script to generate an asset from scratch.

```bash
python pipeline.py --prompt "isometric treasure chest, glowing gold, stylized" --steps 30 --guidance 7.5
```

**Options:**
*   `--model`: Choose `sd15`, `turbo`, or `pixart`.
*   `--skip-mesh`: Generate image only.
*   `--input-image`: Generate 3D mesh from an existing image.

### 2. Run Experiments
To validate parameters and find the best settings, run the experiment suite:

```bash
python experiments/run_experiments.py
```
This will generate a matrix of outputs in the `experiments/` folder, organized by variation type (Steps, Guidance, Seed, etc.).

## 📂 Project Structure
```
q-9ite/
├── experiments/           # Experiment scripts and results
│   ├── blender_ss/        # Screenshots from Blender analysis
│   ├── guidance_variation/
│   ├── mesh_quality/
│   ├── run_experiments.py # Automation script
│   └── ...
├── outputs/               # Default output directory for pipeline.py
│   ├── images/
│   ├── processed_meshes/  # Cleaned GLB/OBJ files
│   └── raw_meshes/        # Raw TripoSR outputs
├── q9_triposr/            # Vendored TripoSR library
├── src/                   # Source code
│   ├── api.py
│   ├── generate_image.py
│   ├── image2mesh.py
│   ├── postprocess.py
│   └── validation.py
├── experiments.md         # Detailed experiment report
├── pipeline.py            # Main CLI entry point
├── README.md
└── requirements.txt
```

## 📊 Experiments & Observations
See [experiments.md](experiments.md) for a detailed breakdown of how different parameters (Steps, Guidance, Seed) affect the quality of the generated game assets.

## ✅ Validation & Metrics
We implemented an automated validation script (`src/validation.py`) to ensure asset quality. Here are the metrics for this result:

```json
{
  "filename": "mesh.glb",
  "vertices": 274,978,
  "faces": 335,776,
  "is_watertight": false,
  "has_texture": true,
  "bounds": [
    [-0.45, -0.35, -0.22],
    [0.49, 0.37, 0.25]
  ]
}
```

**Analysis:**
The generated mesh is not watertight and has a high Euler number, which is expected for single-view reconstruction models such as TripoSR. However, the mesh exhibits consistent winding, valid UV textures, and relatively high geometric detail (≈335k faces). Overall, the mesh is of good quality for visualization and demonstrates effective 3D structure recovery given only a single input image.

## 📝 Internship Task Report

### 1. What model/tool you used and why?
*   **Stable Diffusion 1.5:** Chosen for its reliability and speed. It provides a solid baseline for generating game assets like isometric items and props without the heavy hardware requirements of SDXL.
*   **TripoSR:** Selected for its state-of-the-art speed in single-image-to-3D reconstruction. It generates meshes with textures in seconds, making it ideal for a rapid prototyping pipeline.

### 2. Which input parameters you tested?
We conducted controlled experiments varying:
*   **Inference Steps:** 15, 30, 50
*   **Guidance Scale:** 5.0, 7.5, 12.0
*   **Seeds:** 42, 123, 999
*   **Mesh Resolution:** 128, 256, 512

### 3. What differences you observed?
*   **High Stylization:** **Guidance 12.0, Seed 999, Steps 30**. This combination produced very distinct, high-contrast assets. The higher guidance forced the model to adhere strictly to the "game asset" style, resulting in cleaner silhouettes.
*   **Balanced Detail:** **Guidance 7.5, Seed 123, Steps 50**. Increasing steps to 50 smoothed out noise, while keeping guidance at the default 7.5 allowed for more creative interpretation of textures.
*   **Mesh Quality:** Increasing TripoSR resolution from 128 to 256 significantly reduced "blobbiness" in the geometry. Pushing to 512 yielded the best results but with significantly higher processing time.

### 4. What you’d do next with more time/resources?
*   **Larger Models:** Utilizing larger, state-of-the-art models (like SDXL or proprietary APIs) would significantly increase accuracy and visual fidelity. We currently prioritized low-power, efficient, open-source local models to demonstrate a resource-constrained pipeline.
*   **Multi-View Generation:** Use models like MVDream or Zero123 to generate 4 orthogonal views before meshing to ensure the back of the object is accurate.
*   **PBR Texture Maps:** Generate Normal, Roughness, and Metallic maps to make the assets truly game-ready for engines like Unity/Unreal.
*   **Automated LODs:** Integrate a mesh decimation step to automatically generate Low, Medium, and High poly versions of the asset.

## 📝 License
Apache License

## 🙏 Credits & Acknowledgements
*   **[TripoSR](https://github.com/VAST-AI-Research/TripoSR):** Developed by VAST AI Research and Stability AI. We use their model and repo, modified it for our needs & for fast feed-forward 3D reconstruction.
*   **[Stable Diffusion v1.5](https://huggingface.co/runwayml/stable-diffusion-v1-5):** Developed by RunwayML and Stability AI. Used as the backbone for text-to-image generation.




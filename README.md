# Q-9ite 

This project demonstrates a complete workflow for generating 3D game assets directly from text prompts. It bridges the gap between 2D generative AI and 3D game development by chaining state-of-the-art diffusion models with mesh reconstruction tools.

Designed as a modular system, it allows developers to experiment with different generation parameters, models, and post-processing techniques to optimize assets for runtime performance.

### ** Key Features**

*   **Multi-Model Image Generation:**
    *   **Legacy (SD v1.5):** Best for detailed, controlled prompt adherence.(Main)
    *   **Turbo (SD-Turbo):** Ultra-fast generation (1-step) for rapid prototyping.(Experimental)
    *   **PixArt-XL:** High-resolution (1024px) generation for superior texture detail.(Experimental)
*   **Automated 3D Reconstruction:**
    *   **TripoSR Integration:** Converts generated images into high-fidelity meshes with baked textures.
    *   **Shap-E Support:** Alternative generative 3D path for creative shapes.
*   **Game-Ready Post-Processing:**
    *   Automated mesh cleaning (removing degenerate faces/vertices).
    *   Conversion to `.glb` format (standard for Unity/Unreal/Web).
    *   Texture baking and UV mapping.
*   **Experimentation Framework:**
    *   CLI tools to test variations in guidance scale, inference steps, and seeds.
    *   Structured output organization for comparing parameter effects.

### **Tech Stack**
*   **Core:** Python 3.10+
*   **2D Generation:** Hugging Face `diffusers` (Stable Diffusion, PixArt-Alpha)
*   **3D Generation:** [`TripoSR`](TripoSR ), `Shap-E`
*   **Processing:** `Trimesh`, `RemBG` (Background Removal)
*   **Hardware:** Optimized for consumer GPUs (CUDA) with CPU offloading support.

---

### **Why This Matters (Trade-offs & Decisions)**
*   **TripoSR vs. Shap-E:** TripoSR was chosen as the primary driver for its superior ability to handle complex textures and faster inference times compared to Shap-E's voxel-based approach.
*   **GLB Optimization:** Raw `.obj` files are often unoptimized. This pipeline automatically converts them to `.glb` to ensure they are ready for immediate import into game engines.
*   **Modular Design:** The system is decoupled (Image Gen -> Mesh Gen -> Post-Process), allowing individual components to be swapped or upgraded without breaking the pipeline.

---

##  Modifications to TripoSR

This project includes a modified version of the [TripoSR](https://github.com/VAST-AI-Research/TripoSR) library. 
We have integrated it directly into the source tree ("vendored") to apply critical fixes for Windows environments:

1.  **Build Tool Workaround:** Replaced `torchmcubes` (which requires complex C++ build tools) with `skimage.measure.marching_cubes` for easier deployment.
2.  **Device Management:** Fixed CUDA/CPU device mismatch errors in `bake_texture.py` and `isosurface.py`.
3.  **Dependency Conflicts:** Adjusted requirements to prevent version clashes with the image generation pipeline.

---

## ⚖️ License & Credits

This project is built using open-source components:

*   **TripoSR**: Developed by VAST-AI-Research. Licensed under MIT. 
    *   *Note: We have included a modified version of the TripoSR source code in this repository to support Windows environments and CPU/GPU offloading.*
    *   Original Repository: [https://github.com/VAST-AI-Research/TripoSR](https://github.com/VAST-AI-Research/TripoSR)




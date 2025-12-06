# Game 3D Generator (Scaffold)

Pipeline scaffold for Prompt → Image → Mesh → Post-processing → Validation to produce game-ready OBJ/GLB assets.

## Pipeline Diagram (text)
- prompt → generate_image (Stable Diffusion CPU)
- image → image_to_mesh (TripoSR or similar)
- mesh → postprocess (clean, decimate, LODs, convert_to_glb)
- mesh → validation (poly/vertex/UV/texture checks)
- optional API → in-memory queue + worker

## How to Run (placeholders)
- TODO: Set up environment and install dependencies.
- TODO: Add model weights/paths for Stable Diffusion + TripoSR.
- TODO: Configure output directories under `outputs/`.
- TODO: Execute individual scripts or run the FastAPI server.

## TODOs
- Implement all stubs in `generate_image.py`, `image2mesh.py`, `postprocess.py`, `validation.py`.
- Wire the end-to-end pipeline inside the API worker.
- Add tests and sample prompts.
- Document hardware requirements and performance tips.



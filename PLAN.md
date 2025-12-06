# Implementation Next Steps

## Scope
Implement the prompt→image→mesh→post-process→validation pipeline and optional FastAPI queue using the root-level scaffold.

## Plan
- clarify-config: Confirm environment targets (CPU/GPU), preferred Stable Diffusion variant, and TripoSR model source.
- fill-image-gen: Implement `generate_image` in `generate_image.py` with CPU-friendly SD pipeline, seeding, and image save.
- fill-image2mesh: Implement `image_to_mesh` in `image2mesh.py` loading TripoSR and exporting OBJ + texture.
- fill-postprocess: Implement mesh cleanup/decimation/LOD/GLB conversion in `postprocess.py` using trimesh/pymeshlab.
- fill-validation: Implement `validate_mesh` in `validation.py` computing poly/vertex counts, UV/texture checks, and report.
- wire-api: Implement FastAPI queue, job tracking, worker loop, and endpoints in `api.py` calling pipeline steps.
- docs-experiments: Update `README.md` and `experiments.md` with run instructions, model paths, and experiment settings.
- outputs-structure: Ensure `outputs/` subdirs are created/populated during pipeline runs and paths are consistent.

## Todos
- clarify-config: Confirm SD + TripoSR choices and hardware assumptions.
- fill-image-gen: Implement text-to-image generation.
- fill-image2mesh: Implement image-to-mesh conversion.
- fill-postprocess: Implement mesh post-processing utilities.
- fill-validation: Implement mesh validation report.
- wire-api: Implement FastAPI endpoints, queue, and worker.
- docs-experiments: Update README and experiments templates.
- outputs-structure: Ensure output directories and paths are handled.


